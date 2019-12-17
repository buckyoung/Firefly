var FFExamples = FFExamples || {};

FFExamples.flyingFire = {};

FFExamples.flyingFire.initialize = function(FF) {
    var gasFrames = 1;
    var bugProb = 0.00001;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('bug', [250, 218, 94], processBug);

        FF.registerState('empty', [0, 0, 0], processEmpty);

        var halfFrames = gasFrames/2;

        for (var i=0; i < halfFrames; i++) {
           FF.registerState('' + (i+1), [0+(i*(250/halfFrames)), 0+(i*(218/halfFrames)), 0+(i*(94/halfFrames))], processGas);
        }

        for (var i=halfFrames; i < gasFrames; i++) {
           FF.registerState('' + (i+1), [250-(i*(250/halfFrames)), 218-(i*(218/halfFrames)), 94-(i*(94/halfFrames))], processGas);
        }

        FF.initialize(initializeWorld(FF));
    }

    function processBug(currentCell, nextCell) {
        nextCell.setState('empty');
    }

    function processEmpty(currentCell, nextCell) {
        var bugNeighbors = currentCell.countNeumannNeighbors('bug');
        if (bugNeighbors > 0) {
            nextCell.setState('1');
            return;
        }

        var gasCount = 0;
        var newestState = null;
        for (var i=0; i < gasFrames; i++) {
            var countNeumann = currentCell.countNeumannNeighbors('' + i);
            var countMoore = currentCell.countMooreNeighbors('' + i);

            var count = Math.random() > .5 ? countNeumann : countMoore; // Creates more "organic" (less geometric) shapes

            if (count) {
                gasCount++;

                if (!newestState) {
                    newestState = '' + i;
                }
            }
        }

        if (gasCount > 0 && gasCount < 4) {
            nextCell.setState(parseInt(newestState) + 1 + '');
            return;
        }

        if (Math.random() <= bugProb) {
            nextCell.setState('bug');
            return;
        }

        nextCell.setState('empty');
    }

    function processGas(currentCell, nextCell) {
        var newState = parseInt(currentCell.getState()) + 1;

        if (newState >= gasFrames) {
            nextCell.setState('empty');
            return;
        }

        nextCell.setState(newState + '');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    world[i][j] = new FF.Cell('empty', i, j); 
                }
            }
        };
    }
};