/***************************
 * cell module
 */
Firefly.modules.cell = function(FF) {
    // Public Class
    FF.Cell = Cell;

    // Prototypical Methods
    Cell.prototype.mooreNeighbors = mooreNeighbors;
    Cell.prototype.neumannNeighbors = neumannNeighbors;

    /**
     * @public Cell Class Constructor
     * @param {String} initState Initial cell type
     * @param {Integer} x Horizontal location in world
     * @param {Integer} y Vertical location in world
     */
    function Cell(initState, x, y) {
        var state = initState;
        var position = {
            x: x,
            y: y
        };

        // Public Methods
        this.setState = setState;
        this.getState = getState;
        this.getPosition = getPosition;

        /**
         * @public Set cell state
         * @param {String} newState Cell state
         */
        function setState(newState) {
            state = newState;
        }

        /**
         * @public Return cell state
         * @return {String} cell state
         */
        function getState() {
            return state;
        }

        /**
         * @public Return cell position
         * @return {String} cell position
         */
        function getPosition() {
            return {
                x: position.x,
                y: position.y
            };
        }
    }

    /**
     * @public Return count of Moore Neighbors of type targetState
     * @param  {String} targetState Cell type to count
     * @return {Integer} count of Moore Neighbors
     * @return {Integer} distance away from center -- NOTE this does not consider all cells in neighborhood
     */
    function mooreNeighbors(targetState, distance) {
        if (!distance) { distance = 1; }

        var result = 0;
        var pos = this.getPosition();
        var x = pos.x;
        var y = pos.y;
        var world = Firefly.CURRENT_WORLD;

        var xminus = (x-distance < 0) ? Firefly.CANVAS_WIDTH-distance : x-distance;
        var xplus = (x+distance >= Firefly.CANVAS_WIDTH) ? -1+distance : x+distance;

        var yminus = (y-distance < 0) ? Firefly.CANVAS_HEIGHT-distance : y-distance;
        var yplus = (y+distance >= Firefly.CANVAS_HEIGHT) ? -1+distance : y+distance; 

        if ( world[x     ][yminus].getState() === targetState ) { result++; }
        if ( world[xminus][y     ].getState() === targetState ) { result++; }
        if ( world[xplus ][y     ].getState() === targetState ) { result++; }
        if ( world[x     ][yplus ].getState() === targetState ) { result++; }

        if ( world[xminus][yminus].getState() === targetState ) { result++; }
        if ( world[xplus ][yminus].getState() === targetState ) { result++; }
        if ( world[xminus][yplus ].getState() === targetState ) { result++; }
        if ( world[xplus ][yplus ].getState() === targetState ) { result++; }

        return result;
    }

    /**
     * @public Return count of von Neumann Neighbors of type targetState
     * @param  {String} targetState Cell type to count
     * @return {Integer} count of von Neumann Neighbors
     * @return {Integer} distance away from center -- NOTE this does not consider all cells in neighborhood
     */
    function neumannNeighbors(targetState, distance) {
        if (!distance) { distance = 1; }

        var result = 0;
        var pos = this.getPosition();
        var x = pos.x;
        var y = pos.y;
        var world = Firefly.CURRENT_WORLD;

        var xminus = (x-distance < 0) ? Firefly.CANVAS_WIDTH-distance : x-distance;
        var xplus = (x+distance >= Firefly.CANVAS_WIDTH) ? -1+distance : x+distance;

        var yminus = (y-distance < 0) ? Firefly.CANVAS_HEIGHT-distance : y-distance;
        var yplus = (y+distance >= Firefly.CANVAS_HEIGHT) ? -1+distance : y+distance;

        if ( world[x     ][yminus].getState() === targetState ) { result++; }
        if ( world[xminus][y     ].getState() === targetState ) { result++; }
        if ( world[xplus ][y     ].getState() === targetState ) { result++; }
        if ( world[x     ][yplus ].getState() === targetState ) { result++; }

        return result;
    }
}