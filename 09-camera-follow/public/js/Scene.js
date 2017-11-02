function Scene(game, options)
{
	// Create scene (contains our game elements and models) 
	this.self = new BABYLON.Scene(game.engine);
	this.options = options;
	this.engine = game.engine;
	this.canvas = game.canvas;
	this.spriteManagerPlayer = new BABYLON.SpriteManager("playerManagr","assets/Player.png", 2, 64, this.self);

	var phys = new BABYLON.CannonJSPlugin(); // new BABYLON.OimoJSPlugin()
	var grav = new BABYLON.Vector3(0, -9.8, 0);
	this.self.enablePhysics( grav, phys);
	//this.self.enablePhysics();
	// Enable collisions globally. 
	//this.self.collisionsEnabled = true;

	this.playerMesh = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this.self);
	this.playerMesh.position.x = 55;
	this.playerMesh.position.y = 23;
	this.playerMesh.position.z = 55;
	this.playerMesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.playerMesh, BABYLON.PhysicsImpostor.BoxImpostor,  { mass: 1, friction:999, restitution: 0 }, this.self);
	// Create the camera
	this.camera = this.getCamera(this.playerMesh);
	this.self.activeCamera = this.camera;

	var ground = BABYLON.Mesh.CreateGround("ground1", 96, 96, 2,  this.self);
	ground.position.x = 55;
	ground.position.y = -10;
	ground.position.z = 55;
	console.log(ground);
	ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.self);


	// Create light
	this.shadowGen = this.getLighting();
}
Scene.prototype.getCamera = function(followMesh){
	var camera = new BABYLON.ArcFollowCamera("FollowCam", 0.75, 0.75, 100, followMesh, this.self);
	//prevent any rotation
	camera.lowerAlphaLimit = 0.74995;
	camera.upperAlphaLimit = 0.75005;
	camera.lowerBetaLimit = 0.74995;
	camera.upperBetaLimit = 0.75005;
	//zoom limits
	camera.lowerRadiusLimit = 10;
	camera.upperRadiusLimit = 200;
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
	// Load the model
	/*
    BABYLON.SceneLoader.ImportMesh("SketchUp", "https://raw.githubusercontent.com/vtange/webgl-practice/master/09-camera-follow/public/assets/", "room3.gltf", scene, function (meshes) {

    });
*/
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
					//if(!mesh.isGround) m.isVisible = false;
					m.position.x = 0;
					m.position.y = 0;
					m.position.z = 0;
					m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.9 }, scene);
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
		player.position.y = player.height/2;
		player.position.z = -55;
		player.playAnimation(0, 43, true, 100);
		player.parent = this.playerMesh; //does not work
		this.playerMesh.sprite = player;
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
