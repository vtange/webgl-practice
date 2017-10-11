function Cell(x,y,id){
    this.id = id;
    this.size = 5;
    this.x = x;
    this.y = y;
    //0-sea 1-tundra 2-plain 3-grass 4-desert 5-snow
    this.terrain = 0;
    //0-none 1-mtn 2-ice 3-forest
    this.feature = 0;
    this.bldg = 1
}

Cell.prototype.create = function(material, scene) {
    //CreateGround - 5 params: name, width, height, subdivisions and scene
	var mesh = BABYLON.Mesh.CreateGround(this.id, this.size, this.size, 1, scene);
	mesh.position.x = (this.x * this.size) + this.size/2;
	mesh.position.y = 1;// 0 is ground, we want mouse hoverable
	mesh.position.z = (this.y * this.size) + this.size/2;
	mesh.material = material;
	return mesh;
}