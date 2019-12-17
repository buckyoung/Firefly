var FFExamples = FFExamples || {};

FFExamples.moveDemo = {};

FFExamples.moveDemo.initialize = function(FF) {
    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('1state', [160, 0, 0], processAlive);
        FF.registerState('2state', [160, 0, 0], processAlive);
        FF.registerState('3state', [160, 0, 0], processAlive);
        FF.registerState('4state', [160, 0, 0], processAlive);
        // FF.registerState('baby', [0, 0, 160], processBaby);

        FF.registerState('empty', [200, 200, 200], processEmpty);

        FF.initialize(initializeWorld(FF));
    }

    // function processBaby(currentCell, nextCell) {
    //     nextCell.setState('baby');
    // }

    function processAlive(currentCell, nextCell) {
        nextCell.setState('empty');
    }

    function processEmpty(currentCell, nextCell) {
        var leftState = currentCell.getSpecificNeighbor(-1, 0).getState();
        var rightState = currentCell.getSpecificNeighbor(1, 0).getState();
        var upState = currentCell.getSpecificNeighbor(0, 1).getState();
        var downState = currentCell.getSpecificNeighbor(0, -1).getState();

        var random = parseInt(Math.random() * (+4 - +1) + +1);

        if (leftState == '1state') {
            nextCell.setState(random+'state');
            return;
        }

        if (rightState == '2state') {
            nextCell.setState(random+'state');
            return;
        }

        if (upState == '3state') {
            nextCell.setState(random+'state');
            return;
        }

        if (downState == '4state') {
            nextCell.setState(random+'state');
            return;
        }

        // var neighbors = currentCell.getMooreNeighborsTotalisticStates();

        // if ((neighbors['1state']?neighbors['1state']:0 + neighbors['2state']?neighbors['2state']:0 + neighbors['3state']?neighbors['3state']:0 + neighbors['4state']?neighbors['4state']:0) > 1) {
        //     nextCell.setState('baby');
        //     return;
        // }

        nextCell.setState('empty');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var state = (Math.random() > .01 ? 'empty' : '1state');
                    
                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};