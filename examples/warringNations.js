var FFExamples = FFExamples || {};

FFExamples.warringNations = {};

FFExamples.warringNations.initialize = function(FF) {
    var gasProb = .4;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('empty', [0,0,0], processEmpty);

        FF.registerState('greenGas', [30, 100, 30], processGreenGas);
        FF.registerState('greenGasEmitter', [0, 255, 0], processGreenGasEmitter);
        
        FF.registerState('blueGas', [60, 100, 160], processBlueGas);
        FF.registerState('blueGasEmitter', [120, 200, 255], processBlueGasEmitter);
        
        FF.registerState('fire', [170, 30, 30], processFire);

        FF.initialize(initializeWorld(FF));
    }

    // Kill the emitters if the other gas reaches it
    function processGreenGasEmitter(currentCell, nextCell) {
        if (currentCell.countMooreNeighbors('blueGas') > 0) {
            nextCell.setState('blueGasEmitter');
            return;
        }

        nextCell.setState(currentCell.getState());
    }

    // Kill the emitters if the other gas reaches it
    function processBlueGasEmitter(currentCell, nextCell) {
        if (currentCell.countMooreNeighbors('greenGas') > 0) {
            nextCell.setState('greenGasEmitter');
            return;
        }

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
        if (
            currentCell.countNeumannNeighbors('greenGas') == 0 &&// Remove / add - Explosive gas vs warring nations
            greenCount > blueCount
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
            currentCell.countNeumannNeighbors('blueGas') == 0 &&// Remove / add - Explosive gas vs warring nations
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

            // Row 1
            w = Math.floor(width*1/5);
            h = Math.floor(height*1/4);
            world[w][h] = new FF.Cell('blueGasEmitter', w, h);

            w = Math.floor(width*2/5);
            h = Math.floor(height*1/4);
            world[w][h] = new FF.Cell('greenGasEmitter', w, h);

            w = Math.floor(width*3/5);
            h = Math.floor(height*1/4);
            world[w][h] = new FF.Cell('blueGasEmitter', w, h);

            w = Math.floor(width*4/5);
            h = Math.floor(height*1/4);
            world[w][h] = new FF.Cell('greenGasEmitter', w, h);

            // Row 2
            w = Math.floor(width*1/3);
            h = Math.floor(height*2/4);
            world[w][h] = new FF.Cell('blueGasEmitter', w, h);

            w = Math.floor(width*2/3);
            h = Math.floor(height*2/4);
            world[w][h] = new FF.Cell('greenGasEmitter', w, h);

            // Row 3
            w = Math.floor(width*1/5);
            h = Math.floor(height*3/4);
            world[w][h] = new FF.Cell('greenGasEmitter', w, h);

            w = Math.floor(width*2/5);
            h = Math.floor(height*3/4);
            world[w][h] = new FF.Cell('blueGasEmitter', w, h);

            w = Math.floor(width*3/5);
            h = Math.floor(height*3/4);
            world[w][h] = new FF.Cell('greenGasEmitter', w, h);

            w = Math.floor(width*4/5);
            h = Math.floor(height*3/4);
            world[w][h] = new FF.Cell('blueGasEmitter', w, h);
        };
    }
};