function CharacterDemo(){
	this.arrMeshList = meshList;
	// A dictionary of loaded meshes
	this.MODELS = {};
	// Controls
	this.controls = {
		"ArrowUp":this.moveFn.bind(this,"up"),
		"ArrowDown":this.moveFn.bind(this,"dn"),
		"ArrowLeft":this.moveFn.bind(this,"lf"),
		"ArrowRight":this.moveFn.bind(this,"rt"),
	};
	this.scenes = [];
	this.chars = [];
}

CharacterDemo.prototype = Object.create(Controller.prototype);
CharacterDemo.prototype.constructor = CharacterDemo;
CharacterDemo.prototype.renderLoopFn = function(){
}
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
}