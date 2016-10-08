// Global variables
var canvas; // the canvas (our html5 canvas element),
var engine; // the Babylon engine (responsible for drawing the game scene on the canvas)
var scene;  // the game scene (contains our game elements and models) 
var camera; // the game camera.

//Game elements
var score = 0; // the score

// An array to store each ending of the lane
var ENDINGS = [];

// An array to store existing Toads, and a variable for the model
var ENEMIES  = [];
var TOAD_MODEL;

/**
 * Creates a new BABYLON Engine
 */
function basicSceneSetup(){
	// Get canvas
	canvas = document.getElementById("renderCanvas");

	// Create babylon engine
	engine = new BABYLON.Engine(canvas, true);

	// Create scene
	scene = new BABYLON.Scene(engine);

	// Create the camera
	camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0,4,-10), scene);
	camera.setTarget(new BABYLON.Vector3(0,0,10));
	camera.attachControl(canvas);

	// Create light
	var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0,5,-5), scene);
}
	
function initGame(){

	function loadMeshes(){
		// Import Mesh Model to the scene
		BABYLON.SceneLoader.ImportMesh("red_toad", "assets/", "toad.babylon", scene, function (meshes) {
			var m = meshes[0];
			m.isVisible = false;
			m.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
			TOAD_MODEL = m;
		});
	}
	function buildWorld(){
		// Material Loader
		function createMaterial(name, texture_imgfile, scene){
			var material = new BABYLON.StandardMaterial(name, scene);
			var texture = new BABYLON.Texture(texture_imgfile, scene);
			texture.uScale = 40;
			texture.vScale = 2;
			material.diffuseTexture = texture;
			return material;
		}
		// Function to create lanes and their end controller (the red thing)
		function createLane(id, position) {
			var lane = BABYLON.Mesh.CreateBox("lane"+id, 1, scene);
			lane.scaling.y = 0.1;
			lane.scaling.x = 3;
			lane.scaling.z = 800;
			lane.position.x = position;
			lane.position.z = lane.scaling.z/2-200;
			lane.material = ground;
		}

		function createLaneEnd(id, position) {
			var ending = BABYLON.Mesh.CreateGround(id, 3, 4, 1, scene);
			ending.position.x = position;
			ending.position.y = 0.1;
			ending.position.z = 1;
			var mat = new BABYLON.StandardMaterial("endingMat", scene); //red mat
			mat.diffuseColor = new BABYLON.Color3(0.8,0.2,0.2);
			ending.material = mat;
			return ending;
		}
		
		
		
		// create a skybox
		var skybox = BABYLON.Mesh.CreateBox("cubemap", 100.0, scene);

		// The sky creation
		var skyboxMaterial = new BABYLON.StandardMaterial("cubemap", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/cubemap/cubemap", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

		// box + sky = skybox !
		skybox.material = skyboxMaterial;
		
		
		
		
		
		//Main Lane Texture
		var ground = createMaterial("ground","assets/ground.jpg", scene);

		//Build Lanes
		var currentLanePosition = LANE_INTERVAL * -1 * (LANE_NUMBER/2);
		for (var i = 0; i<LANE_NUMBER; i++){
			LANES_POSITIONS[i] = currentLanePosition;
			createLane(i, currentLanePosition);
			var e = createLaneEnd(i, currentLanePosition);
			ENDINGS.push(e);
			currentLanePosition += LANE_INTERVAL;
		}
		
		// Adjust camera position
		camera.position.x = LANES_POSITIONS[Math.floor(LANE_NUMBER/2)];
	}
	function createEnemy(){
		// Creates a shroom in a random lane
		// Start them far away
		var posZ = 100;

		// Get a random lane
		var posX = LANES_POSITIONS[Math.floor(Math.random() * LANE_NUMBER)];

		// Create a clone of our template
		var shroom = TOAD_MODEL.clone(TOAD_MODEL.name);

		shroom.id = TOAD_MODEL.name+(ENEMIES.length+1);
		// Our toad has not been killed yet !
		shroom.killed = false;
		// Set the shroom visible
		shroom.isVisible = true;
		// Update its position
		shroom.position = new BABYLON.Vector3(posX, shroom.position.y/2, posZ);
		ENEMIES.push(shroom);
	}

	// Number of lanes
	var LANE_NUMBER = 3;
	// Space between lanes
	var LANE_INTERVAL = 5;
	var LANES_POSITIONS = [];
	
	loadMeshes();
	buildWorld();
	
	// Creates a clone every 1 seconds
	setInterval(createEnemy, 1000);
}
/**
 * Create a scene
 */
function initScene() {

	var effects = {
		animateEnding: function(ending) {
			// Get the initial position of our mesh
			var posY = ending.position.y;
			// Create the Animation object
			var animateEnding = new BABYLON.Animation(
			"animateEnding",
			"position.y",
			60,
			BABYLON.Animation.ANIMATIONTYPE_FLOAT,
			BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);

			// Animations keys
			var keys = [];
			keys.push({
				frame: 0,
				value: posY
			},{
				frame: 5,
				value: posY+0.5
			},{
				frame: 10,
				value: posY
			});

			// Add these keys to the animation
			animateEnding.setKeys(keys);

			// Link the animation to the mesh
			ending.animations.push(animateEnding);

			// Run the animation !
			scene.beginAnimation(ending, 0, 10, false, 1);

		},
		cleanShrooms: function() {
			// For all clones
			for (var n=0; n<ENEMIES.length; n++) {
				// The mushrooms has been killed !
				if (ENEMIES[n].killed) {
					var shroom = ENEMIES[n];
					// Destroy the clone !
					shroom.dispose();
					ENEMIES.splice(n, 1);
					n--;
					// Add one point to the score
					score += 1;
				}
				// The mushrooms is behind the camera
				else if (ENEMIES[n].position.z < -10) {
					var shroom = ENEMIES[n];
					// Destroy the clone !
					shroom.dispose();
					ENEMIES.splice(n, 1);
					n--;
					// Remove one point to the score
					score -= 1;
				}
			}
		}
	};
	var checks = {
			// Function checking if a shroom is present on a given ending
			getToadOnEnding: function(ending) {
				// for each mushroom
				for (var i=0; i<ENEMIES.length; i++){
					var shroom = ENEMIES[i];
					// Check if the shroom is on the good lane
					if (shroom.position.x === ending.position.x) {

						// Check if the shroom is ON the ending
						var diffSup = ending.position.z + 3;
						var diffInf = ending.position.z - 3;

						if (shroom.position.z > diffInf && shroom.position.z < diffSup ) {
							return shroom;
						}
					}
				}
				return null;
			}
		};
	
	
	function addControls(){
		function keyboardControls(evt) {
			var currentEnding = -1;
			switch (evt.keyCode) {
				case 65 : //'A'
					currentEnding = 0;
					break;
				case 90 : //'Z'
					currentEnding = 1;
					break;
				case 69 : //'E'
					currentEnding = 2;
					break;
			}
			if (currentEnding != -1) {
				effects.animateEnding(ENDINGS[currentEnding]);
				var shroom = checks.getToadOnEnding(ENDINGS[currentEnding]);
				if (shroom) {
					// Kill !
					shroom.killed = true;
				}
			}
		}
		window.addEventListener("keydown", keyboardControls);
	}


	function animateGame(){
		
		/**
		* Render the scene. This runs every frame.
		*/
		engine.runRenderLoop(function () {
			scene.render();

			//move enemys 'backward' (toward player)
			ENEMIES.forEach(function (shroom) {
				if (shroom.killed) {
					// Nothing to do here
				} else {
					shroom.position.z -= 0.5;
				}
			});

			//check if any shroom is behind player and delete it
			effects.cleanShrooms();
		});
	}
	
	
	//load items, build world, start game
	initGame();
	
	//add controls
	addControls();
	
	animateGame();
}

/**
* Load the scene when the canvas is fully loaded
*/
document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
		//make basic scene, camera etc.
		basicSceneSetup();
		
		//develop scene
        initScene();
    }
}, false);

