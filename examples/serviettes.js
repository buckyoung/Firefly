var FFExamples = FFExamples || {};

FFExamples.serviettes = {};

FFExamples.serviettes.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('alive', [133, 70, 133], processAlive);
        FF.registerState('dead', [61, 41, 51], processDead);

        FF.initialize(initializeWorld(FF));
    }

    function processAlive(currentCell, nextCell) {
        nextCell.setState('dead');
    }

    function processDead(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');

        if (aliveNeighborCount === 2 || aliveNeighborCount === 4 || aliveNeighborCount === 3) {
            nextCell.setState('alive');
            return;
        }
        
        nextCell.setState('dead');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var state = (Math.random() > .0015 ? 'dead' : 'alive');
                    
                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};