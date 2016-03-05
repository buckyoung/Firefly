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
    var CANCEL_TIMEOUT;

    // Protected Variables
    Firefly.CANVAS_HEIGHT;
    Firefly.CANVAS_WIDTH;
    Firefly.CURRENT_WORLD;

    /**
     * Initialize the engine
     * @param {Function} clientInitWorld Enable client to initialize the world 
     */
    function initialize(clientInitWorld) {
        // Stop any previous models
        clearTimeout(CANCEL_TIMEOUT);

        // Listen for resize
        window.onresize = Firefly.resetPlayModel;

        // Prime the engine
        var canvas_1 = document.getElementById(Firefly.params.CANVAS_1_ID);
        var ctx_1 = canvas_1.getContext('2d');

        var canvas_2 = document.getElementById(Firefly.params.CANVAS_2_ID);
        var ctx_2 = canvas_2.getContext('2d');

        Firefly.util.setDimensions(canvas_1, canvas_2);

        // Initialize world
        var world_1 = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        var world_2 = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        
        clientInitWorld(world_1, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        clientInitWorld(world_2, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);

        // Draw first frame
        Firefly.CURRENT_WORLD = world_1;
        NEXT_CTX = ctx_1;
        for (var i = 0; i < Firefly.CANVAS_WIDTH; i++) {
            for (var j = 0; j < Firefly.CANVAS_HEIGHT; j++) {
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

        CANCEL_TIMEOUT = window.setTimeout(function() {
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

        for (var i = 0; i < Firefly.CANVAS_WIDTH; i++) {
            for (var j = 0; j < Firefly.CANVAS_HEIGHT; j++) {
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