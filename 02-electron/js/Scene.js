function Scene(canvas, engine, options)
{
	// Create scene (contains our game elements and models) 
	this.self = new BABYLON.Scene(engine);

	// Create the camera
	this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), this.self);
	this.camera.setTarget(new BABYLON.Vector3(0,0,10));
	this.camera.attachControl(canvas);

	// Create light
	this.light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), this.self);

	this.options = options;
}

Scene.prototype.loadMeshes = function(gameState)
{
	var strName = "red_toad", strFolderName = "assets/",strFilename = "toad.babylon", scene = this.self;

	// Import Mesh Model to the scene
	BABYLON.SceneLoader.ImportMesh(strName, strFolderName, strFilename, scene, function (meshes) {
		var model = meshes[0];
		model.isVisible = false;
		model.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
		gameState.MODELS[strName] = model;
	});
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
	this.loadMeshes(gameState);
	this.buildWorld(gameState);
};

Scene.prototype.buildSkybox = function(){
	// create a skybox
	var skybox = BABYLON.Mesh.CreateBox("cubemap", 100.0, this.self);

	// The sky creation
	var skyboxMaterial = new BABYLON.StandardMaterial("cubemap", this.self);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/cubemap/cubemap", this.self);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

	// box + sky = skybox !
	skybox.material = skyboxMaterial;
}


Scene.prototype.buildWorld = function(gameState){
	/*----------------
	SKY
	----------------*/
	this.buildSkybox();

	/*----------------
	LANES
	----------------*/
	var laneTexture = {
		name: "ground",
		img: "assets/ground.jpg",
		color: null
	};
	laneTexture = this.createMaterial(laneTexture, this.self);
	
	var laneTailTexture = {
		name: "tailMat",
		img: null,
		color: {
			r:0.8,
			g:0.2,
			b:0.2
		}
	}
	var laneTailTexture = this.createMaterial(laneTailTexture, this.self); //red mat

	var currentLanePosition = this.options.LANE_INTERVAL * -1 * (this.options.NO_OF_LANES/2);
	for (var i = 0, j=this.options.NO_OF_LANES; i<j; i++){
		gameState.LANES_POSITIONS[i] = new Lane(currentLanePosition);
		gameState.LANES_POSITIONS[i].create(i, currentLanePosition, laneTexture, this.self);
		gameState.TAILS.push(gameState.LANES_POSITIONS[i].createTail(i, currentLanePosition, laneTailTexture, this.self));
		currentLanePosition += this.options.LANE_INTERVAL;
	}

	/*----------------
	CAMERA
	----------------*/
	this.camera.position.x = gameState.LANES_POSITIONS[Math.floor(this.options.NO_OF_LANES/2)];

	/*----------------
	RECURRING ELEMENTS
	----------------*/
	setInterval(this.createEnemy.bind(this,gameState), 1000);
};

Scene.prototype.createEnemy = function(gameState){
	// Creates a shroom in a random lane
	// Start them far away
	var posZ = 100;

	// Get a random lane
	var posX = gameState.LANES_POSITIONS[Math.floor(Math.random() * this.options.NO_OF_LANES)];

	var TOAD_MODEL = gameState.MODELS["red_toad"];

	// Create a clone of our template
	var shroom = new Shroom(TOAD_MODEL.clone(TOAD_MODEL.name), gameState.ENEMIES);

	shroom.id = TOAD_MODEL.name+(gameState.ENEMIES.length+1);
	// Our toad has not been killed yet !
	shroom.killed = false;
	// Set the shroom visible
	shroom.isVisible = true;
	// Update its position
	shroom.position = new BABYLON.Vector3(posX, shroom.m.position.y/2, posZ);

	gameState.ENEMIES.push(shroom);
}