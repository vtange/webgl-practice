function MeshConstruct(arr)
{
    this.strName = arr[0],
    this.strFolderName = arr[1],
    this.strFilename = arr[2],
    this.isGround = arr[3]
}
var meshList = [];

meshList.push(new MeshConstruct(["Plane","assets/","wall_sconce.gltf",false]));
meshList.push(new MeshConstruct(["col","assets/","wall_sconce.gltf",false]));
meshList.push(new MeshConstruct(["sconce","assets/","wall_sconce.gltf",false]));