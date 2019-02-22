var FFExamples = FFExamples || {};

FFExamples.runBloom = {};

FFExamples.runBloom.initialize = function(FF) {
    var numOfTurningBackFrames = 400; // 2 is dope and trippy -- 4 is stable
    var threatProb = .0001;
    var spreadProb = .5;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('back', [255, 213, 0], processBack);
        FF.registerState('belly', [179, 149, 0], processBelly);

        for (var i=0; i < numOfTurningBackFrames; i++) {
            FF.registerState('' + (i+1), [179, 149, 0], processTurningBacks);
        }

        FF.initialize(initializeWorld(FF));
    }

    function processBack(currentCell, nextCell) {
    	var burningNeighborCount = Math.random() > .5 ? currentCell.countMooreNeighbors('belly') : currentCell.countNeumannNeighbors('belly');

        if (burningNeighborCount > 0 && Math.random() < spreadProb) {
            nextCell.setState('belly');
            return;
        }

        burningNeighborCount = Math.random() > .5 ? currentCell.countMooreNeighbors('belly', 2) : currentCell.countNeumannNeighbors('belly', 2);

        if (burningNeighborCount > 1 && Math.random() < spreadProb) {
            nextCell.setState('belly');
            return;
        }

        burningNeighborCount = Math.random() > .5 ? currentCell.countMooreNeighbors('belly', 3) : currentCell.countNeumannNeighbors('belly', 3);

        if (burningNeighborCount > 1 && Math.random() < spreadProb) {
            nextCell.setState('belly');
            return;
        }

        if (Math.random() <= threatProb) {
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
            nextCell.setState('back');
            return;
        }

        if (Math.random() < spreadProb/30) {
            nextCell.setState('back');
            return;
        }

        nextCell.setState('' + newState);
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