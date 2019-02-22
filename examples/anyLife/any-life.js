var FFExamples = FFExamples || {};

FFExamples.anylife = {};

var S = []; // Survive
var B = []; // Born
var initialBirthRate = .2;
var birthRateMap = {
    '1': .00005,
    '2': .0015,
    '3': .005,
    '4': .01,
    '5': .1,
    '6': .25,
    '7': .5,
    '8': .6,
    '9': .8,
    '10': .99
};

Firefly.params = {
    INVERSE_SIZE: 5, // Min 1 Max 10 on frontend
    INVERSE_SPEED: 100, // Min 10 Max 300 on frontend
    CANVAS_1_ID: 'A',
    CANVAS_2_ID: 'B',
    POPULATION: 5
};

FFExamples.anylife.initialize = function(FF) {
    // 134/3 -- my shit!
    // 678/2 or 456/2 or 234/2, etc -- crazy glider world
    // 23/3458/.05 - cool diamond world
    // 23/38/.15 - cool reaction world  --- 2378/38/.15 - more stable
    // 13/34 - very cool white shapes trippy
    // 34578/45678 - wild black diamond world very stable
    // 34578/34568 - OCTOGON WORLD - start w low pop, octogons when growing
    // 45678/01678 - black world w/ tunnels and movement in the tunnels
    // 14567/278 - speed 10, wild geometry in black pieces - constantly reconfiguring - toggle B6 on for more structure, then toggle on B1 on and turn B6 off to harden everything. Allow it to thaw before its totally hard. b6 does quick thaw
    // 
    // 78/12345678 - 10 pop density -- also try 8/12345678 - transfer down to /12345 - /1234

    // var sb = '2378/38'; // S/B String
    
    initializeModel(FF);

    function initializeModel(FF) {
        var populationValue = document.getElementById('population-value');
        var populationInput = document.getElementById('population-input');

        populationValue.innerText = Firefly.params.POPULATION;
        populationInput.value = Firefly.params.POPULATION;

        FF.registerState('alive', [250,255,0], processAlive);
        FF.registerState('dead', [67,36,127], processDead);
        
        FF.initialize(initializeWorld(FF));

        // Initial randomization for S/B
        // for (var i = 0; i < 9; i++) {
        //     if (Math.random() < .5) {
        //         FFExamples.anylife.onClickS(i);
        //     }
        // }

        // for (var i = 0; i < 9; i++) {
        //     if (Math.random() < .5) {
        //         FFExamples.anylife.onClickB(i);
        //     }
        // }
        // 
        // randomizeRules();
    }

    function processAlive(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');

        if (S.includes(aliveNeighborCount)) {
            // Staying alive, lets keep the color the same
            nextCell.setState('alive');
            return;
        }

        nextCell.setState('dead', false);

        // Transitioning from alive to dead, lets transition color
        var currentColor = nextCell.getColor();
        var deadColor = Firefly.getStates()['dead'].color;

        var halfRed = parseInt((currentColor[0] - deadColor[0]) / 2);
        var newRed = currentColor[0] - halfRed;

        var halfGreen = parseInt((currentColor[1] - deadColor[1]) / 2);
        var newGreen = currentColor[1] - halfGreen;

        var halfBlue = parseInt((currentColor[2] - deadColor[2]) / 2);
        var newBlue = currentColor[2] - halfBlue;

        nextCell.setColor([newRed, newGreen, newBlue]);
    }

    function processDead(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.countMooreNeighbors('alive');

        if (B.includes(aliveNeighborCount)) {
            nextCell.setState('alive'); // Always make alive color "pop"
            return;
        }

        nextCell.setState('dead', false);
        
        // Potentially still transitioning to full-on dead color
        var currentColor = nextCell.getColor();
        var deadColor = Firefly.getStates()['dead'].color;

        var halfRed = parseInt((currentColor[0] - deadColor[0]) / 2);
        var newRed = currentColor[0] - halfRed;

        var halfGreen = parseInt((currentColor[1] - deadColor[1]) / 2);
        var newGreen = currentColor[1] - halfGreen;

        var halfBlue = parseInt((currentColor[2] - deadColor[2]) / 2);
        var newBlue = currentColor[2] - halfBlue;

        nextCell.setColor([newRed, newGreen, newBlue]);
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var state = (Math.random() < initialBirthRate ? 'alive' : 'dead');
                    
                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }

    // function randomizeRules() {
    //     S = [];
    //     B = [];

    //     var numOfChanges = parseInt(Math.random() * (3 - 1) + 1); // between 2 and 1 changes

    //     for (var i = 0; i < numOfChanges; i++) {
    //         var numToChange = parseInt(Math.random() * (9 - 0) + 0); // between 8 and 0, toggle

    //         if (Math.random() < .5) { // change S
    //             FFExamples.anylife.onClickS(numToChange);
    //         } else { // change B
    //             FFExamples.anylife.onClickB(numToChange);
    //         }
    //     }

    //     FF.initialize(initializeWorld(FF));

    //     var timeout = setTimeout(function() {
    //         randomizeRules();
    //         clearTimeout(timeout); 
    //     }, 3000);
    // }
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

FFExamples.anylife.updatePopulation = function(value) {
    var populationValue = document.getElementById('population-value');
    populationValue.innerText = value;
    Firefly.params.POPULATION = value;
    initialBirthRate = birthRateMap[value];
    Firefly.drawer.resetPlayModel();
};

// TODO BUCK - pause button? should be easy just clear timeout function -- but PLAYing again will be hard cause we lose the context for swap buffer -- OH DUDE JUST SET THE FRAME DELAY TO 999999999
// TODO BUCK - implement color picker
// TODO BUCK - implement trails on/off checkbox
// TODO BUCK - implement thermal color spectrum?
// TODO BUCK - add generation counter to drawer
// TODO BUCK - save & name SB functionality, maybe with voting functionality?
// TODO BUCK - automatically change ruleset every so many seconds
// TODO BUCK - turn off wrapping... how to count outside bounds?

// DONE BUCK - add initial birth rate to drawer
// DONE BUCK - add ruleset multiselect to drawer
// DONE BUCK - introduce cool/hot colors based on cell lifetime - or maybe just a generic color easing from alive to dead... basically have color over time be a property of the cell somehow... might have to introduce ease in / ease out concepts to states??


// Might need to implement an eventing hook system
// i could use this for generation counter and for cell color updates
// basically fire event before / after every FRAME
// generation could use this event to update the dom
// cells could use this event to ease color transitions
