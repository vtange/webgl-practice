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

    var sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(60, 100, 10), this.self);
};

Scene.prototype.loadMeshes = function(gameState)
{
    gameState.arrMeshList.forEach(function(mesh){
        // Import Mesh Model to the scene
        BABYLON.SceneLoader.ImportMesh(mesh.strName, mesh.strFolderName, mesh.strFilename, this.self, function (meshes) {
			if(!meshes.length)
			{
				console.log("failed to load model: ", mesh.strName, mesh.strFolderName, mesh.strFilename);
				return;
			}
            var model = meshes[0];
            model.isVisible = false;
            model.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
            gameState.MODELS[strName] = model;
        });
    }.bind(this))
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
	this.loadMeshes(gameState);
	//this.loadScenes(gameState);
	this.buildWorld(gameState);
};

Scene.prototype.buildSkybox = function(){
    // The box creation
    var skybox = BABYLON.Mesh.CreateSphere("skyBox", 100, 1000, this.self);

    // The sky creation
    BABYLON.Engine.ShadersRepository = "js/shaders/";

    var shader = new BABYLON.ShaderMaterial("gradient", this.self, "gradient", {});
    shader.setFloat("offset", 10);
    shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
    shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));

    shader.backFaceCulling = false;

    // box + sky = skybox !
    skybox.material = shader;

	// clear and fog color
    // Update the scene background color
    this.self.clearColor=new BABYLON.Color3(0.8,0.8,0.8);

    this.self.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.self.fogDensity = 0.003;
    this.self.fogColor = new BABYLON.Color3(0.8,0.83,0.8);
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
    ground.position.y = -2.05;
    ground.material = groundMaterial;

};
