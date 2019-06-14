/***************************
 * history module
 */
Firefly.modules.history = function(FF) {
    // Private Variables
    var HISTORY_WORLD;
    var historyTooltipElement = document.getElementById('history'); // TODO refactor this into its own FF module
    var isFreezeHistoryTooltip = false;

    // Public Methods
    FF.setHistory = setHistory;

    // Protected Methods
    Firefly.history = {};
    Firefly.history.initialize = initialize;
    
    document.addEventListener('onMouseEvent', onMouseEvent, false);

    function initialize() {
        HISTORY_WORLD = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
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
            if (!isFreezeHistoryTooltip && HISTORY_WORLD[translatedX] && HISTORY_WORLD[translatedX][translatedY]) {
                isFreezeHistoryTooltip = true;
                return;
            }

            // Allow the model to define what happens on a mouse click
            var currentCell = CURRENT_WORLD[translatedX][translatedY];
            var nextCell = NEXT_WORLD[translatedX][translatedY];
            var states = Firefly.state.getRegisteredStates();
            states['onMouseClick'].processor(currentCell, nextCell); // TODO refactor this to implement an arbitrary event registration for the models

            return;
        }

        // (event.type == mouseover) event processing:
        if (HISTORY_WORLD[translatedX] && HISTORY_WORLD[translatedX][translatedY]) {
            historyTooltipElement.style.display='block';
            historyTooltipElement.style.position='fixed';
            historyTooltipElement.scrollTop = historyTooltipElement.scrollHeight;

            // Convert history object to a string
            var result = '';
            for (var key in HISTORY_WORLD[translatedX][translatedY]) {
                if (!HISTORY_WORLD[translatedX][translatedY].hasOwnProperty(key)) { continue; } // Short circuit
                result += 'g.' + key + ': ' + HISTORY_WORLD[translatedX][translatedY][key] + '\n';
            }

            historyTooltipElement.innerText = result;
        }
    }

    function setHistory(position, message) {
        var generationCount = GENERATION_COUNT;
        if (!HISTORY_WORLD[position.x][position.y]) {
            HISTORY_WORLD[position.x][position.y] = {};
        }

        HISTORY_WORLD[position.x][position.y][generationCount] = message;

        // TODO *IDEA* show popup information / popup icon when something happens
    }

};