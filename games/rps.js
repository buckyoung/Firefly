var colors = [
    'a',
    'b',
    'c',
    // 'd'
];

var rotator = 0;

function initGame() {
    Firefly(function(FF) {
        var inx = 0;

        FF.registerState(colors[inx++], [150, 204, 150], processAverage);
        FF.registerState(colors[inx++], [0, 128, 255], processAverage);
        FF.registerState(colors[inx++], [102, 178, 255], processAverage);

        // FF.registerState(colors[inx++], [150, 230, 30], processAverage);

        FF.initialize(initializeWorld(FF));
    });
};

function processAverage(currentCell, nextCell) {
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

function processOneRandomNeighbor(currentCell, nextCell) {
    var currentState = currentCell.getState();

    var index = colors.indexOf(currentState);

    index = (index + 1) % colors.length;

    var eaterState = colors[index];

    var randoNeighborState = currentCell.randomNeumannNeighborState();

    if (eaterState === randoNeighborState) {
        nextCell.setState(eaterState);
        return;
    }
    
    nextCell.setState(currentState);
}

function initializeWorld(FF) {
    return function(world, width, height) {
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                var rando = Math.floor(Math.random() * 100);
                var state = colors[rotator + rando  % colors.length];

                // Favor one color
                // if (rando < 10) {
                //     state = colors[0];
                // }

                world[i][j] = new FF.Cell(state, i, j); 
            }
        }
    };
}