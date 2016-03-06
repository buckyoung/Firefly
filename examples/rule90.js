var FFExamples = FFExamples || {};

FFExamples.rule90 = {};

FFExamples.rule90.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('on', [120, 34, 159], processOn);
        FF.registerState('off', [255, 255, 255], processOff);

        FF.initialize(initializeWorld(FF));
    }

    function processOn(currentCell, nextCell) {
        nextCell.setState('on');
    }

    function processOff(currentCell, nextCell) {
        var leftUp = currentCell.getSpecificNeighbor(-1, -1, false, false);
        var up = currentCell.getSpecificNeighbor(0, -1, false, false);
        var rightUp = currentCell.getSpecificNeighbor(1, -1, false, false);

        if (!leftUp || !up || !rightUp) {
            nextCell.setState('off');
            return;
        }

        leftUp = leftUp.getState() === 'on';
        up = up.getState() === 'on';
        rightUp = rightUp.getState() === 'on';

        // RULE 90 OFF:
        if (
            (leftUp && up && rightUp) ||
            (leftUp && !up && rightUp) ||
            (!leftUp && up && !rightUp) ||
            (!leftUp && !up && !rightUp)
        ) {
            nextCell.setState('off');
            return;
        }

        // RULE 90 ON:
        if (
            (leftUp && up && !rightUp) ||
            (leftUp && !up && !rightUp) ||
            (!leftUp && up && rightUp) ||
            (!leftUp && !up && rightUp)
        ) {
            nextCell.setState('on');
            return;
        }

        nextCell.setState('off');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            worldHeight = height;

            // Set first row to random
            for (var i = 0; i < width; i++) {
                var state = (Math.random() > .99 ? 'on' : 'off');
                
                world[i][0] = new FF.Cell(state, i, 0); 
            }

            // Set all other rows to off
            for (var i = 0; i < width; i++) {
                for (var j = 1; j < height; j++) {
                    world[i][j] = new FF.Cell('off', i, j); 
                }
            }
        };
    }
};