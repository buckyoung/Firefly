var FFExamples = FFExamples || {};

FFExamples.risk = {};

FFExamples.risk.initialize = function(FF) {
    var peopleProb = .4;
    var wallProb = .02;
    var genCount = 0;
    var boundaryPhase = 100;
    var startingCityProb = .00006;
    var startingCity = 'greenPeopleCapital';

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('empty', [30,30,30], processEmpty);
        FF.registerState('wall', [30,30,90], doNothing);

        FF.registerState('greenPeople', [0, 120, 0], processGreenPeople);
        FF.registerState('greenPeopleCapital', [0, 255, 0], processGreenPeopleCapital);
        
        FF.registerState('pinkPeople', [120, 0, 120], processPinkPeople);
        FF.registerState('pinkPeopleCapital', [255, 0, 255], processPinkPeopleCapital);
        
        FF.registerState('fire', [255, 30, 30], processFire);

        FF.initialize(initializeWorld(FF));
    }

    function doNothing(currentCell, nextCell) {
        nextCell.setState(currentCell.getState());
    }

    // Capital should switch sides if the other faction gets there
    function processGreenPeopleCapital(currentCell, nextCell) {
        if (currentCell.countMooreNeighbors('pinkPeople') > 0) {
            nextCell.setState('pinkPeopleCapital');
            return;
        }

        nextCell.setState(currentCell.getState());
    }

    // Capital should switch sides if the other faction gets there
    function processPinkPeopleCapital(currentCell, nextCell) {
        if (currentCell.countMooreNeighbors('greenPeople') > 0) {
            nextCell.setState('greenPeopleCapital');
            return;
        }

        nextCell.setState(currentCell.getState());
    }

    function processEmpty(currentCell, nextCell) {
        if (genCount < boundaryPhase + 1) {
            genCount = FF.getGenerationCount();
        }

        if (genCount < boundaryPhase) { // Create boundaries for first X number of frames
            // Grow walls
            if (currentCell.countMooreNeighbors('wall') >  0 && Math.random() < wallProb) {
                nextCell.setState('wall');
            }

            // Fill in empty spaces inside of walls
            if (currentCell.countMooreNeighbors('wall') > 5) {
                nextCell.setState('wall');
            }
            return;
        }

        if (genCount == boundaryPhase) { // Populate capital cities now
            if (currentCell.countMooreNeighbors('wall') == 0 && Math.random() < startingCityProb) {
                nextCell.setState(startingCity);

                startingCity = startingCity == 'greenPeopleCapital' ? 'pinkPeopleCapital' : 'greenPeopleCapital';
            }
            return;
        }


        var pinkCount = currentCell.countMooreNeighbors('pinkPeople');
        var greenCount = currentCell.countMooreNeighbors('greenPeople');

        // Determine if capital should produce people
        if (currentCell.countMooreNeighbors('greenPeopleCapital') > 0 
            && Math.random() < peopleProb/50
        ) {
            nextCell.setState('greenPeople');
            return;
        }

        if (currentCell.countMooreNeighbors('pinkPeopleCapital') > 0 
            && Math.random() < peopleProb/50
        ) {
            nextCell.setState('pinkPeople');
            return;
        }

        var isFireNear = currentCell.countMooreNeighbors('fire', 1) > 0 || currentCell.countMooreNeighbors('fire', 2) > 0;
        var shouldSpread = Math.random() < peopleProb;

        // Determine if green people should propagate
        if (currentCell.countNeumannNeighbors('greenPeople') == 0
            && greenCount > pinkCount
            && greenCount > 0 
            && greenCount < 5 
            && shouldSpread
            && !isFireNear
        ) {
            nextCell.setState('greenPeople');
            return;
        }

        // Determine if pink people should propagate
        if (currentCell.countNeumannNeighbors('pinkPeople') == 0
            && pinkCount > greenCount
            && pinkCount > 0 
            && pinkCount < 5 
            && shouldSpread
            && !isFireNear
        ) {
            nextCell.setState('pinkPeople');
            return;
        }

        // Determine if new city should be established
        if (pinkCount >= 5 || (pinkCount >= 4 && Math.random() < peopleProb/10000)) { // TODO only create a new city w/ count of 4 IF there are less than 10 total cities for that color
            nextCell.setState('pinkPeopleCapital');
            return;
        }

        if (greenCount >= 5 || (greenCount >= 4 && Math.random() < peopleProb/10000)) { // TODO only create a new city w/ count of 4 IF there are less than 10 total cities for that color
            nextCell.setState('greenPeopleCapital');
            return;
        }

        nextCell.setState(currentCell.getState());
    }

    function processGreenPeople(currentCell, nextCell) {
        var pinkCount = currentCell.countMooreNeighbors('pinkPeople');
        var greenCount = currentCell.countMooreNeighbors('greenPeople');

        // Go up in flames if more pink people directly around you
        if (greenCount < pinkCount) {
            nextCell.setState('fire');
            return;
        }

        // Fire spreads up to 3 away
        if (currentCell.countMooreNeighbors('fire', 1) > 0
            || currentCell.countMooreNeighbors('fire', 2) > 0
            || currentCell.countMooreNeighbors('fire', 3) > 0
        ) {
            nextCell.setState('fire');
            return;
        }

        nextCell.setState('empty');
    }

    function processPinkPeople(currentCell, nextCell) {
        var pinkCount = currentCell.countMooreNeighbors('pinkPeople');
        var greenCount = currentCell.countMooreNeighbors('greenPeople');

        // Go up in flames if more green people directly around you
        if (pinkCount < greenCount) {
            nextCell.setState('fire');
            return;
        }

        // Fire spreads up to 3 away
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
                    var state = (Math.random() < .001 ? 'wall' : 'empty');

                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};