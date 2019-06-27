/***************************
 * drawer module
 */
Firefly.modules.drawer = function(FF) {
    var reset = document.getElementById('reset');
    var counter = document.getElementById('counter');
    var drawer = document.getElementById('drawer');
    var modelSelect = document.getElementById('model-input');
    //var speedValue = document.getElementById('speed-value');
    var speedInput = document.getElementById('speed-input');
    //var sizeValue = document.getElementById('size-value');
    var sizeInput = document.getElementById('size-input');

    // Protected Methods
    Firefly.drawer = {};
    Firefly.drawer.toggleSettings = toggleSettings;
    Firefly.drawer.updateSpeed = updateSpeed;
    Firefly.drawer.updateSize = updateSize;
    Firefly.drawer.resetPlayModel = resetPlayModel;
    Firefly.drawer.showPlayIcon = showPlayIcon;
    Firefly.drawer.updateCounter = updateCounter;

    document.addEventListener('keydown', onKeyDown, false);

    // Initialize
    // -- this shouldnt be a "module" initializer, but rather a one-time initialization
    initialize();

    /**
     * @private Initialize
     */
    function initialize() {
        var urlParams = new URLSearchParams(window.location.search);
        var speed = urlParams.get('speed') || Firefly.params.INVERSE_SPEED;
        var size = urlParams.get('size') || Firefly.params.INVERSE_SIZE;

        updateSpeed(speed);
        updateSize(size);

        Firefly.drawer.showPlayIcon()

        var timeout = setTimeout(function() {
            if (Firefly.model.getRegisteredModels().length) {
                populateModelSelect();
                clearTimeout(timeout);
            }
        }, 250);
    }

    /** Listen for keys */
    function onKeyDown(e) {
        // Escape toggles settings
        if (e.keyCode == 27) {
            Firefly.drawer.toggleSettings();
        }

        // Enter runs model
        if (e.keyCode == 13) {
            Firefly.drawer.resetPlayModel();
            Firefly.drawer.toggleSettings('hidden');
        }

        // numbers 1-9,0 sets the size (note: 0 is keyCode 48)
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            var keyCodeToSizeMap = {49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9,48:10};
            Firefly.drawer.updateSize(keyCodeToSizeMap[e.keyCode]);
        }

        // minus || plus keys
        if (e.keyCode == 189 || e.keyCode == 187) {
            var offsetAmount = 10;

            if (e.shiftKey) {
                offsetAmount = 300;
            }

            // determine if minus or plus was pressed & set offset accordingly
            offsetAmount = e.keyCode == 189 ? offsetAmount * -1 : offsetAmount;

            Firefly.drawer.updateSpeed(Firefly.params.INVERSE_SPEED + offsetAmount);
        }
    };

    /**
     * @private Initialize the model selector
     */
    function populateModelSelect() {
        var models = Firefly.model.getRegisteredModels();

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

        // Toggle Open Modifier
        drawer.classList.toggle('is-open');

        // if (drawer.className === 'is-hidden') {
        //     drawer.className = 'is-open';
        // } else {
        //     drawer.className = 'is-hidden';
        // }
    }

    /**
     * @protected Set speed in game and on frontend
     */
    function updateSpeed(value) {
        value = parseInt(value);

        if (value < 10) {
            value = 10;
        } else if (value > 300) {
            value = 300;
        }

        //speedValue.innerText = value;
        speedInput.value = value;
        Firefly.params.INVERSE_SPEED = value;
    }

    /**
     * @protected Set size in game and on frontend
     */
    function updateSize(value) {
        value = parseInt(value);

        if (value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }

        //sizeValue.innerText = value;
        sizeInput.value = value;
        Firefly.params.INVERSE_SIZE = value;
        Firefly.drawer.showPlayIcon();
        // Firefly.drawer.resetPlayModel(); // Decided to show play icon instead
    }

    /**
     * @protected Reinitialize the model from step 0
     */
    function resetPlayModel() {
        Firefly.model.runModel(modelSelect.value);
        //reset.innerText = '\u27F3';
    }

    /**
     * @protected Shows the play icon
     */
    function showPlayIcon() {
        //reset.innerText = '\u25B6';
    }

    /**
     * @protected Update the generation counter
     */
    function updateCounter() {
        if (counter) {
            counter.value = FF.getGenerationCount();
        }
    }
};
