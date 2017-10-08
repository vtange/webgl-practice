function CharacterDemo(){
	this.arrMeshList = meshList;
	// A dictionary of loaded meshes
	this.MODELS = {};
	// Controls
	this.controls = {
	};
	this.scenes = [];
	this.chars = [];
}

CharacterDemo.prototype = Object.create(Controller.prototype);
CharacterDemo.prototype.constructor = CharacterDemo;
CharacterDemo.prototype.renderLoopFn = function(){
}


var gameState = new CharacterDemo();
