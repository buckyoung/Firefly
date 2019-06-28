var FFExamples = FFExamples || {};

FFExamples.briansFreeway = {};

// A fresh take on Brians Brain CA - author buck young
// Tends towards 2cell wide cars that drive in lanes, crashing into each other occassionally

FFExamples.briansFreeway.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('alive', [200, 0, 0], processAlive);
        FF.registerState('dying', [100, 0, 0], processDying);
        FF.registerState('dead', [200, 200, 200], processDead);
        // FF.registerState('wall', [0, 0, 0], processWall);

        FF.initialize(initializeWorld(FF));
    }

    function processAlive(currentCell, nextCell) {
        nextCell.setState('dying');
    }

    // function processWall(currentCell, nextCell) {
    //     nextCell.setState('wall');
    // }

    function processDying(currentCell, nextCell) {
        nextCell.setState('dead');
    }

    function processDead(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');
        var dyingNeighborCount = currentCell.countMooreNeighbors('dying');

        // var nNeighborCount = currentCell.countNeumannNeighbors('alive');

        // if (nNeighborCount === 3) {
        //     nextCell.setState('dead');
        //     return;
        // }

        if (dyingNeighborCount == 1) {
            nextCell.setState('dead');
            return;
        }

        if (aliveNeighborCount == 2) {
            nextCell.setState('alive');
            return;
        }
        
        nextCell.setState('dead');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var state = (Math.random() > .7 ? 'dead' : 'alive');

                    // if (i == 0 || j == 0 || i == width || j == height) { state = 'wall'; } // Nice way to stop wrapping!
                    
                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};