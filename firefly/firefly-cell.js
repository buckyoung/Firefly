/***************************
 * cell module
 */
Firefly.modules.cell = function(FF) {
    // Public Class
    FF.Cell = Cell;

    // Prototypical Methods
    Cell.prototype.countMooreNeighbors = countMooreNeighbors;
    Cell.prototype.countNeumannNeighbors = countNeumannNeighbors;
    Cell.prototype.getMooreNeighborsTotalisticStates = getMooreNeighborsTotalisticStates;
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
        this.color = Firefly.state.getRegisteredStates()[this.state].color;

        // Public Methods (redundant)
        this.setState = setState;
        this.getState = getState;
        this.setPosition = setPosition;
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
                this.setColor(Firefly.state.getRegisteredStates()[this.state].color);
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
         * @public Sets cells position
         * @param {int} x cell position
         * @param {int} y cell position
         */
        function setPosition(x, y) {
            this.x = x;
            this.y = y;
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
     * @param {Integer} distance away from center -- NOTE this does not consider all cells in neighborhood, only X distance to the North, South, East, West, NorthEast, NorthWest, SouthEast, and SouthWest
     * @return {Integer} count of Moore Neighbors
     */
    function countMooreNeighbors(targetState, distance) {
        if (!distance) { distance = 1; }

        var result = 0;
        var x = this.x;
        var y = this.y;
        var world = Firefly.world.getCurrentWorld();

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
     * @param {Integer} distance away from center -- NOTE this does not consider all cells in neighborhood, only X distance to the North, South, East, West, NorthEast, NorthWest, SouthEast, and SouthWest
     * @return {Integer} count of Moore Neighbors
     */
    function countNeumannNeighbors(targetState, distance) {
        if (!distance) { distance = 1; }

        var result = 0;
        var x = this.x;
        var y = this.y;
        var world = Firefly.world.getCurrentWorld();

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
     * @public Returns an object with the total count of Moore neighbors for each state around self
     * @return {Object} Total count of each state of Moore neighbors
     *                        Example Return Value: { "stateA": 2, "empty": 5, "stateB": 1 }
     */
    function getMooreNeighborsTotalisticStates() {
        var result = {};
        var x = this.x;
        var y = this.y;
        var world = Firefly.world.getCurrentWorld();
        var state = null;

        var xminus = (x-1 < 0) ? Firefly.CANVAS_WIDTH-1 : x-1;
        var xplus = (x+1 >= Firefly.CANVAS_WIDTH) ? 0 : x+1;

        var yminus = (y-1 < 0) ? Firefly.CANVAS_HEIGHT-1 : y-1;
        var yplus = (y+1 >= Firefly.CANVAS_HEIGHT) ? 0 : y+1;
        
        state = world[x     ][yminus].state;
        if (result.hasOwnProperty(state)) {
            result[state] += 1;
        } else {
            result[state] = 1;
        }

        state = world[xminus][y     ].state;
        if (result.hasOwnProperty(state)) {
            result[state] += 1;
        } else {
            result[state] = 1;
        }

        state = world[xplus ][y     ].state;
        if (result.hasOwnProperty(state)) {
            result[state] += 1;
        } else {
            result[state] = 1;
        }

        state = world[x     ][yplus ].state;
        if (result.hasOwnProperty(state)) {
            result[state] += 1;
        } else {
            result[state] = 1;
        }

        //
        state = world[xminus][yminus].state;
        if (result.hasOwnProperty(state)) {
            result[state] += 1;
        } else {
            result[state] = 1;
        }

        state = world[xplus ][yminus].state;
        if (result.hasOwnProperty(state)) {
            result[state] += 1;
        } else {
            result[state] = 1;
        }

        state = world[xminus][yplus ].state;
        if (result.hasOwnProperty(state)) {
            result[state] += 1;
        } else {
            result[state] = 1;
        }

        state = world[xplus ][yplus ].state;
        if (result.hasOwnProperty(state)) {
            result[state] += 1;
        } else {
            result[state] = 1;
        }

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
        var world = Firefly.world.getCurrentWorld();
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