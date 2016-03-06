var FFExamples = FFExamples || {};

FFExamples.iceVsSeed = {};

FFExamples.iceVsSeed.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('on', [220, 120, 50], processOn);
        FF.registerState('off', [20, 30, 60], processOff);
        FF.registerState('ice', [90, 200, 250], processIce);

        FF.initialize(initializeWorld(FF));
    }

    function processIce(currentCell, nextCell) {
        nextCell.setState('ice');
    }

    function processOn(currentCell, nextCell) {
        var iceCount = currentCell.countMooreNeighbors('ice');

        if (iceCount > 0) {
            nextCell.setState('ice');
            return;
        }

        nextCell.setState('off');
    }

    function processOff(currentCell, nextCell) {
        var onNeighborCount = currentCell.countMooreNeighbors('on');

        if (onNeighborCount === 2) {
            var state = (Math.random() > .83 ? 'off' : 'on');
            nextCell.setState(state);
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

            world[Math.floor(width/2)][Math.floor(height/2)] = new FF.Cell('ice', i, j); 
        };
    }
};