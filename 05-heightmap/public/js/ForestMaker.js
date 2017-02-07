function ForestMaker(){
	this.arrMeshList = [];
	// A dictionary of loaded meshes
	this.MODELS = {};
	// Controls
	this.controls = {
	};
	this.scenes = [];
}

ForestMaker.prototype = Object.create(Controller.prototype);
ForestMaker.prototype.constructor = ForestMaker;
ForestMaker.prototype.renderLoopFn = function(){
}


var gameState = new ForestMaker();
