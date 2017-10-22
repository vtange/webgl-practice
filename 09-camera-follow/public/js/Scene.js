function Scene(canvas, engine, options)
{
	// Create scene (contains our game elements and models) 
	this.self = new BABYLON.Scene(engine);
	this.options = options;
	this.engine = engine;
	this.canvas = canvas;
	this.spriteManagerPlayer = new BABYLON.SpriteManager("playerManagr","assets/Player.png", 2, 64, this.self);

	// Create the camera
	this.camera = this.getCamera();
	this.self.activeCamera = this.camera;

	// Create light
	this.shadowGen = this.getLighting();
}
Scene.prototype.getCamera = function(){

	this.playerMesh = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this.self);
	this.playerMesh.position.x = -55;
	this.playerMesh.position.y = 1;
	this.playerMesh.position.z = -55;
	
	var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(55, 55, 55), this.self);
	camera.radius = 70; // how far from the object to follow
	camera.heightOffset = 50; // how high above the object to place the camera
	camera.rotationOffset = 25; // the viewing angle
	camera.cameraAcceleration = 0.05 // how fast to move
	camera.maxCameraSpeed = 20 // speed limit
	camera.lockedTarget = this.playerMesh; // target any mesh or object with a "position" Vector3

	return camera;
};
Scene.prototype.getLighting = function(){

	var sun = new BABYLON.DirectionalLight("Omni0", new BABYLON.Vector3(0, -1, 0), this.self);
	sun.diffuse = new BABYLON.Color3(0.9, 1, 1);
};

Scene.prototype.loadMeshes = function(gameState)
{
	var scene = this.self;
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
				console.log("got mesh");
				meshes.forEach(function(m){
					if(!mesh.isGround) m.isVisible = false;
				});
				//hide all models other than ground, deploy as needed
				resolve(true);
			});
        });
    }.bind(this));
	Promise.all(meshLoadPromiseChain).then(function(resolveArgs){
		console.log("got meshes");

		//deploy sprites
		var player = new BABYLON.Sprite("player", this.spriteManagerPlayer);
		player.width = 8;
		player.height = 8;
		player.position.x = -55;
		player.position.z = -55;
		player.position.y = player.height/2;
		player.playAnimation(0, 43, true, 100);
		player.parent = this.playerMesh;
	}.bind(this));
};


Scene.prototype.createMaterial = function(blueprint)
{
	/*
	blueprint = {
		name:name,
		img: __,
		color: {r:g:b:}
	}
	*/
	var material = new BABYLON.StandardMaterial(blueprint.name, this.self);
	if(blueprint.img)
	{
		var texture = new BABYLON.Texture(blueprint.img, this.self);
		texture.uScale = 40;
		texture.vScale = 2;
		material.diffuseTexture = texture;
	}
	else
	{
		material.diffuseColor = new BABYLON.Color3(blueprint.color.r,blueprint.color.g,blueprint.color.b);
	}
	return material;
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