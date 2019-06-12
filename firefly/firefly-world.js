/***************************
 * world module
 */
Firefly.modules.world = function(FF) {
    // Public Variables
    FF.getGenerationCount = getGenerationCount;

    // Public Methods
    FF.initialize = initialize;
    FF.setHistory = setHistory;
    FF.stateCounts = {}; // Cached from the frame previous (to save compute)
    // TODO - implement a getStateCounts function & return 0 if undefined!

    // Private Variables
    var CANCEL_TIMEOUT;
    var HISTORY;
    var historyTooltipElement = document.getElementById('history');
    var isFreezeHistoryTooltip = false;

    // Protected Variables
    Firefly.CURRENT_WORLD;
    Firefly.NEXT_WORLD;
    Firefly.GENERATION_COUNT;

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

        canvas_1.addEventListener('mouseover', onMouseEvent, false);
        canvas_2.addEventListener('mouseover', onMouseEvent, false);
        canvas_1.addEventListener('mouseout', onMouseEvent, false);
        canvas_2.addEventListener('mouseout', onMouseEvent, false);
        canvas_1.addEventListener('mousemove', onMouseEvent, false);
        canvas_2.addEventListener('mousemove', onMouseEvent, false);
        canvas_1.addEventListener('mouseup', onMouseEvent, false);
        canvas_2.addEventListener('mouseup', onMouseEvent, false);

        Firefly.util.setDimensions(canvas_1, canvas_2);

        // Initialize world
        var world_1 = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        var world_2 = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        HISTORY = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        
        clientInitWorld(world_1, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
        clientInitWorld(world_2, Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);

        // Draw first frame
        Firefly.CURRENT_WORLD = world_1;
        var id = beginPaint(ctx_1);
        for (var i = 0; i < Firefly.CANVAS_WIDTH; i++) {
            for (var j = 0; j < Firefly.CANVAS_HEIGHT; j++) {
                drawStep(id.data, world_1[i][j].getColor(), i, j);
            }
        }
        endPaint(ctx_1, id);

        Firefly.GENERATION_COUNT = 0;

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
        Firefly.GENERATION_COUNT++;
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
        Firefly.NEXT_WORLD = nextWorld;

        // Populate
        var currentCell;
        var nextCell;
        var states = Firefly.getStates();
        var tempStateCounts = {};

        // Begin paint
        var id = beginPaint(nextCtx);

        for (var i = 0; i < Firefly.CANVAS_WIDTH; i++) {
            for (var j = 0; j < Firefly.CANVAS_HEIGHT; j++) {
                currentCell = currentWorld[i][j];
                nextCell = nextWorld[i][j];

                // Count the state
                tempStateCounts[currentCell.state] = tempStateCounts[currentCell.state] ? tempStateCounts[currentCell.state] + 1 : 1;

                // Process next state
                states[currentCell.state].processor(currentCell, nextCell);

                // Draw next state
                drawStep(id.data, nextCell.getColor(), i, j);
            }
        }

        FF.stateCounts = tempStateCounts;

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

    function getGenerationCount() {
        return Firefly.GENERATION_COUNT;
    }

    function onMouseEvent(event) {
        // Hide tooltip when mouse leaves a cell with history
        if (event.type == 'mouseout' && !isFreezeHistoryTooltip) {
            historyTooltipElement.style.display='none';
            return;
        }

        // Move the tooltip w/ the mouse
        if (event.type == 'mousemove' && !isFreezeHistoryTooltip) {
            var Yoffset = event.clientY < window.innerHeight/2 ? 50 : -80;
            var Xoffset = event.clientX < window.innerWidth/2 ? 30 : -350;

            historyTooltipElement.style.top = (event.clientY + Yoffset) + 'px';
            historyTooltipElement.style.left = (event.clientX + Xoffset) + 'px';
            return;
        }

        var translatedX = Math.floor(event.offsetX/Firefly.params.INVERSE_SIZE);
        var translatedY = Math.floor(event.offsetY/Firefly.params.INVERSE_SIZE);

        if (event.type == 'mouseup') {
            // Unfreeze & hide tooltip with a click to anywhere on the canvas
            if (isFreezeHistoryTooltip) {
                isFreezeHistoryTooltip = false;
                historyTooltipElement.style.display='none';
                return;
            }

            // Only freeze if clicking on a cell with history (allows the user to scroll a long tooltip)
            if (!isFreezeHistoryTooltip && HISTORY[translatedX] && HISTORY[translatedX][translatedY]) {
                isFreezeHistoryTooltip = true;
                return;
            }

            // Allow the model to define what happens on a mouse click
            var currentCell = Firefly.CURRENT_WORLD[translatedX][translatedY];
            var nextCell = Firefly.NEXT_WORLD[translatedX][translatedY];
            var states = Firefly.getStates();
            states['onMouseClick'].processor(currentCell, nextCell);

            return;
        }

        // (event.type == mouseover) event processing:
        if (HISTORY[translatedX] && HISTORY[translatedX][translatedY]) {
            historyTooltipElement.style.display='block';
            historyTooltipElement.style.position='fixed';
            historyTooltipElement.scrollTop = historyTooltipElement.scrollHeight;

            // Convert history object to a string
            var result = '';
            for (var key in HISTORY[translatedX][translatedY]) {
                if (HISTORY[translatedX][translatedY].hasOwnProperty(key)) {
                    result += 'g.' + key + ': ' + HISTORY[translatedX][translatedY][key] + '\n';
                }
            }

            historyTooltipElement.innerText = result;
        }
    }

    function setHistory(position, message) {
        var generationCount = Firefly.GENERATION_COUNT;
        if (!HISTORY[position.x][position.y]) {
            HISTORY[position.x][position.y] = {};
        }

        HISTORY[position.x][position.y][generationCount] = message;

        // TODO show popup information when something happens
    }
};