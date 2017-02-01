function Lane(position){
    this.position = position;
    this.tail = null;
	this.ownerScene = null;
}

Lane.prototype.animate = function() {
	// Get the initial position of the tail
	var posY = this.tail.position.y;
	// Create the Animation object
	var animateTail = new BABYLON.Animation("animateTail","position.y",60,BABYLON.Animation.ANIMATIONTYPE_FLOAT,BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);

	// Animations keys
	var keys = [];
	keys.push({
		frame: 0,
		value: posY
	},{
		frame: 5,
		value: posY+0.5
	},{
		frame: 10,
		value: posY
	});

	// Add these keys to the animation
	animateTail.setKeys(keys);

	// Link the animation to the mesh
	this.tail.animations.push(animateTail);

	// Run the animation !
	this.ownerScene.beginAnimation(this.tail, 0, 10, false, 1);

};

Lane.prototype.create = function(id, position, material, scene) {
	var lane = BABYLON.Mesh.CreateBox("lane"+id, 1, scene);
	lane.scaling.y = 0.1;
	lane.scaling.x = 3;
	lane.scaling.z = 800;
	lane.position.x = position;
	lane.position.z = lane.scaling.z/2-200;
	lane.material = material;
	this.ownerScene = scene;
	return lane;
}

Lane.prototype.createTail = function(id, position, material, scene) {
	var tail = BABYLON.Mesh.CreateGround(id, 3, 4, 1, scene);
	tail.position.x = position;
	tail.position.y = 0.1;
	tail.position.z = 1;
	tail.material = material;
	this.tail = tail;
	return tail;
}