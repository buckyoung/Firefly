var FFExamples = FFExamples || {};

FFExamples.briansTradeRoutes = {};

// A fresh take on Brians Brain CA - author buck young
// Tends towards stable lanes of spaceships
// Sometimes very interesting spaceships emerge
// Sometimes they are ever-growing until they cannibalize themselves

FFExamples.briansTradeRoutes.initialize = function(FF) {
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

        var nNeighborCount = currentCell.countNeumannNeighbors('alive');

        if (nNeighborCount === 2) {
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
                    
                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};