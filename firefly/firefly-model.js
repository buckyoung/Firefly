/***************************
 * model module
 */
Firefly.modules.model = function(FF) {
    // Private Variables
    var models = [];

    // Public Methods
    FF.registerModel = registerModel;

    // Protected Methods
    Firefly.model = {};
    Firefly.model.getRegisteredModels = getRegisteredModels;
    Firefly.model.runModel = runModel;

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
    function getRegisteredModels() {
        return models;
    }

    /**
     * @public Runs the initializer at index in models array
     */
    function runModel(index) {
        Firefly.reinitializeModules();
        models[index].initializer(FF);
    }
};