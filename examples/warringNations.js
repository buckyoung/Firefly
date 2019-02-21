var FFExamples = FFExamples || {};

FFExamples.warringNations = {};

FFExamples.warringNations.initialize = function(FF) {
    var peopleProb = .4;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('empty', [0,0,0], processEmpty);

        FF.registerState('greenPeople', [0, 179, 0], processGreenPeople);
        FF.registerState('greenPeopleCapital', [0, 255, 0], processGreenPeopleCapital);
        
        FF.registerState('pinkPeople', [179, 0, 179], processPinkPeople);
        FF.registerState('pinkPeopleCapital', [255, 0, 255], processPinkPeopleCapital);
        
        FF.registerState('fire', [255, 30, 30], processFire);

        FF.initialize(initializeWorld(FF));
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
        var pinkCount = currentCell.countMooreNeighbors('pinkPeople');
        var greenCount = currentCell.countMooreNeighbors('greenPeople');

        // Determine if capital should produce people
        if (currentCell.countMooreNeighbors('greenPeopleCapital') > 0 
            && Math.random() < peopleProb/100
        ) {
            nextCell.setState('greenPeople');
            return;
        }

        if (currentCell.countMooreNeighbors('pinkPeopleCapital') > 0 
            && Math.random() < peopleProb/100
        ) {
            nextCell.setState('pinkPeople');
            return;
        }

        var isFireNear = currentCell.countMooreNeighbors('fire', 1) > 0 || currentCell.countMooreNeighbors('fire', 2) > 0;
        var shouldSpread = Math.random() < peopleProb;

        // Determine if green people should propagate
        if (
            currentCell.countNeumannNeighbors('greenPeople') == 0 &&// Remove / add - Explosive people vs warring nations
            greenCount > pinkCount
            && greenCount > 0 
            && greenCount < 5 
            && shouldSpread
            && !isFireNear
        ) {
            nextCell.setState('greenPeople');
            return;
        }

        // Determine if pink people should propagate
        if (
            currentCell.countNeumannNeighbors('pinkPeople') == 0 &&// Remove / add - Explosive people vs warring nations
            pinkCount > greenCount
            && pinkCount > 0 
            && pinkCount < 5 
            && shouldSpread
            && !isFireNear
        ) {
            nextCell.setState('pinkPeople');
            return;
        }

        nextCell.setState(currentCell.getState());
    }

    function processGreenPeople(currentCell, nextCell) {
        var pinkCount = currentCell.countMooreNeighbors('pinkPeople');
        var greenCount = currentCell.countMooreNeighbors('greenPeople');

        if (greenCount < pinkCount) {
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

    function processPinkPeople(currentCell, nextCell) {
        var pinkCount = currentCell.countMooreNeighbors('pinkPeople');
        var greenCount = currentCell.countMooreNeighbors('greenPeople');

        if (pinkCount < greenCount) {
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
            world[w][h] = new FF.Cell('pinkPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('pinkPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('pinkPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('pinkPeopleCapital', w+1, h+1);

            w = Math.floor(width*2/5);
            h = Math.floor(height*1/4);
            world[w][h] = new FF.Cell('greenPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('greenPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('greenPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('greenPeopleCapital', w+1, h+1);

            w = Math.floor(width*3/5);
            h = Math.floor(height*1/4);
            world[w][h] = new FF.Cell('pinkPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('pinkPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('pinkPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('pinkPeopleCapital', w+1, h+1);

            w = Math.floor(width*4/5);
            h = Math.floor(height*1/4);
            world[w][h] = new FF.Cell('greenPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('greenPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('greenPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('greenPeopleCapital', w+1, h+1);

            // Row 2
            w = Math.floor(width*1/3);
            h = Math.floor(height*2/4);
            world[w][h] = new FF.Cell('pinkPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('pinkPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('pinkPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('pinkPeopleCapital', w+1, h+1);

            w = Math.floor(width*2/3);
            h = Math.floor(height*2/4);
            world[w][h] = new FF.Cell('greenPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('greenPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('greenPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('greenPeopleCapital', w+1, h+1);

            // Row 3
            w = Math.floor(width*1/5);
            h = Math.floor(height*3/4);
            world[w][h] = new FF.Cell('greenPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('greenPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('greenPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('greenPeopleCapital', w+1, h+1);

            w = Math.floor(width*2/5);
            h = Math.floor(height*3/4);
            world[w][h] = new FF.Cell('pinkPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('pinkPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('pinkPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('pinkPeopleCapital', w+1, h+1);

            w = Math.floor(width*3/5);
            h = Math.floor(height*3/4);
            world[w][h] = new FF.Cell('greenPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('greenPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('greenPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('greenPeopleCapital', w+1, h+1);

            w = Math.floor(width*4/5);
            h = Math.floor(height*3/4);
            world[w][h] = new FF.Cell('pinkPeopleCapital', w, h);
            world[w+1][h] = new FF.Cell('pinkPeopleCapital', w+1, h);
            world[w][h+1] = new FF.Cell('pinkPeopleCapital', w, h+1);
            world[w+1][h+1] = new FF.Cell('pinkPeopleCapital', w+1, h+1);
        };
    }
};