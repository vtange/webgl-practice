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

	//load items, build world, start game
	sceneObj.assembleGameAssets(this.state);

	this.addControls();
	
	this.animateScene(sceneObj.self);
}

BABYLON_GAME.prototype.addControls = function(){
	window.addEventListener("keydown", this.state.handleKeyboardInput.bind(this.state));
}

BABYLON_GAME.prototype.animateScene = function(scene){
	/**
	* Render the scene. This runs every frame.
	*/
	this.engine.runRenderLoop(function () {
		scene.render();

		//move enemys 'backward' (toward player)
		this.state.ENEMIES.forEach(function (shroom, index) {
			if (shroom.killed) {
					shroom.kill();
					this.state.ENEMIES.splice(index,1);
					index -= 1;
					this.state.score += 1;
			} else {
				if(shroom.m.position.z < -10)
				{
					shroom.kill();
					this.state.ENEMIES.splice(index,1);
					index -= 1;
					this.state.score -= 1;
				}
				else
				{
					shroom.m.position.z -= 0.5;
				}
			}
		}.bind(this));
	}.bind(this));
}
	