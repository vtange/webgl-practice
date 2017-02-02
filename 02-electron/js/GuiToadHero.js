function GuiToadHero(){
	this.score = 0; // the score
	// An array to store each lane
	this.LANES_POSITIONS = [];
	// An array to store each tail of the lane
	this.TAILS = [];
	// An array to store existing Toads, and a variable for the model
	this.ENEMIES = [];
	// A dictionary of loaded meshes
	this.MODELS = {};
	// Controls
	this.controls = {
        "q": moveTail.bind(this,0),
        "w": moveTail.bind(this,1),
        "e": moveTail.bind(this,2)
	};
}

GuiToadHero.prototype = Object.create(Controller.prototype);
GuiToadHero.prototype.constructor = GuiToadHero;

var gameState = new GuiToadHero();

function moveTail(moveTailIndex) {
	if (this.LANES_POSITIONS[moveTailIndex]) {
		this.LANES_POSITIONS[moveTailIndex].animate();
		var shroom = getToadOnEnding.call(this,this.TAILS[moveTailIndex]);
		if (shroom) {
			// Kill !
			return shroom.killed = true;
		}
	}
}

function getToadOnEnding(tail) {
	// for each mushroom
	for (var i=0; i<this.ENEMIES.length; i++){
		var shroom = this.ENEMIES[i];
		// Check if the shroom is on the good lane
		if (shroom.m.position.x === tail.position.x) {

			// Check if the shroom is ON the tail
			var diffSup = tail.position.z + 3;
			var diffInf = tail.position.z - 3;

			if (shroom.m.position.z > diffInf && shroom.m.position.z < diffSup ) {
				return shroom;
			}
		}
	}
	return null;
}
