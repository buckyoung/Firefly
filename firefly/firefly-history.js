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
    Firefly.history.onMouseOver = onMouseOver;
    Firefly.history.onMouseOut = onMouseOut;
    Firefly.history.onMouseMove = onMouseMove;
    Firefly.history.onMouseUp = onMouseUp;

    function initialize() {
        HISTORY_WORLD = Firefly.util.create2dArray(Firefly.CANVAS_WIDTH, Firefly.CANVAS_HEIGHT);
    }

    function onMouseOver(event) {
        var translatedX = Math.floor(event.offsetX/Firefly.params.INVERSE_SIZE);
        var translatedY = Math.floor(event.offsetY/Firefly.params.INVERSE_SIZE);

        // Show history tooltip if theres history to be shown
        if (!isFreezeHistoryTooltip && HISTORY_WORLD[translatedX] && HISTORY_WORLD[translatedX][translatedY]) {
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

    function onMouseOut(event) {
        // Hide tooltip when mouse leaves a cell with history
        if (!isFreezeHistoryTooltip) {
            historyTooltipElement.style.display='none';
        }
    }

    function onMouseMove(event) {
        // Move the tooltip w/ the mouse
        if (!isFreezeHistoryTooltip) {
            var Yoffset = event.clientY < window.innerHeight/2 ? 50 : -80;
            var Xoffset = event.clientX < window.innerWidth/2 ? 30 : -350;

            historyTooltipElement.style.top = (event.clientY + Yoffset) + 'px';
            historyTooltipElement.style.left = (event.clientX + Xoffset) + 'px';
        }
    }

    function onMouseUp(event) {
        var translatedX = Math.floor(event.offsetX/Firefly.params.INVERSE_SIZE);
        var translatedY = Math.floor(event.offsetY/Firefly.params.INVERSE_SIZE);

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
    }

    function setHistory(position, message) {
        var generationCount = FF.getGenerationCount();

        if (!HISTORY_WORLD[position.x][position.y]) {
            HISTORY_WORLD[position.x][position.y] = {};
        }

        HISTORY_WORLD[position.x][position.y][generationCount] = message;

        // TODO *IDEA* show popup information / popup icon when something happens
    }

};