var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("Camera", 0.8, 2, -10, new BABYLON.Vector3(0, 0, 0), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    var arrMeshList = [
        ["Plane","https://raw.githubusercontent.com/vtange/webgl-practice/master/10-lighting/public/assets/","wall_sconce.gltf"],
        ["col","https://raw.githubusercontent.com/vtange/webgl-practice/master/10-lighting/public/assets/","wall_sconce.gltf"],
        ["sconce","https://raw.githubusercontent.com/vtange/webgl-practice/master/10-lighting/public/assets/","wall_sconce.gltf"]
    ];

    var meshLoadPromiseChain = arrMeshList.map(function(mesh){
		return new Promise(function(resolve,fail){
			// Import Mesh Model to the scene
			BABYLON.SceneLoader.ImportMesh(mesh[0], mesh[1], mesh[2], scene, function (meshes) {
				if(!meshes.length)
				{
					console.log("failed to load model: ", mesh.strName, mesh.strFolderName, mesh.strFilename);
					fail();
					return;
				}
				meshes.forEach(function(m){
				});
				resolve(true);
			});
        });
    }.bind(this));

    return scene;

};
