/***************************
 * world module
 */
Firefly.modules.world = function(FF) {
    // Public Variables

    // Public Methods
    FF.initialize = initialize;
    FF.getGenerationCount = getGenerationCount;
    FF.getStateCount = getStateCount;

    // Private Variables
    var CANCEL_TIMEOUT;
    var GENERATION_COUNT;
    var CURRENT_WORLD;
    var NEXT_WORLD;
    var stateCounts = {}; // Cached from the frame previous (to save compute)

    // Protected Methods
    Firefly.world = {};
    Firefly.world.getCurrentWorld = getCurrentWorld;
    Firefly.world.getNextWorld = getNextWorld;

    /**
     * Initialize the engine
     * @param {Function} clientInitWorld Enable client to initialize the world 
     */
    function initialize(clientInitWorld) {
        // Stop any previous models
        clearTimeout(CANCEL_TIMEOUT);

        // Listen for resize
        window.onresize = Firefly.drawer.resetPlayModel;

        // Prime the engine
        var canvas_1 = document.getElementById(Firefly.params.CANVAS_1_ID);
        var ctx_1 = canvas_1.getContext('2d');

        var canvas_2 = document.getElementById(Firefly.params.CANVAS_2_ID);
        var ctx_2 = canvas_2.getContext('2d');

        canvas_1.addEventListener('mouseover', Firefly.history.onMouseOver, false);
        canvas_2.addEventListener('mouseover', Firefly.history.onMouseOver, false);
        canvas_1.addEventListener('mouseout', Firefly.history.onMouseOut, false);
        canvas_2.addEventListener('mouseout', Firefly.history.onMouseOut, false);
        canvas_1.addEventListener('mousemove', Firefly.history.onMouseMove, false);
        canvas_2.addEventListener('mousemove', Firefly.history.onMouseMove, false);
        canvas_1.addEventListener('mouseup', Firefly.history.onMouseUp, false);
        canvas_2.addEventListener('mouseup', Firefly.history.onMouseUp, false);

        canvas_1.addEventListener('mousemove', Firefly.brush.onMouseMove, false);
        canvas_2.addEventListener('mousemove', Firefly.brush.onMouseMove, false);
        canvas_1.addEventListener('mouseup', Firefly.brush.onMouseUp, false);
        canvas_2.addEventListener('mouseup', Firefly.brush.onMouseUp, false);

        // Initialize world
        canvas_1.width = Firefly.CANVAS_WIDTH;
        canvas_1.height = Firefly.CANVAS_HEIGHT;
        canvas_2.width = Firefly.CANVAS_WIDTH;
        canvas_2.height = Firefly.CANVAS_HEIGHT;
        var world_1 = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        var world_2 = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        
        clientInitWorld(world_1, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        clientInitWorld(world_2, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);

        // Draw first frame
        CURRENT_WORLD = world_1;
        var id = beginPaint(ctx_1);
        for (var i = 0; i < Firefly.CANVAS_WIDTH; i++) {
            for (var j = 0; j < Firefly.CANVAS_HEIGHT; j++) {
                drawStep(id.data, world_1[i][j].getColor(), i, j);
            }
        }
        endPaint(ctx_1, id);

        GENERATION_COUNT = 0;

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
        GENERATION_COUNT++;
        Firefly.drawer.updateCounter();

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

        if (Firefly.camera.shouldPanCamera()) {
            Firefly.camera.panCameraForWorlds(world_1, world_2);
        }

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

        CURRENT_WORLD = currentWorld;
        NEXT_WORLD = nextWorld;

        // Populate
        var currentCell;
        var nextCell;
        var states = Firefly.state.getRegisteredStates();
        var tempStateCounts = {};

        // Begin paint
        var id = beginPaint(nextCtx);

        for (var i = 0; i < Firefly.CANVAS_WIDTH; i++) {
            for (var j = 0; j < Firefly.CANVAS_HEIGHT; j++) {
                currentCell = currentWorld[i][j];
                nextCell = nextWorld[i][j];

                // Count the state
                tempStateCounts[currentCell.state] = tempStateCounts[currentCell.state] ? tempStateCounts[currentCell.state] + 1 : 1;

                // Re-set cell position (needs to be done when camera moves)
                currentCell.setPosition(i, j);
                nextCell.setPosition(i, j);

                // Process next state
                states[currentCell.state].processor(currentCell, nextCell);

                // Draw next state
                drawStep(id.data, nextCell.getColor(), i, j);
            }
        }

        stateCounts = tempStateCounts;
        Firefly.reporting.onUpdate();

        // End paint
        endPaint(nextCtx, id);
    }

    /**
     * Get the image data object -- 'open' it for drawing
     * @param  {Ctx} ctx The context to draw on
     * @return {ImageData}
     */
    function beginPaint(ctx) {
        return ctx.getImageData(0, 0, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
    }

    /**
     * Draw the image -- 'close' it for drawing
     * @param  {Ctx} ctx The context to draw on
     * @param  {ImageData} imageData The image we are drawing
     */
    function endPaint(ctx, imageData) {
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * Draw a step on ctx
     * @param  {Ctx} ctx The context to draw on
     * @param  {Array} color In rbg(#, #, #) format
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

    function getGenerationCount() { // TODO maybe reporting module should handle generation counts?
        return GENERATION_COUNT;
    }

    function getCurrentWorld() {
        return CURRENT_WORLD;
    }

    function getNextWorld() {
        return NEXT_WORLD;
    }

    function getStateCount(state) { // TODO maybe reporting module should handle state counts?
        if (!stateCounts.hasOwnProperty(state)) { return 0; }

        return stateCounts[state];
    }
};