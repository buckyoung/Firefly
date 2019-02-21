var FFExamples = FFExamples || {};

FFExamples.gas = {};

FFExamples.gas.initialize = function(FF) {
   var gasFrames = 50;
   var gasProb = .5;

   initializeModel(FF);

   function initializeModel(FF) {
        FF.registerState('empty', [0,0,0], processEmpty);
        FF.registerState('gasEmitter', [0, 255, 0], processGasEmitter);

       for (var i=0; i < gasFrames; i++) {
           FF.registerState('' + (i+1), [0, 255-(i*(255/gasFrames)), 0], processGas);
       }

       FF.initialize(initializeWorld(FF));
   }

   function processGasEmitter(currentCell, nextCell) {
        nextCell.setState(currentCell.getState());
    }

   function processEmpty(currentCell, nextCell) {
        var gasCount = 0;
        var newestState = null;
        for (var i=0; i < gasFrames; i++) {
            if (currentCell.countMooreNeighbors('' + i)) {
                gasCount++;

                if (!newestState) {
                    newestState = '' + i;
                }
            }
        }

        // Determine if emitters should fire off some gas
        if (currentCell.countMooreNeighbors('gasEmitter') > 0 
            && Math.random() < gasProb/10
        ) {
            nextCell.setState('1');
            return;
        }

        // Determine if gas should propagate
        var shouldSpread = Math.random() < gasProb;

        if (gasCount > 0 
            && gasCount < 5 
            && shouldSpread
        ) {
            nextCell.setState(parseInt(newestState) + 1 + '');
            return;
        }

        nextCell.setState(currentCell.getState());
    }

    function processGas(currentCell, nextCell) {
        nextCell.setState('empty');
    }

   function initializeWorld(FF) {
       return function(world, width, height) {
           for (var i = 0; i < width; i++) {
               for (var j = 0; j < height; j++) {
                   world[i][j] = new FF.Cell('empty', i, j); 
                }
            }

            var w = Math.floor(width/2);
            var h = Math.floor(height/2);
            world[w][h] = new FF.Cell('gasEmitter', w, h);
       };
   }
};