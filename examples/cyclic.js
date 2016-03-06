var FFExamples = FFExamples || {};

FFExamples.cyclic = {};

FFExamples.cyclic.initialize = function(FF) {
    var colors = [
        'a',
        'b',
        'c',
        // 'd'
    ];

    initializeModel(FF);

    function initializeModel(FF) {
        var index = 0;

        FF.registerState(colors[index++], [150, 204, 150], processAverage);
        FF.registerState(colors[index++], [0, 128, 255], processAverage);
        FF.registerState(colors[index++], [102, 178, 255], processAverage);

        // FF.registerState(colors[index++], [150, 230, 30], processAverage);

        FF.initialize(initializeWorld(FF));
    }

    function processAverage(currentCell, nextCell) {
        var currentState = currentCell.getState();

        var index = colors.indexOf(currentState);

        index = (index + 1) % colors.length;

        var newState = colors[index];

        var neighborCount = currentCell.countMooreNeighbors(newState);

        if (neighborCount >= 3) {
            nextCell.setState(newState);
            return;
        }
        
        nextCell.setState(currentState);
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var rotator = 0;
                    var rando = Math.floor(Math.random() * 100);
                    var state = colors[rotator++ + rando  % colors.length];

                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};