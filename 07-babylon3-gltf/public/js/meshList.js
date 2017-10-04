function MeshConstruct(arr)
{
    this.strName = arr[0],
    this.strFolderName = arr[1],
    this.strFilename = arr[2]
}
var meshList = [];

meshList.push(new MeshConstruct(["Cube","assets/","block.gltf"]));