function BABYLON_GAME(stateObj){
	// Get canvas (our html5 canvas element)
	this.canvas = document.getElementById("BABYLON_GAME");

	// Create babylon engine (responsible for drawing the game scene on the canvas)
	this.engine = new BABYLON.Engine(this.canvas, true);

/*
	this.engine.cursor = document.getElementById("custom_cursor");

		//lock mouse in canvas
		this.canvas.onclick = function(ev){
			this.canvas.requestPointerLock();

			//show and position custom cursor
			this.engine.cursor.style.display = "";
			this.engine.cursor.posX = ev.clientX;
			this.engine.cursor.posY = ev.clientY;
			this.engine.cursor.updatePos = function(){
				this.engine.cursor.style.top = this.engine.cursor.posY+"px";
				this.engine.cursor.style.left = this.engine.cursor.posX+"px";
			}.bind(this);
			this.engine.cursor.updatePos();
			this.canvas.addEventListener("mousemove", function(e) {
				this.engine.cursor.posX = Math.max(0,Math.min(this.canvas.clientWidth-10,this.engine.cursor.posX+e.movementX));//clientX won't change, but movement X does.
				this.engine.cursor.posY = Math.max(0,Math.min(this.canvas.clientHeight-10,this.engine.cursor.posY+e.movementY));
				this.engine.cursor.updatePos();
			  }.bind(this));
		}.bind(this);
*/

	// State (where we put stuff like players, enemies, game-unique elements)
	this.state = stateObj;
}

BABYLON_GAME.prototype.loadScene = function(sceneObj) {

	//load items, build world, start game
	sceneObj.assembleGameAssets(this.state);

	this.addControls();
	
	this.animateScene(sceneObj);
}

BABYLON_GAME.prototype.addControls = function(){
	window.addEventListener("keydown", this.state.handleKeyboardInput.bind(this.state));
}

BABYLON_GAME.prototype.animateScene = function(sceneObj){
	/**
	* Render the scene. This runs every frame.
	*/
	this.engine.runRenderLoop(function () {
		//render scene (MUST)
		sceneObj.self.render();

		//move enemys 'backward' (toward player)
		this.state.renderLoopFn();
	}.bind(this));
}
	