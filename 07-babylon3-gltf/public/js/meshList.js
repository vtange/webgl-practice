function MeshConstruct(arr)
{
    this.strName = arr[0],
    this.strFolderName = arr[1],
    this.strFilename = arr[2]
}
var meshList = [];

//block
//meshList.push(new MeshConstruct(["Cube","assets/","material.gltf"]));
//wedge, same file as ^ block
//meshList.push(new MeshConstruct(["group_0","assets/","material.gltf"]));
//Room
//meshList.push(new MeshConstruct(["SketchUp","assets/","room.gltf"]));
//meshList.push(new MeshConstruct(["SketchUp.001","assets/","room.gltf"]));

//something dled from Sketchfab
scene.meshes.forEach(function(mesh){
    meshList.push(new MeshConstruct([mesh.name,"assets/","scene.gltf"]));
})
