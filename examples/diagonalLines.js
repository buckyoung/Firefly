var FFExamples = FFExamples || {};

FFExamples.diagonalLines = {};

// Draws diagonal lines which wrap around the screen
// Results are different depending on the size of the canvas

FFExamples.diagonalLines.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('on', [0, 0, 0], processOn);
        FF.registerState('empty', [200, 200, 200], processEmpty);

        FF.initialize(initializeWorld(FF));
    }

    function processOn(currentCell, nextCell) {
        nextCell.setState('on');
    }

    function processEmpty(currentCell, nextCell) {
        var neighborCell = currentCell.getSpecificNeighbor(-1, 1);

        // Checks a cell diagonally left-down and sets the next cell to on 
        if (neighborCell.getState() == 'on') { 
            nextCell.setState('on');
            return;
        }

        nextCell.setState('empty');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    world[i][j] = new FF.Cell('empty', i, j); 
                }
            }

            // Start two lines from the bottom
            world[Math.floor(width*1/3)][0] = new FF.Cell('on', Math.floor(width*1/3), 0); 
            world[Math.floor(width*2/3)][0] = new FF.Cell('on', Math.floor(width*2/3), 0); 
        };
    }
};