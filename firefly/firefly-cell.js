/***************************
 * cell module
 */
Firefly.modules.cell = function(FF) {
    // Public Class
    FF.Cell = Cell;

    // Prototypical Methods
    Cell.prototype.countMooreNeighbors = countMooreNeighbors;
    Cell.prototype.countNeumannNeighbors = countNeumannNeighbors;
    Cell.prototype.getSpecificNeighbor = getSpecificNeighbor;

    /**
     * @public Cell Class Constructor
     * @param {String} initState Initial cell type
     * @param {Integer} x Horizontal location in world
     * @param {Integer} y Vertical location in world
     */
    function Cell(initState, x, y) {
        // Public variables
        this.x = x;
        this.y = y;
        this.state = initState;
        this.color = Firefly.getStates()[this.state].color;

        // Public Methods (redundant)
        this.setState = setState;
        this.getState = getState;
        this.getPosition = getPosition;
        this.setColor = setColor;
        this.getColor = getColor;

        /**
         * @public Set cell state
         * @param {String} newState Cell state
         * @param {Boolean} shouldSetColor [optional, default true] set cell color to state color
         */
        function setState(newState, shouldSetColor) {
            if (shouldSetColor === undefined) { shouldSetColor = true; }

            this.state = newState;

            if (shouldSetColor) {
                this.setColor(Firefly.getStates()[this.state].color);
            }
        }

        /**
         * @public Return cell state
         * @return {String} cell state
         */
        function getState() {
            return this.state;
        }

        /**
         * @public Return cell position
         * @return {String} cell position
         */
        function getPosition() {
            return {
                x: this.x,
                y: this.y
            };
        }

        /**
         * @public Set the cell color
         * @param {Array} newColor RGB
         */
        function setColor(newColor) {
            this.color = newColor;
        }

        /**
         * @public Return cell position
         * @return {Array} color RGB
         */
        function getColor() {
            return this.color;
        }
    }

    /**
     * @public Return count of Moore Neighbors of type targetState
     * @param  {String} targetState Cell type to count
     * @return {Integer} count of Moore Neighbors
     * @return {Integer} distance away from center -- NOTE this does not consider all cells in neighborhood
     */
    function countMooreNeighbors(targetState, distance) {
        if (!distance) { distance = 1; }

        var result = 0;
        var x = this.x;
        var y = this.y;
        var world = Firefly.CURRENT_WORLD;

        var xminus = (x-distance < 0) ? Firefly.CANVAS_WIDTH-distance : x-distance;
        var xplus = (x+distance >= Firefly.CANVAS_WIDTH) ? -1+distance : x+distance;

        var yminus = (y-distance < 0) ? Firefly.CANVAS_HEIGHT-distance : y-distance;
        var yplus = (y+distance >= Firefly.CANVAS_HEIGHT) ? -1+distance : y+distance; 

        if ( world[x     ][yminus].state === targetState ) { result++; }
        if ( world[xminus][y     ].state === targetState ) { result++; }
        if ( world[xplus ][y     ].state === targetState ) { result++; }
        if ( world[x     ][yplus ].state === targetState ) { result++; }

        if ( world[xminus][yminus].state === targetState ) { result++; }
        if ( world[xplus ][yminus].state === targetState ) { result++; }
        if ( world[xminus][yplus ].state === targetState ) { result++; }
        if ( world[xplus ][yplus ].state === targetState ) { result++; }

        return result;
    }

    /**
     * @public Return count of von Neumann Neighbors of type targetState
     * @param  {String} targetState Cell type to count
     * @return {Integer} count of von Neumann Neighbors
     * @return {Integer} distance away from center -- NOTE this does not consider all cells in neighborhood
     */
    function countNeumannNeighbors(targetState, distance) {
        if (!distance) { distance = 1; }

        var result = 0;
        var x = this.x;
        var y = this.y;
        var world = Firefly.CURRENT_WORLD;

        var xminus = (x-distance < 0) ? Firefly.CANVAS_WIDTH-distance : x-distance;
        var xplus = (x+distance >= Firefly.CANVAS_WIDTH) ? -1+distance : x+distance;

        var yminus = (y-distance < 0) ? Firefly.CANVAS_HEIGHT-distance : y-distance;
        var yplus = (y+distance >= Firefly.CANVAS_HEIGHT) ? -1+distance : y+distance;

        if ( world[x     ][yminus].state === targetState ) { result++; }
        if ( world[xminus][y     ].state === targetState ) { result++; }
        if ( world[xplus ][y     ].state === targetState ) { result++; }
        if ( world[x     ][yplus ].state === targetState ) { result++; }

        return result;
    }

    /**
     * @public Return specific neighbor cell
     * @param {Integer} targetX X position of target neighbor in relation to self
     * @param {Integer} targetY Y position of target neighbor in relation to self
     * @param {Boolean} wrapX True if world should wrap horizontally (default true)
     * @param {Boolean} wrapY True if world should wrap vertically (default true)
     * @return {Cell | null}
     */
    function getSpecificNeighbor(targetX, targetY, wrapX, wrapY) {
        // Set wrapping defaults
        if (wrapX === undefined) { wrapX = true; }
        if (wrapY === undefined) { wrapY = true; }

        var x = this.x;
        var y = this.y;
        var world = Firefly.CURRENT_WORLD;
        var xval = 0;
        var yval = 0;

        // Calculate with wrapping
        if (wrapX && targetX > 0) {
            xval = (x+targetX >= Firefly.CANVAS_WIDTH) ? -1+targetX : x+targetX;
        } else if (targetX < 0) {
            xval = (x+targetX < 0) ? Firefly.CANVAS_WIDTH+targetX : x+targetX;
        } else {
            xval = x;
        }

        if (wrapY && targetY > 0) {
            yval = (y+targetY >= Firefly.CANVAS_HEIGHT) ? -1+targetY : y+targetY;
        } else if (targetY < 0) {
            yval = (y+targetY < 0) ? Firefly.CANVAS_HEIGHT+targetY : y+targetY;
        } else {
            yval = y;
        }

        // Calculate without wrapping
        if (!wrapX) {
            xval = x+targetX;
        }

        if (!wrapY) {
            yval = y+targetY;
        }

        // Return cell or null
        var partial = world[xval];

        if (!partial) {
            return null;
        }

        var cell = world[xval][yval];

        if (!cell) {
            return null;
        }

        return cell;
    }
}