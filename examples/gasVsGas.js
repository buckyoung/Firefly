var FFExamples = FFExamples || {};

FFExamples.gasVsGas = {};

FFExamples.gasVsGas.initialize = function(FF) {
    var gasProb = .4;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('empty', [0,0,0], processEmpty);

        FF.registerState('greenGas', [0, 179, 0], processGreenGas);
        FF.registerState('greenGasEmitter', [0, 255, 0], doNothing);
        
        FF.registerState('blueGas', [0, 0, 179], processBlueGas);
        FF.registerState('blueGasEmitter', [0, 0, 255], doNothing);
        
        FF.registerState('fire', [170, 30, 30], processFire);

        FF.initialize(initializeWorld(FF));
    }

    function doNothing(currentCell, nextCell) {
        nextCell.setState(currentCell.getState());
    }

    function processEmpty(currentCell, nextCell) {
        var blueCount = currentCell.countMooreNeighbors('blueGas');
        var greenCount = currentCell.countMooreNeighbors('greenGas');

        // Determine if emitters should fire off some gas
        if (currentCell.countMooreNeighbors('greenGasEmitter') > 0 
            && Math.random() < gasProb/100
        ) {
            nextCell.setState('greenGas');
            return;
        }

        if (currentCell.countMooreNeighbors('blueGasEmitter') > 0 
            && Math.random() < gasProb/100
        ) {
            nextCell.setState('blueGas');
            return;
        }

        var isFireNear = currentCell.countMooreNeighbors('fire', 1) > 0 || currentCell.countMooreNeighbors('fire', 2) > 0;
        var shouldSpread = Math.random() < gasProb;

        // Determine if green gas should propagate
        if (greenCount > blueCount
            && greenCount > 0 
            && greenCount < 5 
            && shouldSpread
            && !isFireNear
        ) {
            nextCell.setState('greenGas');
            return;
        }

        // Determine if blue gas should propagate
        if (
            blueCount > greenCount
            && blueCount > 0 
            && blueCount < 5 
            && shouldSpread
            && !isFireNear
        ) {
            nextCell.setState('blueGas');
            return;
        }

        nextCell.setState(currentCell.getState());
    }

    function processGreenGas(currentCell, nextCell) {
        var blueCount = currentCell.countMooreNeighbors('blueGas');
        var greenCount = currentCell.countMooreNeighbors('greenGas');

        if (greenCount < blueCount) {
            nextCell.setState('fire');
            return;
        }

        if (currentCell.countMooreNeighbors('fire', 1) > 0
            || currentCell.countMooreNeighbors('fire', 2) > 0
            || currentCell.countMooreNeighbors('fire', 3) > 0
        ) {
            nextCell.setState('fire');
            return;
        }

        nextCell.setState('empty');
    }

    function processBlueGas(currentCell, nextCell) {
        var blueCount = currentCell.countMooreNeighbors('blueGas');
        var greenCount = currentCell.countMooreNeighbors('greenGas');

        if (blueCount < greenCount) {
            nextCell.setState('fire');
            return;
        }

        if (currentCell.countMooreNeighbors('fire', 1) > 0
            || currentCell.countMooreNeighbors('fire', 2) > 0
            || currentCell.countMooreNeighbors('fire', 3) > 0
        ) {
            nextCell.setState('fire');
            return;
        }

        nextCell.setState('empty');
    }

    function processFire(currentCell, nextCell) {
        nextCell.setState('empty');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    world[i][j] = new FF.Cell('empty', i, j); 
                }
            }
            var w = 0;
            var h = 0;

            w = Math.floor(width*1/4);
            h = Math.floor(height*1/2);
            world[w][h] = new FF.Cell('greenGasEmitter', w, h);

            w = Math.floor(width*3/4);
            h = Math.floor(height*1/2);
            world[w][h] = new FF.Cell('blueGasEmitter', w, h);
        };
    }
};