// Firefly.proptype = {
//     INVERSE_SIZE: 6,
//     INVERSE_SPEED: 100,
//     HEIGHT: 0,
//     WIDTH: 0,
//     CURRENT_WORLD: 0,
//     NEXT_WORLD: 0,
//     NEXT_CTX: 0
// };

// Sandbox Module JS Pattern from Stefanov, clarified here: http://stackoverflow.com/a/16224248
function Firefly() {
    var args = Array.prototype.slice.call(arguments); 
    var callback = args.pop(); //The last argument is the callback
    var requiredModules = (args[0] && typeof args[0] === "string") ? args : args[0];  //The remaining arguments are the required modules -- support single array or multiple strings

    console.log(this);

    // Support simplified calling of this sandbox (automatically get modules)
    if (!(this instanceof Firefly) || requiredModules.length === 0) { 
        return new Firefly(['world', 'returnLetters'], callback);
    }

    //For each of the modules in 'requiredModules', add the module's methods to 'this'
    for (var i = 0; i < requiredModules.length; i++) {
        Firefly.modules[requiredModules[i]](this);
    }

    callback(this);
}

Firefly.modules = {};

Firefly.modules.world = function(FIREFLY) {
    FIREFLY.return100 = function() {return 100;};
};

Firefly.modules.returnLetters = function(FIREFLY) {
    FIREFLY.returnABC = function() {return "ABC";};
};

    






var INVERSE_SIZE = 6;
var INVERSE_SPEED = 100;

var HEIGHT;
var WIDTH;

var CURRENT_WORLD;
var NEXT_WORLD;

var NEXT_CTX;


///
/// THIS LIVES IN ANOTHER FILE
var STATES = {
    alive: {
        color: 'rgb(200,0,0)',
        processor: function(currentCell, nextCell) {
            var aliveNeighborCount = currentCell.mooreNeighbors('alive');

            if (aliveNeighborCount < 2 || aliveNeighborCount > 3) {
                nextCell.state = 'dead';
                return;
            }

            if (aliveNeighborCount === 2 || aliveNeighborCount === 3) {
                nextCell.state = 'alive';
                return;
            }
        },
        state: 'alive'
    },
    dead: {
        color: 'rgb(255,255,255)',
        processor: function(currentCell, nextCell) {
            var aliveNeighborCount = currentCell.mooreNeighbors('alive');

            if (aliveNeighborCount === 3) {
                nextCell.state = 'alive';
                return;
            } else {
                nextCell.state = 'dead';
                return;
            }
        },
        state: 'dead'
    }
};
/// THEY ARE REGISTERED
/// 


function create2dArray(length) {
    new Array(length);

    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = create2dArray.apply(this, args);
    }

    return arr;
}

/**
 * Initialize the engine
 */
function init() {
    // Prime the engine
    var canvas_1 = document.getElementById('A');
    var ctx_1 = canvas_1.getContext('2d');

    var canvas_2 = document.getElementById('B');
    var ctx_2 = canvas_2.getContext('2d');

    setDimensions(canvas_1, canvas_2);
    // window.addEventListener("resize", setDimensions); -- this would change the size of the world mid game! is that even possible! no way! // Altho we could reinitialize the game upon resize

    // Initialize world
    var world_1 = create2dArray(WIDTH, HEIGHT);
    var world_2 = create2dArray(WIDTH, HEIGHT);

    initializeWorld(world_1);
    initializeWorld(world_2);

    // Start the engine
    swapBuffer(true, false, canvas_1, canvas_2, ctx_1, ctx_2, world_1, world_2);
}

function initializeWorld(world) {
    for (var i = 0; i < WIDTH; i++) {
        for (var j = 0; j < HEIGHT; j++) {
            var state = (Math.random() > .4 ? 'dead' : 'alive');
            world[i][j] = new Cell(state, { x: i, y: j }); 
        }
    }
}

function Cell(state, location) {
    var self = this; 

    self.state = state; // NOTE: you can access these properties directly! i should have a getter/setter only
    self.location = location; // CAN MAKE CONSTANT???
}

Cell.prototype.changeState = function(state) {
    var self = this; 

    self.state = state;
}

Cell.prototype.mooreNeighbors = function(targetState) {
    var self = this;

    var result = 0;
    var x = self.location.x;
    var y = self.location.y;

    if ( CURRENT_WORLD[x-1][y-1].state === targetState ) { result++; }
    if ( CURRENT_WORLD[x  ][y-1].state === targetState ) { result++; }
    if ( CURRENT_WORLD[x+1][y-1].state === targetState ) { result++; }
    if ( CURRENT_WORLD[x-1][y  ].state === targetState ) { result++; }
    if ( CURRENT_WORLD[x+1][y  ].state === targetState ) { result++; }
    if ( CURRENT_WORLD[x-1][y+1].state === targetState ) { result++; }
    if ( CURRENT_WORLD[x  ][y+1].state === targetState ) { result++; }
    if ( CURRENT_WORLD[x+1][y+1].state === targetState ) { result++; }

    return result;
}

/**
 * Set width and height globals and resize the canvases 
 * @param {Canvas} canvas_1 The first buffer
 * @param {Canvas} canvas_2 The second buffer
 */
function setDimensions(canvas_1, canvas_2) {
    WIDTH = Math.floor(window.innerWidth/INVERSE_SIZE);
    HEIGHT = Math.floor(window.innerHeight/INVERSE_SIZE);
    canvas_1.width = WIDTH;
    canvas_1.height = HEIGHT;
    canvas_2.width = WIDTH;
    canvas_2.height = HEIGHT;
}

/**
 * The double-buffer engine. Will swap visibility between each buffer at time INVERSE_SPEED
 * @param  {Boolean} visible_1 The visibility of buffer 1
 * @param  {Boolean} visible_2 The visibility of buffer 2
 * @param  {Canvas} canvas_1 The first buffer
 * @param  {Canvas} canvas_2 The second buffer
 * @param  {Context} ctx_1 The context of canvas 1
 * @param  {Context} ctx_2 The context of canvas 2
 * @param  {World} world_1 The grid system of world 1
 * @param  {World} world_2 The grid system of world 2
 */
function swapBuffer(visible_1, visible_2, canvas_1, canvas_2, ctx_1, ctx_2, world_1, world_2) {
    // Ensure boolean opposites
    if (visible_1 === visible_2) {
        visible_2 = !visible_1;
    }

    // Draw and show
    if (visible_1) {
        CURRENT_WORLD = world_2;
        NEXT_WORLD = world_1;
        NEXT_CTX = ctx_1;

        prepareNext();

        canvas_1.className = "visible";
        canvas_2.className = "hidden";
    } else {
        CURRENT_WORLD = world_1;
        NEXT_WORLD = world_2;
        NEXT_CTX = ctx_2;

        prepareNext();

        canvas_1.className = "hidden";
        canvas_2.className = "visible";
    }

    // Ready next call
    visible_1 = !visible_1;
    visible_2 = !visible_2;

    window.setTimeout(function() {
        swapBuffer(visible_1, visible_2, canvas_1, canvas_2, ctx_1, ctx_2, world_1, world_2);
    }, INVERSE_SPEED);
}

/**
 * Populate and draw the next step in buffer
 */
function prepareNext() {
    // Clear next 
    NEXT_CTX.clearRect(0, 0, WIDTH, HEIGHT);

    // Populate
    var currentCell;
    var nextCell;

    for (var i = 1; i < WIDTH-1; i++) {
        for (var j = 1; j < HEIGHT-1; j++) {
            currentCell = CURRENT_WORLD[i][j];
            nextCell = NEXT_WORLD[i][j];

            // Process next state
            STATES[ currentCell.state ].processor(currentCell, nextCell);

            // Draw next 
            NEXT_CTX.fillStyle = STATES[nextCell.state].color;
            NEXT_CTX.fillRect(i, j, 1, 1); // putImageData // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
        }
    }
}


//ctx.fillStyle = cell.color;
// ctx.fillRect (i, j, 1, 1);

// TODO BUCK: I NEED A DOUBLE BUFFER WORLD? CELL I,J IS DIFFERERNT THAN CELL.LOCATION.X, Y... WHAT DOES THIS MEAN

// I COULD JUST REINIT UPON PAGE RESIZE - this is probably a good solution