"use strict";
 
document.addEventListener("DOMContentLoaded", startGame, false);
 
function startGame() {
    if (BABYLON.Engine.isSupported()) {
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, false);
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas);

        BABYLON.Engine.ShadersRepository = "js/shaders/";
    
        // Compile
        var shaderMaterial = new BABYLON.ShaderMaterial("directTexture", scene, "directTexture", {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection"]
            });//2nd object enables lighting to affect material
        
        var globeTexture = new BABYLON.Texture("globe.jpg", scene);
        //texture is upside down, multiply vUV in fragmentshader (glsl) by -1
        
        shaderMaterial.setTexture("textureSampler", globeTexture);
        shaderMaterial.setFloat("time", 0);
        shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
        shaderMaterial.backFaceCulling = false; //visible from backside

        // Creating sphere
        var sphere = BABYLON.Mesh.CreateSphere("Sphere", 16, 6, scene);
        sphere.material = shaderMaterial;
 
        engine.runRenderLoop(function () {
            sphere.rotation.y += 0.01;
            scene.render();
        });
    }
};