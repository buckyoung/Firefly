var FFExamples = FFExamples || {};

FFExamples.mouseColony = {};

// Game that starts with two mice
// They wander around randomly & when two meet, they make a third

FFExamples.mouseColony.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('mouse', [0, 0, 0], processMouse);
        FF.registerState('empty', [200, 200, 200], processEmpty);

        FF.initialize(initializeWorld(FF));
    }

    function processMouse(currentCell, nextCell) {
        nextCell.setState('empty');
    }

    function processEmpty(currentCell, nextCell) {
        var offsets = [-1, 0, 1];

        var randomXOffset = offsets[Math.floor(Math.random()*offsets.length)];
        var randomYOffset = offsets[Math.floor(Math.random()*offsets.length)];

        if (currentCell.getSpecificNeighbor(randomXOffset, randomYOffset).getState() == 'mouse') {
            nextCell.setState('mouse');
            currentCell.getSpecificNeighbor(randomXOffset, randomYOffset).setState('empty'); // theres some problem w this - im going to bed TODO
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

            world[Math.floor(width*1/3)][Math.floor(height/2)] = new FF.Cell('mouse', Math.floor(width*1/3), Math.floor(height/2)); 
            world[Math.floor(width*2/3)][Math.floor(height/2)] = new FF.Cell('mouse', Math.floor(width*2/3), Math.floor(height/2)); 
        };
    }
};