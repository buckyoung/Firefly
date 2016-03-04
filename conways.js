function initFirst() {
    Firefly(function(FF) {
        FF.registerState('alive', [200, 0, 0], processAlive);
        FF.registerState('dead', [240, 240, 250], processDead);
        FF.init();
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