//Game elements
var gameState = {
	score: 0, // the score
	// An array to store each lane
	LANES_POSITIONS: [],
	// An array to store each tail of the lane
	TAILS: [],
	// An array to store existing Toads, and a variable for the model
	ENEMIES: [],
	// A dictionary of loaded meshes
	MODELS:{}
};

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

