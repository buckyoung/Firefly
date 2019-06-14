/***************************
 * state module
 */
Firefly.modules.state = function(FF) {
    // Private Variables
    var states = {};

    // Public Methods
    FF.registerState = registerState;

    // Protected Methods
    Firefly.state = {};
    Firefly.state.getRegisteredStates = getRegisteredStates;
    Firefly.state.getStateHexColor = getStateHexColor;
    Firefly.state.initialize = initialize;

    function initialize() {
        states = {};
    }

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
    function getRegisteredStates() {
        return states;
    }

    function getStateHexColor(state) {
        var result = '#';

        states[state].color.forEach(function(part) {
            var hex = part.toString(16);
            hex = hex.length == 1 ? "0" + hex : hex;
            result += hex;
        });

        return result;
    }
};