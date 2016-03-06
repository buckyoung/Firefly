/***************************
 * world module
 */
Firefly.modules.world = function(FF) {
    // Public Variables

    // Public Methods
    FF.initialize = initialize;

    // Private Variables
    var CANCEL_TIMEOUT;

    // Protected Variables
    Firefly.CURRENT_WORLD;

    // Listen for escape and enter keys
    document.onkeydown = function(e) {
        // Escape toggles settings
        if (e.keyCode == 27) {
            Firefly.toggleSettings();
        }

        // Enter runs model
        if (e.keyCode == 13) {
            Firefly.resetPlayModel();
            Firefly.toggleSettings('hidden');
        }
    };

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
        for (var i = 0; i < Firefly.CANVAS_WIDTH; i++) {
            for (var j = 0; j < Firefly.CANVAS_HEIGHT; j++) {
                drawStep(ctx_1, world_1[i][j], i, j);
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
            prepareNextStep(world_2, world_1, ctx_1);

            canvas_1.className = "visible";
            canvas_2.className = "hidden";
        } else {
            prepareNextStep(world_1, world_2, ctx_2);

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
     * @param  {World} currentWorld The grid system of the current step
     * @param  {World} nextWorld The grid system of the next step (the buffer)
     * @param  {Ctx} nextCanvas The canvas context to paint to (the buffer)
     */
    function prepareNextStep(currentWorld, nextWorld, nextCtx) {
        // Clear next 
        nextCtx.clearRect(0, 0, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);

        Firefly.CURRENT_WORLD = currentWorld;

        // Populate
        var currentCell;
        var nextCell;
        var states = Firefly.getStates();

        // Begin paint
        var id = nextCtx.getImageData(0, 0, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);

        var data = id.data;

        for (var i = 0; i < Firefly.CANVAS_WIDTH; i++) {
            for (var j = 0; j < Firefly.CANVAS_HEIGHT; j++) {
                currentCell = currentWorld[i][j];
                nextCell = nextWorld[i][j];

                // Process next state
                states[currentCell.getState()].processor(currentCell, nextCell);

                // Draw next state
                drawStep(data, states[nextCell.getState()].color, i, j);
            }
        }

        // End paint
        nextCtx.putImageData(id, 0, 0);
    }

    /**
     * Draw a step on ctx
     * @param  {Ctx} ctx The context to draw on
     * @param  {String} color In rbg(#, #, #) format
     * @param  {Integer} x The x position of the cell
     * @param  {Integer} y The y position of the cell
     */
    function drawStep(data, color, x, y) {
        var index = (x + Firefly.CANVAS_WIDTH * y) * 4;

        data[index++] = color[0];
        data[index++] = color[1];
        data[index++] = color[2];
        data[index] = 255;
    }
};