var FFExamples = FFExamples || {};

FFExamples.seed = {};

FFExamples.seed.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('on', [200, 120, 120], processOn);
        FF.registerState('off', [50, 30, 10], processOff);

        FF.initialize(initializeWorld(FF));
    }

    function processOn(currentCell, nextCell) {
        nextCell.setState('off');
    }

    function processOff(currentCell, nextCell) {
        var onNeighborCount = currentCell.countMooreNeighbors('on');

        if (onNeighborCount === 2) {
            nextCell.setState('on');
            return;
        }
        
        nextCell.setState('off');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var state = (Math.random() > .007 ? 'off' : 'on');
                    
                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};