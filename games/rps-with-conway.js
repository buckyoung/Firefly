var colors = ['red', 'green', 'blue'];
var rotator = 0;

function initGame() {
    Firefly(function(FF) {
        var inx = 0;

        FF.registerState(colors[inx++], [100, 0, 0], process);
        FF.registerState(colors[inx++], [30, 130, 10], process);
        FF.registerState(colors[inx++], [0, 0, 130], process);

        FF.registerState('alive', [255, 255, 255], processAlive);

        FF.initialize(initializeWorld(FF));
    });
};

function process(currentCell, nextCell) {
    var aliveNeighborCount = currentCell.mooreNeighbors('alive');

    if (aliveNeighborCount === 3) {
        nextCell.setState('alive');
        return;
    }

    //RPS:

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

function processAlive(currentCell, nextCell) {
    var aliveNeighborCount = currentCell.mooreNeighbors('alive');

    var rando = Math.floor(Math.random() * 100);
    var state = colors[rotator + rando  % colors.length];

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
                var rando = Math.floor(Math.random() * 100);
                var state = colors[rotator + rando  % colors.length];

                if (rando < 30) {
                    state = 'alive';
                }

                world[i][j] = new FF.Cell(state, i, j); 
            }
        }
    };
}