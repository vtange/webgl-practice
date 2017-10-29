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
/*
CharacterDemo.prototype.moveFn = function(strDirection)
{
	switch(strDirection)
	{
		case "up":
			this.scenes[0].playerMesh.position.z -= 1;
			this.scenes[0].playerMesh.sprite.position.z -= 1;
			break;
		case "rt":
			this.scenes[0].playerMesh.position.x -= 1;
			this.scenes[0].playerMesh.sprite.position.x -= 1;
			break;
		case "dn":
			this.scenes[0].playerMesh.position.z += 1;
			this.scenes[0].playerMesh.sprite.position.z += 1;
			break;
		case "lf":
			this.scenes[0].playerMesh.position.x += 1;
			this.scenes[0].playerMesh.sprite.position.x += 1;
			break;
	}
	//up,right = negative x,z
	//left,down = x,z
}*/