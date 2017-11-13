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
    var mvmtState = this.getMvmtState();
    if(Array.isArray(mvmtState))
    {
        //movement
        this.moveFn(mvmtState);
    }
}

CharacterDemo.prototype.moveFn = function(arDirection)
{
	var speed = arDirection.some(function(n){return n!==0}) ? 21.21 : 30;
	//this.scenes[0].playerMesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(-arDirection[0], 0, -arDirection[1]), this.scenes[0].playerMesh.getAbsolutePosition());
	console.log(arDirection);
	this.scenes[0].playerMesh.physicsImpostor.physicsBody.velocity.x = -arDirection[0]*speed;
	this.scenes[0].playerMesh.physicsImpostor.physicsBody.velocity.z = -arDirection[1]*speed;
}
/*
CharacterDemo.prototype.stopFn = function(keyUp)
{
	if(this.scenes[0].playerMesh.physicsImpostor)
	{
		switch(keyUp)
		{
			case "ArrowLeft":
			case "ArrowRight":
				this.scenes[0].playerMesh.physicsImpostor.physicsBody.velocity.x = 0;
			break;
			case "ArrowUp":
			case "ArrowDown":
				this.scenes[0].playerMesh.physicsImpostor.physicsBody.velocity.z = 0;
			break;
			default: return;
		}
		this.scenes[0].playerMesh.physicsImpostor.physicsBody.velocity.y = 0;
	}
}*/