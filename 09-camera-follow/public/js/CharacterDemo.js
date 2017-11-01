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

CharacterDemo.prototype.moveFn = function(arDirection)
{
	this.scenes[0].playerMesh.position.x -= arDirection[0];
	this.scenes[0].playerMesh.sprite.position.x -= arDirection[0];
	this.scenes[0].playerMesh.position.z -= arDirection[1];
	this.scenes[0].playerMesh.sprite.position.z -= arDirection[1];
}