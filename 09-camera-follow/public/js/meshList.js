function MeshConstruct(arr)
{
    this.strName = arr[0],
    this.strFolderName = arr[1],
    this.strFilename = arr[2],
    this.isGround = arr[3]
}
var meshList = [];

meshList.push(new MeshConstruct(["SketchUp","assets/","room5.gltf",true]));
