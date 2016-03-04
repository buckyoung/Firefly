function initFirst() {
    Firefly(function(FF) {
        FF.registerState('alive', [200, 0, 0], processAlive);
        FF.registerState('dead', [240, 240, 250], processDead);

        FF.initialize(initializeWorld(FF));        
    });
};

function processAlive(currentCell, nextCell) {
    var aliveNeighborCount = currentCell.mooreNeighbors('alive');

    if (aliveNeighborCount < 2 || aliveNeighborCount > 3) {
        nextCell.state = 'dead';
        return;
    }

    if (aliveNeighborCount === 2 || aliveNeighborCount === 3) {
        nextCell.state = 'alive';
        return;
    }
}

function processDead(currentCell, nextCell) {
    var aliveNeighborCount = currentCell.mooreNeighbors('alive');

    if (aliveNeighborCount === 3) {
        nextCell.state = 'alive';
        return;
    } else {
        nextCell.state = 'dead';
        return;
    }
}

function initializeWorld(FF) {
    return function(world, width, height) {
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                var state = (Math.random() > .4 ? 'dead' : 'alive');
                
                world[i][j] = new FF.Cell(state, { x: i, y: j }); 
            }
        }
    };
}