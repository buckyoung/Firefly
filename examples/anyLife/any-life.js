var FFExamples = FFExamples || {};

FFExamples.anylife = {};

var S = []; // Survive
var B = []; // Born

FFExamples.anylife.initialize = function(FF) {
    // 134/3 -- my shit!
    // 678/2 or 456/2 or 234/2, etc -- crazy glider world
    // 23/3458/.05 - cool diamond world
    // 23/38/.15 - cool reaction world  --- 2378/38/.15 - more stable

    // var sb = '2378/38'; // S/B String

    var initialBirthRate = .2;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('alive', [0,0,0], processAlive);
        FF.registerState('dead', [255,255,255], processDead);
        
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
};

FFExamples.anylife.onClickS = function(num) {
    var element = document.getElementById('s-' + num);
    var isTurningOn = element.className == 'off';

    // is turning on
    if (isTurningOn) {
        element.className = 'on';
        S.push(num);
        return;
    }

    // is turning off
    element.className = 'off';
    var index = S.indexOf(num);
    S.splice(index, 1);
};

FFExamples.anylife.onClickB = function(num) {
    var element = document.getElementById('b-' + num);
    var isTurningOn = element.className == 'off';

    // is turning on
    if (isTurningOn) {
        element.className = 'on';
        B.push(num);
        return;
    }

    // is turning off
    element.className = 'off';
    var index = B.indexOf(num);
    B.splice(index, 1);
};

// TODO BUCK - add generation counter to drawer
// TODO BUCK - add initial birth rate to drawer
    // DONE BUCK - add ruleset multiselect to drawer
// TODO BUCK - save & name SB functionality 