"use strict";
 
document.addEventListener("DOMContentLoaded", startGame, false);
var mapImageController = {
    applyMapImage:function(e)
                    {
                        var file = mapImageController.input.files[0];
                        this.map = new BABYLON.Texture(file.name, this.scene);
                    }
}

function startGame() {
    if (BABYLON.Engine.isSupported()) {
        var mapInput = mapImageController.input = document.getElementById("mapInput");
        var canvas = document.getElementById("renderCanvas");
        var engine = new BABYLON.Engine(canvas, false);
        var scene = mapImageController.scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas);

        BABYLON.Engine.ShadersRepository = "js/shaders/";
    
        // Compile
        var shaderMaterial = new BABYLON.ShaderMaterial("flat", scene, "flat", {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection"]
            });//2nd object enables lighting to affect material

        var globeTexture = mapImageController.map = new BABYLON.Texture("globe.png", scene);
        //texture is upside down, multiply vUV in fragmentshader (glsl) by -1
        
        shaderMaterial.setTexture("textureSampler", globeTexture);
        shaderMaterial.setFloat("time", 0);
        shaderMaterial.setFloat("offset", 0);
        shaderMaterial.setFloat("exponent", 0.6);
        shaderMaterial.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
        shaderMaterial.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240,255));
        shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
        shaderMaterial.backFaceCulling = false; //visible from backside

        var poles = new BABYLON.StandardMaterial("poles", scene);
        poles.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        var globe = new BABYLON.MultiMaterial("globe", scene);
        globe.subMaterials.push(poles);
        globe.subMaterials.push(shaderMaterial);
        globe.subMaterials.push(poles);

        // Creating sphere
        var sphere = BABYLON.Mesh.CreateSphere("Sphere", 16, 6, scene);
        var verticesCount = sphere.getTotalVertices();
        sphere.subMeshes = [];
        sphere.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 864, sphere)); //total 3886-3888
        sphere.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 864, 2592, sphere));
        sphere.subMeshes.push(new BABYLON.SubMesh(2, 0, verticesCount, 3456, 430, sphere));
        sphere.material = globe;
 
        initGui(sphere, scene);
        engine.runRenderLoop(function () {
            sphere.rotation.y += 0.01;
            scene.render();
        });
    }
};

function initGui(sphere, scene) {
    function Switcher() {
        this.shader = "flat";
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
        this.loadFile = function(){
             mapImageController.input.click()
        }
    };
    var switchr = new Switcher();
    var gui = new dat.GUI();
    gui.add(switchr, 'shader', { Cell: 'cell_shading', Flat: 'flat', Gradient: 'gradient' } ).onChange(function(){
        var selection = this.object.shader;
        sphere.material = new BABYLON.ShaderMaterial(selection, scene, selection, {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection"]
            });//2nd object enables lighting to affect material
    });;

    var f1 = gui.addFolder('Todo');
    
    f1.add(switchr, 'latitude', 0, 30 ).name("Pole Latitude").step(5).onChange(function(){
    });
    
    //f1.add(switchr, 'loadFile').name('Load Map Image');

    f1.open();

};