/**
* Load the scene when the canvas is fully loaded
*/
document.addEventListener("DOMContentLoaded", function () {
	var support = BABYLON.Engine.isSupported();
    if (support) {

		//make basic scene, camera etc.
		var gameState = new CharacterDemo();
		var game = new BABYLON_GAME(gameState);
		
		var scene1Options = gameState.scenes[0];
		var scene1 = new Scene(game, scene1Options);
		game.loadScene(scene1);

		// Resize the babylon engine when the window is resized
		window.addEventListener("resize", function () {
			if (game) {
				game.engine.resize();
			}
		},false);
    }
	else
	{
		//write non-supported error on #BABYLON_GAME
	}
}, false);

