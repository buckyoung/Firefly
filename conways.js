(function() {
    var world = new FFLYWorld();

    world.registerState('alive', 'rgb(200,0,0)', processAlive);
    world.registerState('dead', 'rgb(0,0,0)', processDead);

    world.initialize('dead');

    world.initializeState('alive', 30);

    function processAlive() {
        var neighbors = this.mooreNeighbors('alive');
        
        if (neighbors < 2 || neighbors > 3) {
            this.changeState('dead');
        }
    }

    function processDead() {
        if (this.mooreNeighbors('alive') === 3) {
            this.changeState('alive');
        }
    }

})();