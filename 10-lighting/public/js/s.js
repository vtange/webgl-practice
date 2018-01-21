var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-50, 50, -50), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(55, 15, 55));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
	
    BABYLON.SceneLoader.ImportMesh("SketchUp", "https://raw.githubusercontent.com/vtange/webgl-practice/master/09-camera-follow/public/assets/", "room5.gltf", scene, function (meshes) {
	    meshes.forEach(function(m){
            if(m.parent) {
                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.9, ignoreParent: true }, scene);
            } 
		});
        spheres.forEach(sphere => {
            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
        });
    }, undefined, (scene, err, exception) => {console.log(exception)} );

    return scene;

};
