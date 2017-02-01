/**
* Load the scene when the canvas is fully loaded
*/
document.addEventListener("DOMContentLoaded", function () {
	var support = BABYLON.Engine.isSupported();
    if (support) {
		var scene1Options = {
			// Number of lanes
			NO_OF_LANES: 3,
			// Space between lanes
			LANE_INTERVAL: 5,
		}

		//make basic scene, camera etc.
		var game = new BABYLON_GAME(gameState);
		var scene1 = new Scene(game.canvas, game.engine, scene1Options);
		
		game.loadScene(scene1);
       	//game.start();
    }
	else
	{
		//write non-supported error on #BABYLON_GAME
	}
}, false);

