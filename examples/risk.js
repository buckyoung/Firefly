var FFExamples = FFExamples || {};

FFExamples.risk = {};

FFExamples.risk.initialize = function(FF) {
    var peopleProb = .4;
    var wallProb = .02;
    var genCount = 0;
    var boundaryPhase = 150;
    var startingCityProb = .00006;
    var revolutionProb = .0001;
    var startingCity = 'greenPeopleCapital';
    var startingCityCount = 0;
    var startingCityTarget = 0;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('empty', [30,30,30], processEmpty);
        FF.registerState('wall', [30,30,120], doNothing);

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
        // Potential city allegiance switch when a single color rules all cities
        if (!FF.stateCounts.pinkPeopleCapital && Math.random() < revolutionProb) { 
            FF.setHistory(currentCell.getPosition(), "A rogue group of Pinks overthrew the Greens!");
            nextCell.setState('pinkPeopleCapital');
            return;
        }

        // City should switch sides if it is being overrun
        if (currentCell.countMooreNeighbors('pinkPeople') > 1) {
            FF.setHistory(currentCell.getPosition(), "Green city fell to the Pinks");
            nextCell.setState('pinkPeopleCapital');
            return;
        }
        
        // TODO add chance for fire to destroy city
        nextCell.setState(currentCell.getState());
    }

    // Capital should switch sides if the other faction gets there
    function processPinkPeopleCapital(currentCell, nextCell) {
        // Potential city allegiance switch when a single color rules all cities
        if (!FF.stateCounts.greenPeopleCapital && Math.random() < revolutionProb) {
            FF.setHistory(currentCell.getPosition(), "A rogue group of Greens overthrew the Pinks!");
            nextCell.setState('greenPeopleCapital');
            return;
        }

        // City should switch sides if it is being overrun
        if (currentCell.countMooreNeighbors('greenPeople') > 1) {
            FF.setHistory(currentCell.getPosition(), "Pink city fell to the Greens");
            nextCell.setState('greenPeopleCapital');
            return;
        }
        
        // TODO add chance for fire to destroy city
        nextCell.setState(currentCell.getState());
    }

    function processEmpty(currentCell, nextCell) {
        // Create boundaries for first X number of frames
        if (genCount <= boundaryPhase) { 
            // Grow walls
            if (currentCell.countMooreNeighbors('wall') >  0 && Math.random() < wallProb) {
                nextCell.setState('wall');
            }

            // Fill in empty spaces inside of walls
            if (currentCell.countMooreNeighbors('wall') > 4) { // Tip: Change this to 3 for more lake look
                nextCell.setState('wall');
            }

            genCount = FF.getGenerationCount();

            return;
        }

        // Populate capital cities now
        if (startingCityCount < startingCityTarget) { 
            if (
                currentCell.countMooreNeighbors('wall') == 0 
                && currentCell.countMooreNeighbors('wall', 2) == 0 
                && currentCell.countMooreNeighbors('wall', 3) == 0
                && Math.random() < startingCityProb
            ) {
                FF.setHistory(currentCell.getPosition(), "The " + (startingCity == 'greenPeopleCapital' ? "Greens" : "Pinks") + " established a starting city" );
                nextCell.setState(startingCity);

                startingCity = startingCity == 'greenPeopleCapital' ? 'pinkPeopleCapital' : 'greenPeopleCapital';

                startingCityCount++;
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
        var shouldSpreadWithoutEnemy = Math.random() < peopleProb/1.2;

        // Determine if green people should propagate
        if (currentCell.countNeumannNeighbors('greenPeople') == 0
            && (((!!FF.stateCounts.pinkPeople||!!FF.stateCounts.pinkPeopleCapital)&&shouldSpread) || (!FF.stateCounts.pinkPeople&&!FF.stateCounts.pinkPeopleCapital&&shouldSpreadWithoutEnemy)) // Propagate at a lower rate when no enemy around
            && greenCount > pinkCount
            && greenCount > 0 
            && greenCount < 5
            && !isFireNear
        ) {
            nextCell.setState('greenPeople');
            return;
        }

        // Determine if pink people should propagate
        if (currentCell.countNeumannNeighbors('pinkPeople') == 0
            && (((!!FF.stateCounts.greenPeople||!!FF.stateCounts.greenPeopleCapital)&&shouldSpread) || (!FF.stateCounts.greenPeople&&!FF.stateCounts.greenPeopleCapital&&shouldSpreadWithoutEnemy)) // Propagate at a lower rate when no enemy around
            && pinkCount > greenCount
            && pinkCount > 0 
            && pinkCount < 5
            && !isFireNear
        ) {
            nextCell.setState('pinkPeople');
            return;
        }

        // Determine if new city should be established
        if (pinkCount >= 5 || (pinkCount >= 4 && Math.random() < peopleProb/10000)) { // TODO only create a new city w/ count of 4 IF there are less than 10 total cities for that color
            FF.setHistory(currentCell.getPosition(), "The Pinks established a new city");
            nextCell.setState('pinkPeopleCapital');
            return;
        }

        if (greenCount >= 5 || (greenCount >= 4 && Math.random() < peopleProb/10000)) { // TODO only create a new city w/ count of 4 IF there are less than 10 total cities for that color
            FF.setHistory(currentCell.getPosition(), "The Greens established a new city");
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
                    var state = (Math.random() < .0005 ? 'wall' : 'empty');

                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }

            startingCityTarget = Math.floor(Math.random() * 9) + 2; // 2 - 10 starting cities
        };
    }
};