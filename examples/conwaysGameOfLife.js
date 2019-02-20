var FFExamples = FFExamples || {};

FFExamples.conwaysGameOfLife = {};

FFExamples.conwaysGameOfLife.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('alive', [160, 0, 0], processAlive);
        FF.registerState('dead', [200, 200, 200], processDead);

        FF.initialize(initializeWorld(FF));
    }

    function processAlive(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');

        if (aliveNeighborCount < 2 || aliveNeighborCount > 3) {
            nextCell.setState('dead');
            return;
        }

        nextCell.setState('alive');
    }

    function processDead(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');

        if (aliveNeighborCount === 3) {
            nextCell.setState('alive');
            return;
        }
        
        nextCell.setState('dead');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var state = (Math.random() > .4 ? 'dead' : 'alive');
                    
                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};