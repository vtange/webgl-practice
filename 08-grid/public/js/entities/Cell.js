function Cell(x,y){
    this.x = x;
    this.y = y;
    //0-sea 1-tundra 2-plain 3-grass 4-desert 5-snow
    this.terrain = 0;
    //0-none 1-mtn 2-ice 3-forest
    this.feature = 0;
    this.bldg = 1
}

Cell.prototype.create = function(material, scene) {
    var id = this.x + (this.y*30); //y * x row length
    //CreateGround - 5 params: name, width, height, subdivisions and scene
	var mesh = BABYLON.Mesh.CreateGround(id, 5, 5, 1, scene);
	mesh.position.x = (this.x * 5)+2.5;
	mesh.position.y = 1;// 0 is ground, we want mouse hoverable
	mesh.position.z = (this.y * 5)+2.5;
	mesh.material = material;
	return mesh;
}