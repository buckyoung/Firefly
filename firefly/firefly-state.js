/***************************
 * state module
 */
Firefly.modules.state = function(FF) {
    // Private Variables
    var states = {};

    // Public Methods
    FF.registerState = registerState;

    // Protected Methods
    Firefly.getStates = getStates;

    /**
     * @public Register a cell type
     * @param {String} name State name
     * @param {Array} color Array in RGB format, example: [255, 0, 128]
     * @param {Function} processor Rules to process every step
     */
    function registerState(name, color, processor) {
        states[name] = {
            color: color,
            processor: processor,
            state: name
        };
    }

    /**
     * @protected Return the states object
     * @return {Object} Internal states object
     */
    function getStates() {
        return states;
    }
};