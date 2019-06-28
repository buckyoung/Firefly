var FFExamples = FFExamples || {};

FFExamples.briansZipper = {};

// A fresh take on Brians Brain CA - author buck young
// Tends towards 2cell wide cars that drive in lanes, crashing into each other occassionally

FFExamples.briansZipper.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('alive', [200, 0, 0], processAlive);
        FF.registerState('dying', [100, 0, 0], processDying);
        FF.registerState('dead', [200, 200, 200], processDead);

        FF.initialize(initializeWorld(FF));
    }

    function processAlive(currentCell, nextCell) {
        nextCell.setState('dying');
    }

    function processDying(currentCell, nextCell) {
        nextCell.setState('dead');
    }

    function processDead(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');
        var dyingNeighborCount = currentCell.countMooreNeighbors('dying');

// Shooting cars repeating world
// if (dyingNeighborCount == 5 || dyingNeighborCount == 6 || dyingNeighborCount == 7) {
//     nextCell.setState('dying');
//     return;
// }

        // Zipper world
        if (dyingNeighborCount == 4) {
            nextCell.setState('dying');
            return;
        }

// triangle repeating world
// if (dyingNeighborCount == 2 || dyingNeighborCount == 4) {
//     nextCell.setState('dead');
//     return;
// }

        var nNeighborCount = currentCell.countNeumannNeighbors('alive');

        if (nNeighborCount === 2) {
            nextCell.setState('dead');
            return;
        }

        if (aliveNeighborCount == 2 || aliveNeighborCount == 2) {
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

                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};