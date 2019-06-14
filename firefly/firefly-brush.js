/***************************
 * brush module
 */
Firefly.modules.brush = function(FF) {
    // Private Variables
    var cursorBrushElement = document.getElementById('cursor-brush');

    // Public Methods

    // Protected Methods
    Firefly.brush = {};
    Firefly.brush.initialize = initialize;
    Firefly.brush.onMouseMove = onMouseMove;
    Firefly.brush.onMouseUp = onMouseUp;

    document.addEventListener('keydown', onKeyDown, false);

    function initialize(event) {
        cursorBrushElement.style.display='none'; // hide by default since most models dont use it
    }

    /** Listen for keys */
    function onKeyDown(e) {
        if (e.keyCode == 66) { // "B"
            cursorBrushElement.style.display = cursorBrushElement.style.display == 'none' ? '' : 'none';
        }
    }

    function onMouseMove(event) {
        var Yoffset = -5;
        var Xoffset = -5;

        cursorBrushElement.style.top = (event.clientY + Yoffset) + 'px';
        cursorBrushElement.style.left = (event.clientX + Xoffset) + 'px';
    }

    function onMouseUp(event) {
        if (cursorBrushElement.style.display == 'none') { return; } // Short circuit

        var translatedX = Math.floor(event.offsetX/Firefly.params.INVERSE_SIZE);
        var translatedY = Math.floor(event.offsetY/Firefly.params.INVERSE_SIZE);

        // Allow the model to define what happens on a mouse click
        var currentCell = Firefly.world.getCurrentWorld()[translatedX][translatedY];
        var nextCell = Firefly.world.getNextWorld()[translatedX][translatedY];
        var states = Firefly.state.getRegisteredStates();
        
        if (states.hasOwnProperty('onMouseClick')) {
            states['onMouseClick'].processor(currentCell, nextCell); // TODO refactor this to implement an arbitrary event registration for the models
        }
    }

    // TODO make mouse click registation system for risk.js
    // allow the user to define what color it initializes to
    // allow the user to cycle thru different states or something by pressing B perhaps 
    //      or do the SHIFT CLICK where they click on a pixel on screen to copy those cells for painting
};