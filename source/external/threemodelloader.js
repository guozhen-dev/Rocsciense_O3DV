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
        //website.menu.treeView.Clear();
        let obj = this;
        // this.callbacks.onLoadStart();
        let zipInfo = await JSZip.loadAsync(files[0]);
        console.log(zipInfo);
        let jsonData = await zipInfo.files['data.json'].async("string");
        let stageData = await zipInfo.files['stage.json'].async("string");
        let colorData = await zipInfo.files['color.json'].async("string");
        let geoData = await zipInfo.files['geo.json'].async("string");

        geoData = JSON.parse(geoData);
        colorData = JSON.parse(colorData);
        jsonData = JSON.parse(jsonData);
        stageData = JSON.parse(stageData); //Notice here the data itself was over written. 
        console.log(jsonData);
        console.log(stageData);
        for (let resultType in jsonData) {
            if (resultType == "INTERNAL_COLOR_BAR") {
                continue;
            }
            let typeGroup = new OV.TreeViewGroupItem(resultType, 'assets/images/tree/details.svg');
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
                    console.log(colorData[result]);
                    website.ClearModel();
                    let colorBar = document.getElementById('color_block_container');
                    colorBar.innerHTML = '';
                    let mindiv = document.createElement('div');
                    mindiv.innerText = "Min Value = " + parseFloat(colorData[result]['minValue']);
                    colorBar.appendChild(mindiv);
                    for (let colorIdx in colorData[result]['colors']) {
                        // console.log(colorIdx);
                        if (colorIdx == colorData[result]['colors'].length - 1) break;
                        let div = document.createElement('div');
                        let color = colorData[result]['colors'][colorIdx].replace("#", "0x");
                        let r = Math.floor(((color & 0xff0000) / 0xff00));
                        let g = Math.floor((color & 0xff00) / 0xff);
                        let b = Math.floor(color & 0xff);
                        div.style = 'background: rgb(' + [r, g, b].join(',') + ')';
                        let step = parseFloat(colorData[result]['maxValue']) - parseFloat(colorData[result]['minValue']);
                        step /= colorData[result]['colors'].length;
                        let value = parseFloat(colorData[result]['minValue']) + step * colorIdx
                        if (colorIdx % Math.floor(colorData[result]['colors'].length / 10) == 0) {
                            div.innerText = value;
                        } else {
                            div.innerText = " ";
                        }
                        div.className = "color_bar_item";
                        // console.log(div);
                        colorBar.appendChild(div);
                    }
                    let maxdiv = document.createElement('div');
                    maxdiv.innerText = "Max Value = " + parseFloat(colorData[result]['maxValue']);
                    colorBar.appendChild(maxdiv);
                    let unit = document.createElement('div');
                    unit.innerHTML = colorData[result]['unit'];
                    colorBar.appendChild(unit);
                    //loading the geometry 
                    for (let geoItem in geoData["geo"]) {
                        let a = new File([await zipInfo.files[geoData["geo"][geoItem] + ".obj"].async('blob')], geoData["geo"][geoItem] + ".obj");
                        let b = new File([await zipInfo.files[geoData["geo"][geoItem] + ".mtl"].async('blob')], geoData["geo"][geoItem] + ".mtl");
                        // console.log([a, b]);
                        await obj.LoadFromFileList([a, b]);
                    }

                    //loading the result 
                    console.log(jsonData[resultType][result]);
                    for (let mesh in jsonData[resultType][result]) {
                        try {
                            website.modelIndex[mesh] = [website.menu.modelData.meshDataArr.length]
                        } catch {
                            website.modelIndex[mesh] = [0]
                        }
                        let visibilityBtn = new OV.TreeViewButton('assets/images/tree/visible.svg');
                        let visibilityBtnItem = new OV.TreeViewButtonItem(mesh);
                        visibilityBtn.OnClick(function() {
                            let currentVis = true;
                            for (let hi = website.modelIndex[mesh][0]; hi < website.modelIndex[mesh][1]; hi++) {
                                console.log(hi);
                                let meshData = website.modelInfo.GetMeshData(hi);
                                if (meshData.IsVisible()) {
                                    currentVis = false;
                                }
                                meshData.SetVisible(!meshData.IsVisible());

                                console.log(meshData);
                            }
                            if (!currentVis) {
                                visibilityBtn.SetImage('assets/images/tree/hidden.svg');
                            } else {
                                visibilityBtn.SetImage('assets/images/tree/visible.svg');
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
                    let stageDiv = document.createElement('div');
                    stageDiv.innerText = stageData['stage'];
                    stageDiv.id = "stage_info";
                    stageDiv.className = "stage_info";
                    let mainViewer = document.getElementById("main_viewer");
                    mainViewer.appendChild(stageDiv);
                    // document.getElementsByTagName("")
                    website.viewer.orientationGizmo = new OrientationGizmo(website.viewer.camera, { size: 98, padding: 8 });
                    document.getElementById("main_viewer").appendChild(website.viewer.orientationGizmo);
                    website.Resize();
                    visibilityGroup.ShowChildren(true);
                    typeGroup.ShowChildren(false);
                });
                btnItem.AddButton(btn);
                typeGroup.AddChild(btnItem);

            }
            typeGroup.ShowChildren(true);

        }
        let visibilityGroup = new OV.TreeViewGroupItem('Visibility Ctrl', 'assets/images/tree/visible.svg');
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