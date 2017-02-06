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
    // Hemispheric light to light the scene
    var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), this.self);
	//    h.intensity = 0.35;

    var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), this.self);
    d1.position = new BABYLON.Vector3(-300,300,600);
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, d1);
    return shadowGenerator;
};

Scene.prototype.loadMeshes = function(gameState)
{
    gameState.arrMeshList.forEach(function(mesh){
        // Import Mesh Model to the scene
        BABYLON.SceneLoader.ImportMesh(mesh.strName, mesh.strFolderName, mesh.strFilename, this.self, function (meshes) {
            var model = meshes[0];
            model.isVisible = false;
            model.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
            gameState.MODELS[strName] = model;
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
    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, this.self);
    ground.material = new BABYLON.StandardMaterial("ground", this.self);
    ground.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
    ground.material.specularColor = BABYLON.Color3.Black();

    ground.receiveShadows = true;


    var tg = new TreeGenerator(this.self, this.shadowGen);
    initGui(tg);
};

function initGui(tg) {

    var gui = new dat.GUI();
    gui.add(tg, 'treeNumber', 1, 200).name("Number of trees").step(1).onChange(function(){
        tg.generate();
    });
    var f1 = gui.addFolder('Branch');
    f1.open();
    f1.add(tg, 'minSizeBranch', 1, 50).name("Min size").step(0.5).onChange(function(){
        tg.generate();
    });
    f1.add(tg, 'maxSizeBranch', 1, 50).name("Max size").step(0.5).onChange(function(){
        tg.generate();
    });

    f1 = gui.addFolder('Trunk');
    f1.open();
    f1.add(tg, 'minSizeTrunk', 1, 50).name("Min size").step(0.5).onChange(function(){
        tg.generate();
    });
    f1.add(tg, 'maxSizeTrunk', 1, 50).name("Max size").step(0.5).onChange(function(){
        tg.generate();
    });
    f1.add(tg, 'minRadius', 1, 10).name("Min radius").step(0.5).onChange(function(){
        tg.generate();
    });
    f1.add(tg, 'maxRadius', 1, 10).name("Max radius").step(0.5).onChange(function(){
        tg.generate();
    });

};
