function Scene(game, options)
{
	// Create scene (contains our game elements and models) 
	this.self = new BABYLON.Scene(game.engine);
	this.options = options;
	this.engine = game.engine;
	this.canvas = game.canvas;

	// Create the camera
	this.camera = this.getCamera();
	this.self.activeCamera = this.camera;

	// Create light
	this.shadowGen = this.getLighting();
}
Scene.prototype.getCamera = function(){
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("Camera", 0.8, 2, -10, new BABYLON.Vector3(0, 0, 0), this.self);

    // This attaches the camera to the canvas
	camera.attachControl(this.canvas, true);

	return camera;
};
Scene.prototype.getLighting = function(){
	var sun = new BABYLON.DirectionalLight("Omni0", new BABYLON.Vector3(0, -1, 0), this.self);
	sun.diffuse = new BABYLON.Color3(0.9, 1, 1);
};

Scene.prototype.loadMeshes = function(gameState)
{
	var scene = this.self;
	var playerBall = this.playerMesh;
    var meshLoadPromiseChain = gameState.arrMeshList.map(function(mesh){
		return new Promise(function(resolve,fail){
			// Import Mesh Model to the scene
			BABYLON.SceneLoader.ImportMesh(mesh.strName, mesh.strFolderName, mesh.strFilename, scene, function (meshes) {
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
};

Scene.prototype.assembleGameAssets = function(gameState)
{
	BABYLON.Engine.ShadersRepository = "js/shaders/";

	this.loadMeshes(gameState);
	this.buildWorld(gameState);
};

Scene.prototype.buildSkybox = function(){
    this.self.clearColor=new BABYLON.Color3(0.8,0.8,0.8);
}

Scene.prototype.buildWorld = function(gameState){
	/*----------------
	SKY
	----------------*/
	this.buildSkybox();
	/*----------------
	GROUND
	----------------*/
	// Use sketchup model for ground.
};
