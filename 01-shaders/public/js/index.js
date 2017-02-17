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
        
        var globeTexture = new BABYLON.Texture("globe.png", scene);
        //texture is upside down, multiply vUV in fragmentshader (glsl) by -1
        
        shaderMaterial.setTexture("textureSampler", globeTexture);
        shaderMaterial.setFloat("time", 0);
        shaderMaterial.setFloat("offset", 0);
        shaderMaterial.setFloat("exponent", 0.6);
        shaderMaterial.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
        shaderMaterial.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240,255));
        shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
        shaderMaterial.backFaceCulling = false; //visible from backside

        // Creating sphere
        var sphere = BABYLON.Mesh.CreateSphere("Sphere", 16, 6, scene);
        sphere.material = shaderMaterial;
 
        initGui(sphere, scene);
        engine.runRenderLoop(function () {
            sphere.rotation.y += 0.01;
            scene.render();
        });
    }
};

function initGui(sphere, scene) {
    function Switcher() {
        this.shader = "cell_shading";
        /*
        //text
        this.message = 'dat.gui';
        //slider
        this.speed = 0.8;
        //toggle
        this.displayOutline = false;
        //button
        this.explode = function() { ... };
        */
        this.latitude = 0;
    };
    var switchr = new Switcher();
    var gui = new dat.GUI();
    var f1 = gui.addFolder('Shader');

    f1.add(switchr, 'shader', { Cell: 'cell_shading', DirectTexture: 'directTexture', Gradient: 'gradient' } ).onChange(function(){
        var selection = this.object.shader;
        sphere.material = new BABYLON.ShaderMaterial(selection, scene, selection, {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection"]
            });//2nd object enables lighting to affect material
    });;

    f1.open();

    f1 = gui.addFolder('Todo');
    
    f1.add(switchr, 'latitude', 0, 30 ).name("Pole Latitude").step(5).onChange(function(){
    });

    f1.open();

};
