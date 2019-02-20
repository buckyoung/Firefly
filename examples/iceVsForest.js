var FFExamples = FFExamples || {};

FFExamples.iceVsForest = {};

FFExamples.iceVsForest.initialize = function(FF) {
    var treeProb = .0006;
    var fireProb = .00001;

    initializeModel(FF);

    function initializeModel(FF) {
        FF.registerState('tree', [50, 100, 50], processTree);
        FF.registerState('fire', [255, 70, 70], processFire);
        FF.registerState('empty', [30, 30, 30], processEmpty);
        FF.registerState('ice', [240, 250, 255], processIce);

        FF.initialize(initializeWorld(FF));
    }

    function processIce(currentCell, nextCell) {
        var burningNeighborCount = currentCell.countMooreNeighbors('fire', 2);

        if (burningNeighborCount > 0) {
            if (Math.random() <= .03) {
                nextCell.setState('fire');
                return;
            }

            nextCell.setState('empty');
            return;
        }

        var burningNeighborCount = currentCell.countMooreNeighbors('fire', 3);

        if (burningNeighborCount > 0) {
            if (Math.random() <= .01) {
                nextCell.setState('fire');
                return;
            }

            nextCell.setState('empty');
            return;
        }

        nextCell.setState('ice');
    }

    function processTree(currentCell, nextCell) {
        var iceCount = currentCell.countMooreNeighbors('ice');

        if (iceCount > 0) {
            nextCell.setState('ice');
            return;
        }

        var burningNeighborCount = currentCell.countMooreNeighbors('fire');

        if (burningNeighborCount > 0) {
            nextCell.setState('fire');
            return;
        }

        burningNeighborCount = currentCell.countMooreNeighbors('fire', 2);

        if (burningNeighborCount > 1) {
            nextCell.setState('fire');
            return;
        }

        if (Math.random() <= fireProb) {
            nextCell.setState('fire');
            return;
        }

        nextCell.setState('tree');
    }

    function processFire(currentCell, nextCell) {
        if (Math.random() <= .8) {
            nextCell.setState('fire');
            return;
        }

        nextCell.setState('empty');
    }

    function processEmpty(currentCell, nextCell) {
        if (Math.random() <= treeProb) {
            nextCell.setState('tree');
            return;
        }

        nextCell.setState('empty');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var state = 'empty';

                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }

            world[0][0] = new FF.Cell('ice', 0, 0); 
        };
    }
};