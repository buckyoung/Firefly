/***************************
 * Quick access parameters
 */
Firefly.params = {
    INVERSE_SIZE: 6, // Min 1 Max 10 on frontend
    INVERSE_SPEED: 100, // Min 10 Max 300 on frontend
    CANVAS_1_ID: 'A',
    CANVAS_2_ID: 'B'
};


/***************************
 * Modules
 */
Firefly.modules = {};

/***************************
 * cell module
 */
Firefly.modules.cell = function(FF) {
    // Public Class
    FF.Cell = Cell;

    // Prototypical Methods
    Cell.prototype.mooreNeighbors = mooreNeighbors;
    Cell.prototype.neumannNeighbors = neumannNeighbors;
    Cell.prototype.randomMooreNeighborState = randomMooreNeighborState;
    Cell.prototype.randomNeumannNeighborState = randomNeumannNeighborState;

    /**
     * @public Cell Class Constructor
     * @param {String} initState Initial cell type
     * @param {Integer} x Horizontal location in world
     * @param {Integer} y Vertical location in world
     */
    function Cell(initState, x, y) {
        var state = initState;
        var position = {
            x: x,
            y: y
        };

        // Public Methods
        this.setState = setState;
        this.getState = getState;
        this.getPosition = getPosition;

        /**
         * @public Set cell state
         * @param {String} newState Cell state
         */
        function setState(newState) {
            state = newState;
        }

        /**
         * @public Return cell state
         * @return {String} cell state
         */
        function getState() {
            return state;
        }

        /**
         * @public Return cell position
         * @return {String} cell position
         */
        function getPosition() {
            return {
                x: position.x,
                y: position.y
            };
        }
    }

    /**
     * @public Return count of Moore Neighbors of type targetState
     * @param  {String} targetState Cell type to count
     * @return {Integer} count of Moore Neighbors
     */
    function mooreNeighbors(targetState) {
        var result = 0;
        var x = this.getPosition().x;
        var y = this.getPosition().y;
        var world = Firefly.CURRENT_WORLD;

        if ( world[x  ][y-1].getState() === targetState ) { result++; }
        if ( world[x-1][y  ].getState() === targetState ) { result++; }
        if ( world[x+1][y  ].getState() === targetState ) { result++; }
        if ( world[x  ][y+1].getState() === targetState ) { result++; }

        if ( world[x-1][y-1].getState() === targetState ) { result++; }
        if ( world[x+1][y-1].getState() === targetState ) { result++; }
        if ( world[x-1][y+1].getState() === targetState ) { result++; }
        if ( world[x+1][y+1].getState() === targetState ) { result++; }

        return result;
    }

    /**
     * @public Return count of von Neumann Neighbors of type targetState
     * @param  {String} targetState Cell type to count
     * @return {Integer} count of von Neumann Neighbors
     */
    function neumannNeighbors(targetState) {
        var result = 0;
        var x = this.getPosition().x;
        var y = this.getPosition().y;
        var world = Firefly.CURRENT_WORLD;

        if ( world[x  ][y-1].getState() === targetState ) { result++; }
        if ( world[x-1][y  ].getState() === targetState ) { result++; }
        if ( world[x+1][y  ].getState() === targetState ) { result++; }
        if ( world[x  ][y+1].getState() === targetState ) { result++; }

        return result;
    }

    /**
     * @public Return the state of a random Moore Neighbor
     * @return {String} 
     */
    function randomMooreNeighborState() {
        // Get two values between -1 and 1
        var randoX = (Math.floor(Math.random() * 100) % 3) - 1;
        var randoY = (Math.floor(Math.random() * 100) % 3) - 1;
        var world = Firefly.CURRENT_WORLD;

        var partial = world[randoX];

        if (!partial) {
            return Cell.prototype.randomMooreNeighborState();    
        }

        var cell = world[randoX][randoY];

        // Sanity check if defined
        if (!cell) {
            return Cell.prototype.randomMooreNeighborState();
        }
        
        return cell.getState();    
    }

    /**
     * @public Return the state of a random von Neumann Neighbor
     * @return {String} 
     */
    function randomNeumannNeighborState() {
        // Get two values between -1 and 1
        var randoX = (Math.floor(Math.random() * 100) % 3) - 1;
        var randoY = (Math.floor(Math.random() * 100) % 3) - 1;
        
        // Do not allow diagonals
        if (randoX < 0 && randoY != 0) {
            return Cell.prototype.randomNeumannNeighborState();
        }

        if (randoX > 0 && randoY != 0) {
            return Cell.prototype.randomNeumannNeighborState();
        }

        if (randoY > 0 && randoX != 0) {
            return Cell.prototype.randomNeumannNeighborState();
        }

        if (randoY < 0 && randoX != 0) {
            return Cell.prototype.randomNeumannNeighborState();
        }

        var world = Firefly.CURRENT_WORLD;

        var partial = world[randoX];

        if (!partial) {
            return Cell.prototype.randomNeumannNeighborState();    
        }

        var cell = world[randoX][randoY];

        // Sanity check if defined
        if (!cell) {
            return Cell.prototype.randomNeumannNeighborState();
        }
        
        return cell.getState();    
    }
}

/***************************
 * world module
 */
Firefly.modules.world = function(FF) {
    // Public Variables

    // Public Methods
    FF.initialize = initialize;

    // Private Variables
    var NEXT_WORLD;
    var NEXT_CTX;

    // Protected Variables
    Firefly.CANVAS_HEIGHT;
    Firefly.CANVAS_WIDTH;
    Firefly.CURRENT_WORLD;

    /**
     * Initialize the engine
     * @param {Function} clientInitWorld Enable client to initialize the world 
     */
    function initialize(clientInitWorld) {
        // Prime the engine
        var canvas_1 = document.getElementById(Firefly.params.CANVAS_1_ID);
        var ctx_1 = canvas_1.getContext('2d');

        var canvas_2 = document.getElementById(Firefly.params.CANVAS_2_ID);
        var ctx_2 = canvas_2.getContext('2d');

        Firefly.util.setDimensions(canvas_1, canvas_2);
        // window.addEventListener("resize", setDimensions); -- this would change the size of the world mid game! is that even possible! no way! // Altho we could reinitialize the game upon resize

        // Initialize world
        var world_1 = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        var world_2 = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        
        clientInitWorld(world_1, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        clientInitWorld(world_2, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);

        // Draw first frame
        Firefly.CURRENT_WORLD = world_1;
        NEXT_CTX = ctx_1;
        for (var i = 1; i < Firefly.CANVAS_WIDTH-1; i++) {
            for (var j = 1; j < Firefly.CANVAS_HEIGHT-1; j++) {
                drawStep(Firefly.CURRENT_WORLD[i][j], i, j);
            }
        }

        // Start the engine
        swapBuffer(false, true, canvas_1, canvas_2, ctx_1, ctx_2, world_1, world_2);
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
            Firefly.CURRENT_WORLD = world_2;
            NEXT_WORLD = world_1;
            NEXT_CTX = ctx_1;

            prepareNextStep();

            canvas_1.className = "visible";
            canvas_2.className = "hidden";
        } else {
            Firefly.CURRENT_WORLD = world_1;
            NEXT_WORLD = world_2;
            NEXT_CTX = ctx_2;

            prepareNextStep();

            canvas_1.className = "hidden";
            canvas_2.className = "visible";
        }

        // Ready next call
        visible_1 = !visible_1;
        visible_2 = !visible_2;

        window.setTimeout(function() {
            swapBuffer(visible_1, visible_2, canvas_1, canvas_2, ctx_1, ctx_2, world_1, world_2);
        }, Firefly.params.INVERSE_SPEED);
    }

    /**
     * Populate and draw the next step in buffer
     */
    function prepareNextStep() {
        // Clear next 
        NEXT_CTX.clearRect(0, 0, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);

        // Populate
        var currentCell;
        var nextCell;

        for (var i = 1; i < Firefly.CANVAS_WIDTH-1; i++) {
            for (var j = 1; j < Firefly.CANVAS_HEIGHT-1; j++) {
                currentCell = Firefly.CURRENT_WORLD[i][j];
                nextCell = NEXT_WORLD[i][j];

                // Process next state
                Firefly.getStates()[currentCell.getState()].processor(currentCell, nextCell);

                drawStep(nextCell, i, j);
            }
        }
    }

    /**
     * Draw a step on NEXT_CTX
     */
    function drawStep(cell, x, y) {
        NEXT_CTX.fillStyle = Firefly.getStates()[cell.getState()].color;
        NEXT_CTX.fillRect(x, y, 1, 1); 
    }
};


/***************************
 * state module
 */
Firefly.modules.state = function(FF) {
    // Private Variables
    var states = {};

    // Public Methods
    FF.registerState = registerState;

    // Protected Methods
    Firefly.getStates = getStates;

    /**
     * @public Register a cell type
     * @param {String} name State name
     * @param {Array} color Array in RGB format, example: [255, 0, 128]
     * @param {Function} processor Rules to process every step
     */
    function registerState(name, color, processor) {
        states[name] = {
            color: 'rgb(' + color.toString() + ')',
            processor: processor,
            state: name
        };
    }

    /**
     * @protected Return the states object
     * @return {Object} Internal states object
     */
    function getStates() {
        return states;
    }
};


/***************************
 * model module
 */
Firefly.modules.model = function(FF) {
    // Private Variables
    var models = [];

    // Public Methods
    FF.registerModel = registerModel;

    // Protected Methods
    Firefly.getModels = getModels;
    Firefly.runModel = runModel;

    /**
     * @public Register a model type
     * @param {String} name Model name
     * @param {Function} initializer Function to initialize model
     */
    function registerModel(name, initializer) {
        models.push({
            initializer: initializer,
            name: name
        });
    }

    /**
     * @protected Return the models object
     * @return {Array} Internal models array
     */
    function getModels() {
        return models;
    }

    /**
     * @public Runs the initializer at index in models array
     */
    function runModel(index) {
        models[index].initializer(FF);
    }
};


/***************************
 * drawer module
 */
Firefly.modules.drawer = function(FF) {
    var toggle = document.getElementById('toggle');
    var drawer = document.getElementById('drawer');
    var modelSelect = document.getElementById('model-input');
    var speedValue = document.getElementById('speed-value');
    var speedInput = document.getElementById('speed-input');
    var sizeValue = document.getElementById('size-value');
    var sizeInput = document.getElementById('size-input');

    // Protected Methods
    Firefly.toggleSettings = toggleSettings;
    Firefly.updateSpeed = updateSpeed;
    Firefly.updateSize = updateSize;

    // Initialize
    initialize();

    /**
     * @private Initialize
     */
    function initialize() {
        var speed = Firefly.params.INVERSE_SPEED;
        var size = Firefly.params.INVERSE_SIZE;

        speedValue.innerText = speed;
        sizeValue.innerText = size;

        speedInput.value = speed;
        sizeInput.value = size;

        var timeout = setTimeout(function() {
            if (Firefly.getModels().length) {
                populateModelSelect();
                clearTimeout(timeout); 
            }
        }, 100);

    }

    /**
     * @private Initialize the model selector
     */
    function populateModelSelect() {
        var models = Firefly.getModels();

        models.forEach(function(model, index) {
            var option = document.createElement('option');

            option.appendChild(document.createTextNode(model.name));
            option.value = index;

            modelSelect.appendChild(option);
        });
    }

    /**
     * @protected Show/hide the setting drawer
     */
    function toggleSettings() {
        if (drawer.className === 'hidden') {
            drawer.className = 'visible';
        } else {
            drawer.className = 'hidden';
        }
    }

    /**
     * @protected Set speed in game and on frontend
     */
    function updateSpeed(value) {
        speedValue.innerText = value;
        Firefly.params.INVERSE_SPEED = value;
    }

    /**
     * @protected Set size in game and on frontend
     */
    function updateSize(value) {
        sizeValue.innerText = value;
        // TODO
    }
};


/***************************
 * Client Constructor
 */
function Firefly() {
    // Sandbox Module JS Pattern from Stefanov, clarified here: http://stackoverflow.com/a/16224248
    var args = Array.prototype.slice.call(arguments); 
    var callback = args.pop(); //The last argument is the callback
    var requiredModules = (args[0] && typeof args[0] === "string") ? args : args[0];  //The remaining arguments are the required modules -- support single array or multiple strings

    // Support simplified calling of this sandbox (automatically get modules)
    if (!(this instanceof Firefly) || requiredModules.length === 0) { 
        return new Firefly(['cell', 'state', 'world', 'model', 'drawer'], callback);
    }

    //For each of the modules in 'requiredModules', add the module's methods to 'this'
    for (var i = 0; i < requiredModules.length; i++) {
        Firefly.modules[requiredModules[i]](this);
    }

    callback(this);
}

/***************************
 * Internal utilites
 */
Firefly.util = {
    create2dArray: function (length) {
        var arr = new Array(length || 0)
        var i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = Firefly.util.create2dArray.apply(this, args);
        }

        return arr;
    },
    setDimensions: function(canvas_1, canvas_2) {
        Firefly.CANVAS_WIDTH = Math.floor(window.innerWidth/Firefly.params.INVERSE_SIZE);
        Firefly.CANVAS_HEIGHT = Math.floor(window.innerHeight/Firefly.params.INVERSE_SIZE);
        canvas_1.width = Firefly.CANVAS_WIDTH;
        canvas_1.height = Firefly.CANVAS_HEIGHT;
        canvas_2.width = Firefly.CANVAS_WIDTH;
        canvas_2.height = Firefly.CANVAS_HEIGHT;
    }
};