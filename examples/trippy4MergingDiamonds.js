var FFExamples = FFExamples || {};

FFExamples.trippy4MergingDiamonds = {};

FFExamples.trippy4MergingDiamonds.initialize = function(FF) {
    var numOfTurningBackFrames = 100; // 2 is dope and trippy -- 4 is stable
    var fireProb = .000001;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('back', [255, 213, 0], processBack);
        FF.registerState('turningBackFinal', [179, 149, 0], turningBackFinal);
        FF.registerState('belly', [179, 149, 0], processBelly);

        for (var i=0; i < numOfTurningBackFrames; i++) {
            FF.registerState('' + (i+1), [255, 213, 0], processTurningBacks);
        }

        FF.initialize(initializeWorld(FF));
    }

    function processBack(currentCell, nextCell) {
    	var burningNeighborCount = currentCell.countMooreNeighbors('belly');

        if (burningNeighborCount > 0) {
            nextCell.setState('belly');
            return;
        }

        burningNeighborCount = currentCell.countMooreNeighbors('belly', 2);

        if (burningNeighborCount > 1) {
            nextCell.setState('belly');
            return;
        }

        if (Math.random() <= fireProb) {
            nextCell.setState('belly');
            return;
        }

        nextCell.setState('back');
    }

    function processTurningBacks(currentCell, nextCell) {
        // this is a method for perserving cell state across time

        var state = currentCell.getState();
        var newState = parseInt(state) + 1;

        if (newState == numOfTurningBackFrames) {
            nextCell.setState('turningBackFinal');
            return;
        }

        nextCell.setState('' + newState);
    }

    function turningBackFinal(currentCell, nextCell) {
        nextCell.setState('back');
    }

    function processBelly(currentCell, nextCell) {
        nextCell.setState('1');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    world[i][j] = new FF.Cell('back', i, j); 
                }
            }
        };
    }
};