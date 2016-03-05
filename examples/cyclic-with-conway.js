var FFExamples = FFExamples || {};

FFExamples.cyclicWithConway = {};

FFExamples.cyclicWithConway.initialize = function(FF) {
    var colors = [
        'a', 
        'b', 
        'c'
    ];
    
    initializeModel(FF);

    function initializeModel(FF) {
        var index = 0;

        FF.registerState(colors[index++], [223, 163, 163], process);
        FF.registerState(colors[index++], [171, 223, 163], process);
        FF.registerState(colors[index++], [185, 163, 223], process);

        FF.registerState('alive', [30, 30, 140], processAlive);

        FF.initialize(initializeWorld(FF));
    }

    function process(currentCell, nextCell) {
        // Conway:
        var aliveNeighborCount = currentCell.mooreNeighbors('alive');

        if (aliveNeighborCount === 3) {
            nextCell.setState('alive');
            return;
        }

        // RPS:
        var currentState = currentCell.getState();

        var index = colors.indexOf(currentState);

        index = (index + 1) % colors.length;

        var newState = colors[index];

        var neighborCount = currentCell.mooreNeighbors(newState);

        if (neighborCount >= 3) {
            nextCell.setState(newState);
            return;
        }
        
        nextCell.setState(currentState);
    }

    // Conway:
    function processAlive(currentCell, nextCell) {
        var aliveNeighborCount = currentCell.mooreNeighbors('alive');
        var rotator = 0;
        var rando = Math.floor(Math.random() * 100);
        var state = colors[rotator++ + rando  % colors.length];

        if (aliveNeighborCount < 2 || aliveNeighborCount > 3) {
            nextCell.setState(state);
            return;
        }

        nextCell.setState('alive');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    var rotator = 0;
                    var rando = Math.floor(Math.random() * 100);
                    var state = colors[rotator++ + rando  % colors.length];

                    // Conway:
                    if (rando < 30) {
                        state = 'alive';
                    }

                    world[i][j] = new FF.Cell(state, i, j); 
                }
            }
        };
    }
};