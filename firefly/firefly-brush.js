/***************************
 * brush module
 */
Firefly.modules.brush = function(FF) {
    // Private Variables
    var cursorBrushElement = document.getElementById('cursor-brush');

    // Public Methods

    // Protected Methods
    Firefly.brush = {};
    Firefly.brush.onMouseMove = onMouseMove;
    Firefly.brush.onMouseUp = onMouseUp;

    function onMouseMove(event) {
        var Yoffset = -5;
        var Xoffset = -5;

        cursorBrushElement.style.top = (event.clientY + Yoffset) + 'px';
        cursorBrushElement.style.left = (event.clientX + Xoffset) + 'px';
    }

    function onMouseUp(event) {
        var translatedX = Math.floor(event.offsetX/Firefly.params.INVERSE_SIZE);
        var translatedY = Math.floor(event.offsetY/Firefly.params.INVERSE_SIZE);
        
        // Allow the model to define what happens on a mouse click
        var currentCell = Firefly.world.getCurrentWorld()[translatedX][translatedY];
        var nextCell = Firefly.world.getNextWorld()[translatedX][translatedY];
        var states = Firefly.state.getRegisteredStates();
        states['onMouseClick'].processor(currentCell, nextCell); // TODO refactor this to implement an arbitrary event registration for the models
    }

    // TODO make mouse click registation system for risk.js
    // allow the user to define what color it initializes to
    // allow the user to cycle thru different states or something by pressing B perhaps 
    //      or do the SHIFT CLICK where they click on a pixel on screen to copy those cells for painting
};