function BABYLON_GAME(stateObj){
	// Get canvas (our html5 canvas element)
	this.canvas = document.getElementById("BABYLON_GAME");

	// Create babylon engine (responsible for drawing the game scene on the canvas)
	this.engine = new BABYLON.Engine(this.canvas, true);

	// State (where we put stuff like players, enemies, game-unique elements)
	this.state = stateObj;
	/* Reference Game State
	var gameState = {
		score: 0, // the score
		// An array to store each lane
		LANES_POSITIONS: [],
		// An array to store each tail of the lane
		TAILS: [],
		// An array to store existing Toads, and a variable for the model
		ENEMIES: [],
		// A dictionary of loaded meshes
		MODELS:{}
	};
	*/
}

BABYLON_GAME.prototype.loadScene = function(sceneObj) {

	var checks = {
			// Function checking if a shroom is present on a given tail
			getToadOnEnding: function(tail) {
				// for each mushroom
				for (var i=0; i<this.state.ENEMIES.length; i++){
					var shroom = this.state.ENEMIES[i];
					// Check if the shroom is on the good lane
					if (shroom.position.x === tail.position.x) {

						// Check if the shroom is ON the tail
						var diffSup = tail.position.z + 3;
						var diffInf = tail.position.z - 3;

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
				this.state.TAILS[currentEnding].animate();
				var shroom = checks.getToadOnEnding(this.state.TAILS[currentEnding]);
				if (shroom) {
					// Kill !
					shroom.killed = true;
				}
			}
		}
		window.addEventListener("keydown", keyboardControls.bind(this));
	}


	function animateScene(scene){
		
		/**
		* Render the scene. This runs every frame.
		*/
		this.engine.runRenderLoop(function () {
			scene.render();

			//move enemys 'backward' (toward player)
			this.state.ENEMIES.forEach(function (shroom) {
				if (shroom.killed) {
					// kill shroom. player scored: true
						shroom.kill(true);
				} else {
					if(shroom.m.position.z < -10)
					{
						shroom.kill(false);
					}
					else
					{
						shroom.m.position.z -= 0.5;
					}
				}
			});
		}.bind(this));
	}
	
	
	//load items, build world, start game
	sceneObj.assembleGameAssets(this.state);
	
	//add controls
	addControls.call(this);
	
	animateScene.call(this, sceneObj.self);
}
