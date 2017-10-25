function Scene(canvas, engine, options)
{
	var _this = this;
	// Create scene (contains our game elements and models) 
	this.self = new BABYLON.Scene(engine);
	//this.self.checkCollisions = true;
	this.options = options;
	this.engine = engine;
	this.canvas = canvas;

	// Create the camera
	this.camera = this.getCamera();
	this.camera.getMinX = function(){
		return ((this.camera.radius * 100) / 140)+12;
	}.bind(this);
	this.camera.getMaxX = function(){
		return ((this.camera.radius * 100) / 140)+150;
	}.bind(this);
	this.self.beforeCameraRender = function(){
		if(_this.camera.position.x < _this.camera.getMinX())
		{
			if(_this.camera.inertialPanningY > 0)
			{
				_this.camera.inertialPanningY = 0;
			}
		}
		else if(_this.camera.position.x > _this.camera.getMaxX())
		{
			if(_this.camera.inertialPanningY < 0)
			{
				_this.camera.inertialPanningY = 0;
			}
		}
	}
	
	// Create light
	this.shadowGen = this.getLighting();
}
Scene.prototype.getCamera = function(){
	// Camera attached to the canvas
    //var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(75, 50, 0), this.self);
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 150, new BABYLON.Vector3(75, 5, 75), this.self);
	//camera.setTarget(new BABYLON.Vector3(75,0,75)); // the viewing angle for Free Camera
	camera.inputs.clear();  // Remove all previous inputs
	camera.inputs.add( new MyArcRotateCameraPointersInput() ); // Add the new custom input

	//pan along x and z, not y
	camera.panningAxis = {x: 1, y: 0, z: 1};
	//prevent any rotation
	camera.lowerAlphaLimit = -0.00005;
	camera.upperAlphaLimit = 0.00005;
	camera.lowerBetaLimit = 0.79995;
	camera.upperBetaLimit = 0.80005;
	//zoom limits
	camera.lowerRadiusLimit = 10;
	camera.upperRadiusLimit = 200;
	
    // This attaches the camera to the canvas
    camera.attachControl(this.canvas, true);

	// Disable the right click context menu
	//window.addEventListener("contextmenu", function (evt){	evt.preventDefault();});

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
				meshes.forEach(function(mesh){
					mesh.isVisible = false;
				});
				//gameState.MODELS[mesh.strName] = model;
				resolve(true);
			});
        });
    }.bind(this));
	Promise.all(meshLoadPromiseChain).then(function(resolveArgs){
		//this.deployMeshes(gameState);
	}.bind(this));
};

Scene.prototype.deployMeshes = function(gameState){
/*
	var HAU_MODEL = gameState.MODELS["mesh3"];

	// Create a clone of our template
	var hau = new Character(HAU_MODEL.clone(HAU_MODEL.name));
	//hau.m == model 

	hau.id = hau.m.id = HAU_MODEL.name+(gameState.chars.length+1);
	hau.killed = false;
	hau.m.isVisible = true;
	hau.m.position = new BABYLON.Vector3(0, 0, 0);

	gameState.chars.push(hau);
	*/
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
	//CreateGroundFromHeightMap( name, heightmap_url, mesh_size, width, height, subdivisioncount, scene, bUpdatable)
	var worldMap = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "assets/heightMap.png", 150, 150, 150, 0, 10, this.self, false);
	worldMap.position.x = 75;
	worldMap.position.y = 3;
	worldMap.position.z = 75;

	var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", this.self);
	terrainMaterial.mixTexture = new BABYLON.Texture("assets/mixmap.png", this.self);
	terrainMaterial.diffuseTexture1 = new BABYLON.Texture("assets/grs1.jpg", this.self);
	terrainMaterial.diffuseTexture2 = new BABYLON.Texture("assets/plains.jpg", this.self);
	terrainMaterial.diffuseTexture3 = new BABYLON.Texture("assets/des3.jpg", this.self);
	worldMap.material = terrainMaterial;
	
	/*----------------
	NORTH, SOUTH WALL FOR CAMERA
	----------------*/
	/*
	var cellColor = {
		name: "oneCell",
		img: null,
		color: {
			r:Math.random().toFixed(1),
			g:Math.random().toFixed(1),
			b:Math.random().toFixed(1)
		}
	}
	var cellTexture = this.createMaterial(cellColor, this.self); //red mat
	var plane = BABYLON.Mesh.CreatePlane("plane", 300.0, this.self, false, BABYLON.Mesh.DOUBLESIDE );
	plane.position.x = 0;
	plane.position.y = 0;
	plane.position.z = 75;
	plane.rotation.y = (Math.PI/2);
	plane.material = cellTexture;
	plane.checkCollisions = true;
	*/
	/*----------------
	LANES
	----------------*/
	/*
	var mapDims = [100,50];
	var idCount = 0;
	var cellColor = {
		name: "oneCell",
		img: null,
		color: {
			r:Math.random().toFixed(1),
			g:Math.random().toFixed(1),
			b:Math.random().toFixed(1)
		}
	}
	var cellTexture = this.createMaterial(cellColor, this.self); //red mat
	gameState.MAP = [];
	for (var i = 0; i < mapDims[0]; i++){
		for (var j = 0; j < mapDims[1]; j++){


		if(!gameState.MAP[i]) gameState.MAP[i] = [];
		gameState.MAP[i][j] = new Cell(i,j,idCount);
		gameState.MAP[i][j].create(cellTexture, this.self);
		idCount++;
		}
	}*/
};
