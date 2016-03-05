/***************************
 * model module
 */
Firefly.modules.model = function(FF) {
    // Private Variables
    var models = [];

    // Public Methods
    FF.registerModel = registerModel;

    // Protected Methods
    Firefly.getModels = getModels;
    Firefly.runModel = runModel;

    /**
     * @public Register a model type
     * @param {String} name Model name
     * @param {Function} initializer Function to initialize model
     */
    function registerModel(name, initializer) {
        models.push({
            initializer: initializer,
            name: name
        });
    }

    /**
     * @protected Return the models object
     * @return {Array} Internal models array
     */
    function getModels() {
        return models;
    }

    /**
     * @public Runs the initializer at index in models array
     */
    function runModel(index) {
        models[index].initializer(FF);
    }
};