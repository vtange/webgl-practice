function BABYLON_GAME(stateObj){
	// Get canvas (our html5 canvas element)
	this.canvas = document.getElementById("BABYLON_GAME");

	// Create babylon engine (responsible for drawing the game scene on the canvas)
	this.engine = new BABYLON.Engine(this.canvas, true);

	// State (where we put stuff like players, enemies, game-unique elements)
	this.state = stateObj;
}

BABYLON_GAME.prototype.loadScene = function(sceneObj) {
	this.state.scenes.push(sceneObj);

	//load items, build world, start game
	sceneObj.assembleGameAssets(this.state);

	this.addControls();
	
	this.animateScene(sceneObj.self);
}

BABYLON_GAME.prototype.addControls = function(){
	window.addEventListener("keydown", this.state.handleKeyDown.bind(this.state));
	window.addEventListener("keyup", this.state.handleKeyUp.bind(this.state));
}

BABYLON_GAME.prototype.animateScene = function(scene){
	/**
	* Render the scene. This runs every frame.
	*/
	this.engine.runRenderLoop(function () {
		scene.render();

		this.state.renderLoopFn();
	}.bind(this));
}
	