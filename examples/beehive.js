var FFExamples = FFExamples || {};

FFExamples.beehive = {};

// Inspired by https://www.reddit.com/r/NatureIsFuckingLit/comments/arrviu/beehive_makes_mesmerizing_defensive_wave/

// TODO - to get the effect of "Action Potential" across the bees, do something like you did with ice vs forest 
// // you need the "crackle" effect -- as some bees will be triggered more easily & may pop off when a bee 2 or 3 away from it goes off
// So, rewrite some of this logic to allow for bees to crackle out

FFExamples.beehive.initialize = function(FF) {
    var threatProb = .0000001;
    var numOfTurningBackFrames = 10; // 2 is dope and trippy -- 4 is stable

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('back', [255, 213, 0], processBack);
        FF.registerState('turningBelly', [179, 149, 0], turningBelly);
        FF.registerState('turningBackFinal', [179, 149, 0], turningBackFinal);
        FF.registerState('belly', [179, 149, 0], processBelly);

        for (var i=0; i < numOfTurningBackFrames; i++) {
            FF.registerState('' + (i+1), [179, 149, 0], processTurningBacks);
        }

        FF.initialize(initializeWorld(FF));
    }

    function processBack(currentCell, nextCell) {
        // If a threat is detected, start turning towards belly
        if (Math.random() <= threatProb) {
            nextCell.setState('turningBelly');
            return;
        }

        // If anyone around you is on belly, start turning to belly
        var countNeumann = currentCell.countNeumannNeighbors('belly');
        var countMoore = currentCell.countMooreNeighbors('belly');

        var count = Math.random() > .5 ? countNeumann : countMoore; // Creates more "organic" (less geometric) shapes

        if (count > 0) {
            nextCell.setState('turningBelly');
            return;
        }

        // Otherwise, stay back
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

    function turningBelly(currentCell, nextCell) {
        nextCell.setState('belly');
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