var FFExamples = FFExamples || {};

FFExamples.anylife = {};

FFExamples.anylife.initialize = function(FF) {


    // 134/3 -- my shit!
    // 678/2 or 456/2 or 234/2, etc -- crazy glider world
    // 23/3458/.05 - cool diamond world
    // 23/38/.15 - cool reaction world  --- 2378/38/.15 - more stable

    var sb = '2378/38'; // S/B String

    var initialBirthRate = .2;

    var S = []; // Survive
    var B = []; // Born

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('alive', [0,0,0], processAlive);
        FF.registerState('dead', [255,255,255], processDead);

        initSB();
        
        FF.initialize(initializeWorld(FF));
    }

    function processAlive(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');

        if (S.includes(aliveNeighborCount)) {
            nextCell.setState('alive');
            return;
        }

        nextCell.setState('dead');
    }

    function processDead(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');

        if (B.includes(aliveNeighborCount)) {
            nextCell.setState('alive');
            return;
        }

        nextCell.setState('dead');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var state = (Math.random() > initialBirthRate ? 'dead' : 'alive');
                    
                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }

    function initSB() {
        var sbarr = sb.split('/');

        S = sbarr[0].split('');
        B = sbarr[1].split('');

        for (var i=0; i<S.length; i++) {
            S[i] = parseInt(S[i]);
        }

        for (var i=0; i<B.length; i++) {
            B[i] = parseInt(B[i]);
        }
    }
};

// TODO BUCK - add generation counter to drawer
// TODO BUCK - add initial birth rate to drawer
// TODO BUCK - add ruleset multiselect to drawer