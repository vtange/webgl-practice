"use strict";
 
document.addEventListener("DOMContentLoaded", startGame, false);
 
function startGame() {
    if (BABYLON.Engine.isSupported()) {
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, false);
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas);
        
        // Compile
        var shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
            vertexElement: "vertexShaderCode",
            fragmentElement: "fragmentShaderCode",
        },
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection"]
            });
        
        var amigaTexture = new BABYLON.Texture("amiga.jpg", scene);
        
        shaderMaterial.setTexture("textureSampler", amigaTexture);
        shaderMaterial.setFloat("time", 0);
        shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
        shaderMaterial.backFaceCulling = false;

        // Creating sphere
        var sphere = BABYLON.Mesh.CreateSphere("Sphere", 16, 5, scene);
        sphere.material = shaderMaterial;
 
        engine.runRenderLoop(function () {
            sphere.rotation.y += 0.05;
            scene.render();
        });
    }
};