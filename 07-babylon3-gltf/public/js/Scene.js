function Scene(canvas, engine, options)
{
	// Create scene (contains our game elements and models) 
	this.self = new BABYLON.Scene(engine);
	this.options = options;
	this.engine = engine;
	this.canvas = canvas;

	// Create the camera
	this.camera = this.getCamera();

	// Create light
	this.shadowGen = this.getLighting();
}
Scene.prototype.getCamera = function(){
	// Camera attached to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", 0.67,1.2, 150, BABYLON.Vector3.Zero(), this.self);
    camera.attachControl(this.canvas);
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
				console.log("got meshes");
				/*
				meshes.forEach(function(mesh){
					mesh.isVisible = false;
				});*/
				gameState.MODELS[mesh.strName] = meshes;
				resolve(true);
			});
        });
    }.bind(this));
	Promise.all(meshLoadPromiseChain).then(function(resolveArgs){
		//this.deployMeshes(gameState);
	}.bind(this));
};

Scene.prototype.deployMeshes = function(gameState){

	var HAU_MODEL = gameState.MODELS["mesh3"];

	// Create a clone of our template
	var hau = new Character(HAU_MODEL.clone(HAU_MODEL.name));
	//hau.m == model 

	hau.id = hau.m.id = HAU_MODEL.name+(gameState.chars.length+1);
	hau.killed = false;
	hau.m.isVisible = true;
	hau.m.position = new BABYLON.Vector3(0, 0, 0);

	gameState.chars.push(hau);
};

Scene.prototype.loadScenes = function(gameState)
{
    gameState.arrMeshList.forEach(function(mesh){
        // Import Mesh Model to the scene
        BABYLON.SceneLoader.Load(mesh.strFolderName, mesh.strFilename, this.engine, function (scenes) {
			if(!scenes.length)
			{
				console.log("failed to load scene: ", mesh.strName, mesh.strFolderName, mesh.strFilename);
				return;
			}
			console.log(scenes);
        });
    }.bind(this))
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
    var groundMaterial = new BABYLON.StandardMaterial("ground", this.self);
    groundMaterial.diffuseTexture = new BABYLON.Texture("assets/ground.jpg", this.self);
    groundMaterial.diffuseTexture.uScale = 6;
    groundMaterial.diffuseTexture.vScale = 6;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // Ground
    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "assets/heightMap.png", 100, 100, 100, 0, 10, this.self, false);
    ground.position.y = 0;
    ground.material = groundMaterial;

};
