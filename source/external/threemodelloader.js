OV.ThreeModelLoader = class
{
    constructor ()
    {
        this.importer = new OV.Importer ();
        this.importer.AddImporter (new OV.Importer3dm ());
        this.callbacks = null;
        this.hasHighpDriverIssue = OV.HasHighpDriverIssue ();
    }

    Init (callbacks)
    {
        this.callbacks = callbacks;
    }

    async LoadFromUrlList (urls, settings)
    {
        let obj = this;
        this.callbacks.onLoadStart ();
        await new Promise(resolve =>  this.importer.LoadFilesFromUrls (urls, async function () {
            await obj.OnFilesLoaded (settings);
			resolve(); 
        }));
    }

    async LoadFromFileList (files, settings)
    {
 
        console.log(files);
        let obj = this;
        this.callbacks.onLoadStart ();
        await new Promise(resolve=>this.importer.LoadFilesFromFileObjects (files, async function () {
            await obj.OnFilesLoaded (settings);
            resolve() ; 
        }));
        
    }


    async LoadFromRSExport (files, settings){
        let obj = this;
        // this.callbacks.onLoadStart();
        let zipInfo = await JSZip.loadAsync(files[0]);
        console.log(zipInfo);
        let jsonData = await zipInfo.files['data.json'].async("string"); 
        jsonData = JSON.parse(jsonData);
        console.log(jsonData);
        for (let x in jsonData){
            for (let y in jsonData[x]){
                for (let z in jsonData[x][y]){
                    console.log(jsonData[x][y][z]);
                    console.log("hello!~~~~");
                    let a = new File([await zipInfo.files[jsonData[x][y][z][0]].async('blob')],jsonData[x][y][z][0]);
                    let b = new File([await zipInfo.files[jsonData[x][y][z][1]].async('blob')],jsonData[x][y][z][1]);
                    obj.LoadFromFileList([a,b]);
                    //obj.LoadFromFileList([await zipInfo.files[jsonData[x][y][z][0]].async('blob'), await zipInfo.files[jsonData[x][y][z][1]].async('blob')]);
                }
                break; 
            }
        }
    }
    

    ReloadFiles (settings)
    {

        this.callbacks.onLoadStart ();
        this.OnFilesLoaded (settings);        
    }
    
    async OnFilesLoaded (settings)
    {
        let obj = this;
        await this.callbacks.onImportStart ();
        await new Promise((resolve, reject) => obj.importer.Import (settings, {
            onSuccess : async function (importResult) {
                await obj.OnModelImported (importResult);
				resolve() ; 
            },
            onError : function (importError) {
                obj.callbacks.onLoadError (importError);
				reject() ; 
            }
        }));
		
    }
/*
    async OnModelImported (importResult)
    {
        let obj = this;
        this.callbacks.onVisualizationStart ();
        let params = new OV.ModelToThreeConversionParams ();
        params.forceMediumpForMaterials = this.hasHighpDriverIssue;
        OV.ConvertModelToThreeMeshes (importResult.model, params, {
            onTextureLoaded : async function () {
                await obj.callbacks.onTextureLoaded ();
            },
            onModelLoaded : async function (meshes) {
                await obj.callbacks.onModelFinished (importResult, meshes);
                obj.inProgress = false;
            }
        });
    }
*/
	async OnModelImported (importResult)
    {
        let obj = this;
        this.callbacks.onVisualizationStart ();
        let params = new OV.ModelToThreeConversionParams ();
        params.forceMediumpForMaterials = this.hasHighpDriverIssue;
        await new Promise(resolve=>OV.ConvertModelToThreeMeshes (importResult.model, params, {
            onTextureLoaded:async function(importResult){
			obj.callbacks.onTextureLoaded(importResult); 
			},
            onModelLoaded: async function (meshes) {
                await obj.callbacks.onModelFinished (importResult, meshes);
				this.inProgress = false; 
                resolve()
            }
        }));
    }
    GetImporter ()
    {
        return this.importer;
    }
};
