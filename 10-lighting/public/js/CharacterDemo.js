function CharacterDemo(){
	Controller.call(this);//add controller.keyDownState, etc.
	this.arrMeshList = meshList;
	// A dictionary of loaded meshes
	this.MODELS = {};
	this.scenes = [];
	this.chars = [];
}

CharacterDemo.prototype = Object.create(Controller.prototype);
CharacterDemo.prototype.constructor = CharacterDemo;
CharacterDemo.prototype.renderLoopFn = function(){
}
