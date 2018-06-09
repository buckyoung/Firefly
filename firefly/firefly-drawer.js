/***************************
 * drawer module
 */
Firefly.modules.drawer = function(FF) {
    var reset = document.getElementById('reset');
    var drawer = document.getElementById('drawer');
    var modelSelect = document.getElementById('model-input');
    var speedValue = document.getElementById('speed-value');
    var speedInput = document.getElementById('speed-input');
    var sizeValue = document.getElementById('size-value');
    var sizeInput = document.getElementById('size-input');

    // Protected Methods
    Firefly.toggleSettings = toggleSettings;
    Firefly.updateSpeed = updateSpeed;
    Firefly.updateSize = updateSize;
    Firefly.resetPlayModel = resetPlayModel;
    Firefly.showPlayIcon = showPlayIcon;

    // Initialize
    initialize();

    /**
     * @private Initialize
     */
    function initialize() {
        var speed = Firefly.params.INVERSE_SPEED;
        var size = Firefly.params.INVERSE_SIZE;

        speedValue.innerText = speed;
        sizeValue.innerText = size;

        speedInput.value = speed;
        sizeInput.value = size;

        Firefly.showPlayIcon()

        var timeout = setTimeout(function() {
            if (Firefly.getModels().length) {
                populateModelSelect();
                clearTimeout(timeout); 
            }
        }, 250);
    }

    /**
     * @private Initialize the model selector
     */
    function populateModelSelect() {
        var models = Firefly.getModels();

        models.forEach(function(model, index) {
            var option = document.createElement('option');

            option.appendChild(document.createTextNode(model.name));
            option.value = index;

            modelSelect.appendChild(option);
        });
    }

    /**
     * @protected Show/hide the setting drawer
     * @param {Booler} override Force the drawer into one state or another
     */
    function toggleSettings(override) {
        if (override) {
            drawer.className = override;
            return;
        }

        if (drawer.className === 'hidden') {
            drawer.className = 'visible';
        } else {
            drawer.className = 'hidden';
        }
    }

    /**
     * @protected Set speed in game and on frontend
     */
    function updateSpeed(value) {
        speedValue.innerText = value;
        Firefly.params.INVERSE_SPEED = value;
    }

    /**
     * @protected Set size in game and on frontend
     */
    function updateSize(value) {
        sizeValue.innerText = value;
        Firefly.params.INVERSE_SIZE = value;
        Firefly.resetPlayModel();
    }

    /**
     * @protected Reinitialize the model from step 0
     */
    function resetPlayModel() {
        Firefly.runModel(modelSelect.value);
        reset.innerText = '\u27F3';
    }

    /**
     * @protected Shows the play icon
     */
    function showPlayIcon() {
        reset.innerText = '\u25B6';
    }
};