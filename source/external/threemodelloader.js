OV.ThreeModelLoader = class {
    constructor() {
        this.importer = new OV.Importer();
        this.importer.AddImporter(new OV.Importer3dm());
        this.callbacks = null;
        this.hasHighpDriverIssue = OV.HasHighpDriverIssue();
    }

    Init(callbacks) {
        this.callbacks = callbacks;
    }

    async LoadFromUrlList(urls, settings) {
        let obj = this;
        this.callbacks.onLoadStart();
        await new Promise(resolve => this.importer.LoadFilesFromUrls(urls, async function() {
            await obj.OnFilesLoaded(settings);
            resolve();
        }));
    }

    async LoadFromFileList(files, settings) {

        console.log(files);
        let obj = this;
        this.callbacks.onLoadStart();
        await new Promise(resolve => this.importer.LoadFilesFromFileObjects(files, async function() {
            await obj.OnFilesLoaded(settings);
            resolve();
        }));

    }


    async LoadFromRSExport(files, settings, website) {
        let obj = this;
        // this.callbacks.onLoadStart();
        let zipInfo = await JSZip.loadAsync(files[0]);
        console.log(zipInfo);
        let jsonData = await zipInfo.files['data.json'].async("string");
        jsonData = JSON.parse(jsonData);
        console.log(jsonData);

        for (let resultType in jsonData) {
            let typeGroup = new OV.TreeViewGroupItem(resultType);
            website.menu.treeView.AddItem(typeGroup);
            for (let result in jsonData[resultType]) {
                let btnItem = new OV.TreeViewButtonItem(result);
                let btn = new OV.TreeViewButton('assets/images/toolbar/open.svg');
                btn.OnClick(async function() {
                    try {
                        visibilityGroup.GetChildrenDiv().empty()
                    } catch {
                        console.log('This is the First Load!')
                    }
                    website.ClearModel();
                    for (let mesh in jsonData[resultType][result]) {
                        console.log(website);
                        try {
                            website.modelIndex[mesh] = [website.menu.modelData.meshDataArr.length]
                        } catch {
                            website.modelIndex[mesh] = [0]
                        }
                        let visibilityBtn = new OV.TreeViewButton('assets/images/toolbar/open.svg');
                        let visibilityBtnItem = new OV.TreeViewButtonItem(mesh);
                        visibilityBtn.OnClick(function() {
                            for (let hi = website.modelIndex[mesh][0]; hi < website.modelIndex[mesh][1]; hi++) {
                                let meshData = website.modelInfo.GetMeshData(hi);

                                meshData.SetVisible(!meshData.IsVisible());

                            }
                            website.UpdateMeshesVisibility();
                        });
                        visibilityBtnItem.AddButton(visibilityBtn);
                        visibilityGroup.AddChild(visibilityBtnItem);
                        console.log(jsonData[resultType][result][mesh]);
                        let a = new File([await zipInfo.files[jsonData[resultType][result][mesh][0]].async('blob')], jsonData[resultType][result][mesh][0]);
                        let b = new File([await zipInfo.files[jsonData[resultType][result][mesh][1]].async('blob')], jsonData[resultType][result][mesh][1]);
                        await obj.LoadFromFileList([a, b]);
                        website.modelInfo = website.menu.modelData;
                        website.modelIndex[mesh].push(website.menu.modelData.meshDataArr.length);
                        console.log(website.modelIndex);
                    }
                    for (let i = 0; i < website.modelInfo.meshDataArr.length; i++) {
                        website.viewer.geometry.modelMeshes[i].userData.originalMeshIndex = i;
                    }


                });
                btnItem.AddButton(btn);
                typeGroup.AddChild(btnItem);
            }
        }
        let visibilityGroup = new OV.TreeViewGroupItem('Visibility Ctrl');
        website.menu.treeView.AddItem(visibilityGroup)
    }


    ReloadFiles(settings) {

        this.callbacks.onLoadStart();
        this.OnFilesLoaded(settings);
    }

    async OnFilesLoaded(settings) {
        let obj = this;
        await this.callbacks.onImportStart();
        await new Promise((resolve, reject) => obj.importer.Import(settings, {
            onSuccess: async function(importResult) {
                await obj.OnModelImported(importResult);
                resolve();
            },
            onError: function(importError) {
                obj.callbacks.onLoadError(importError);
                reject();
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
    async OnModelImported(importResult) {
        let obj = this;
        this.callbacks.onVisualizationStart();
        let params = new OV.ModelToThreeConversionParams();
        params.forceMediumpForMaterials = this.hasHighpDriverIssue;
        await new Promise(resolve => OV.ConvertModelToThreeMeshes(importResult.model, params, {
            onTextureLoaded: async function(importResult) {
                obj.callbacks.onTextureLoaded(importResult);
            },
            onModelLoaded: async function(meshes) {
                await obj.callbacks.onModelFinished(importResult, meshes);
                this.inProgress = false;
                resolve()
            }
        }));
    }
    GetImporter() {
        return this.importer;
    }
};