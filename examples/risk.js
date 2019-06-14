var FFExamples = FFExamples || {};

FFExamples.risk = {};

FFExamples.risk.initialize = function(FF) {
    // TODO Build a system into FF to register ui elements to expose internal model parameters
    var peopleProb = .4;
    var wallProb = .02;
    var genCount = 0;
    var boundaryPhase = 150;
    var startingCityProb = .00006;
    var revolutionProb = .0001;
    var fireDestroyCityProb = .1;
    var startingCity = 'greenPeopleCapital';
    var startingCityCount = 0;
    var startingCityTarget = 0;

    var cursorBrushElement = document.getElementById('cursor-brush'); // TODO refactor this to be a firefly modules w an interface

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('empty', [30,30,30], processEmpty);
        FF.registerState('wall', [30,30,120], doNothing);

        // TODO Refactor to allow a 3rd color / an arbitrary number of colors 

        FF.registerState('greenPeople', [0, 120, 0], processGreenPeople);
        FF.registerReportTracking('greenPeople', [0, 120, 0]);
        FF.registerState('greenPeopleCapital', [0, 255, 0], processGreenPeopleCapital);
        
        FF.registerState('pinkPeople', [120, 0, 120], processPinkPeople);
        FF.registerReportTracking('pinkPeople', [120, 0, 120]);
        FF.registerState('pinkPeopleCapital', [255, 0, 255], processPinkPeopleCapital);
        
        FF.registerState('fire', [255, 30, 30], processFire);
        
        FF.registerState('onMouseClick', [0, 0, 0], onMouseClick); // TODO make a registerHandler - no color needed

        FF.setReportingSnapshotInterval(200);

        FF.initialize(initializeWorld(FF));
    }

    function onMouseClick(currentCell, nextCell) {
        if (currentCell.getState() !== 'empty') { return; }

        // TODO if shift-click, store the cell state as the paint brush
        // TODO also... click and drag would be nice for water

        nextCell.setState(startingCity);
        FF.setHistory(nextCell.getPosition(), "You brought forth a new " + (startingCity == 'greenPeopleCapital' ? "Green" : "Pink") + " city" );
        startingCity = startingCity == 'greenPeopleCapital' ? 'pinkPeopleCapital' : 'greenPeopleCapital';
        cursorBrushElement.style.background=(startingCity == 'greenPeopleCapital' ? "lawngreen" : "deeppink");
    }

    function doNothing(currentCell, nextCell) {
        nextCell.setState(currentCell.getState());
    }


    // Capital should switch sides if the other faction gets there
    function processGreenPeopleCapital(currentCell, nextCell) {
        // Potential city allegiance switch when a single color rules all cities
        if (!FF.getStateCount('pinkPeopleCapital') && Math.random() < revolutionProb) { 
            FF.setHistory(currentCell.getPosition(), "Some rogue Pinks overthrew the Greens!");
            nextCell.setState('pinkPeopleCapital');
            return;
        }

        // City should switch sides if it is being overrun
        if (currentCell.countMooreNeighbors('pinkPeople') > 1) {
            FF.setHistory(currentCell.getPosition(), "Green city fell to the Pinks");
            nextCell.setState('pinkPeopleCapital');
            return;
        }
        
        // Chance for fire to destroy city
        var fireCount = currentCell.countMooreNeighbors('fire');
        if (fireCount >= 4 && Math.random() < fireDestroyCityProb) {
            nextCell.setState('wall');
            FF.setHistory(currentCell.getPosition(), "Green city burned to the ground");
            return;
        }

        nextCell.setState(currentCell.getState());
    }

    // Capital should switch sides if the other faction gets there
    function processPinkPeopleCapital(currentCell, nextCell) {
        // Potential city allegiance switch when a single color rules all cities
        if (!FF.getStateCount('greenPeopleCapital') && Math.random() < revolutionProb) {
            FF.setHistory(currentCell.getPosition(), "Some rogue Greens overthrew the Pinks!");
            nextCell.setState('greenPeopleCapital');
            return;
        }

        // City should switch sides if it is being overrun
        if (currentCell.countMooreNeighbors('greenPeople') > 1) {
            FF.setHistory(currentCell.getPosition(), "Pink city fell to the Greens");
            nextCell.setState('greenPeopleCapital');
            return;
        }
        
        // Chance for fire to destroy city
        var fireCount = currentCell.countMooreNeighbors('fire', 1);
        if (fireCount >= 4 && Math.random() < fireDestroyCityProb) {
            nextCell.setState('wall');
            FF.setHistory(currentCell.getPosition(), "Pink city burned to the ground");
            return;
        }

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
            && (((!!FF.getStateCount('pinkPeople')||!!FF.getStateCount('pinkPeopleCapital'))&&shouldSpread) || (!FF.getStateCount('pinkPeople')&&!FF.getStateCount('pinkPeopleCapital')&&shouldSpreadWithoutEnemy)) // Propagate at a lower rate when no enemy around
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
            && (((!!FF.getStateCount('greenPeople')||!!FF.getStateCount('greenPeopleCapital'))&&shouldSpread) || (!FF.getStateCount('greenPeople')&&!FF.getStateCount('greenPeopleCapital')&&shouldSpreadWithoutEnemy)) // Propagate at a lower rate when no enemy around
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
        // TODO OPTIMIZATION - check if theres any fire at all before checking if theres fire around a person. Use the FF.getStateCount()
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
        // TODO OPTIMIZATION - check if theres any fire at all before checking if theres fire around a person. Use the FF.getStateCount()
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

    // TODO Flesh this out and start using?
    function generateCityName(position, color) {
        var name = [];

        name.push((position.x % 26) + 97);
        name.push((position.y % 26) + 97);
        name.push(((position.x+color.length) % 26) + 97);
        name.push(((position.x*color.length) % 26) + 97);
        name.push(((position.y+color.length) % 26) + 97);
        name.push(((position.y*color.length) % 26) + 97);
        name.push(((color.length*Math.random()) % 26) + 97);

        var result = [];

        name.forEach(function(ch) {
            result.push(String.fromCharCode(ch));
        });

        result[0] = result[0].toUpperCase();

        // console.log(result.join(''));

        return result.join('');
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