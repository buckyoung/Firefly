var FFExamples = FFExamples || {};

FFExamples.rule184SingleLine = {};

FFExamples.rule184SingleLine.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('on', [120, 34, 159], process);
        FF.registerState('off', [255, 255, 255], process);

        FF.initialize(initializeWorld(FF));
    }

    function process(currentCell, nextCell) {
        var left = currentCell.getSpecificNeighbor(-1, 0, false, false);
        var middle = currentCell.getSpecificNeighbor(0, 0, false, false);
        var right = currentCell.getSpecificNeighbor(1, 0, false, false);

        if (!left || !middle || !right) {
            nextCell.setState('off');
            return;
        }

        left = left.getState() === 'on';
        middle = middle.getState() === 'on';
        right = right.getState() === 'on';

        // RULE 184 OFF:
        if (
            (left && middle && !right) ||
            (!left && middle && !right) ||
            (!left && !middle && right) ||
            (!left && !middle && !right)
        ) {
            nextCell.setState('off');
            return;
        }

        // RULE 184 ON:
        if (
            (left && middle && right) ||
            (left && !middle && right) ||
            (left && !middle && !right) ||
            (!left && middle && right)
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
                var state = (Math.random() > .35 ? 'on' : 'off');
                
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