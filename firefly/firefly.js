Firefly.modules = {};

/***************************
 * Reinitialize all Modules
 *     - Call out to init all modules attached to Firefly that have initializers attached to their module object
 */
Firefly.reinitializeModules = function() {
    for (var module in Firefly) {
        if (!Firefly.hasOwnProperty(module)) { continue; } // Short circuit
        if (!Firefly[module].hasOwnProperty('initialize')) { continue; } // Short circuit
        Firefly[module].initialize();
    }
}

/***************************
 * Quick access parameters
 */
Firefly.params = {
    INVERSE_SIZE: 3, // Min 1 Max 10 on frontend
    INVERSE_SPEED: 100, // Min 10 Max 300 on frontend
    CANVAS_1_ID: 'A',
    CANVAS_2_ID: 'B'
};

/***************************
 * Client Constructor
 */
function Firefly() {
    // Sandbox Module JS Pattern from Stefanov, clarified here: http://stackoverflow.com/a/16224248
    var args = Array.prototype.slice.call(arguments); 
    var callback = args.pop(); //The last argument is the callback
    var requiredModules = (args[0] && typeof args[0] === "string") ? args : args[0];  //The remaining arguments are the required modules -- support single array or multiple strings

    // Support simplified calling of this sandbox (automatically get modules)
    if (!(this instanceof Firefly) || requiredModules.length === 0) { 
        return new Firefly([
            'camera',
            'cell',
            'drawer',
            'history',
            'model',
            'reporting',
            'state',
            'world'
        ], callback);
    }

    //For each of the modules in 'requiredModules', add the module's methods to 'this'
    for (var i = 0; i < requiredModules.length; i++) {
        Firefly.modules[requiredModules[i]](this);
    }

    callback(this);
}

/***************************
 * Internal utilites
 */
Firefly.util = {
    create2dArray: function (length) {
        var arr = new Array(length || 0)
        var i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = Firefly.util.create2dArray.apply(this, args);
        }

        return arr;
    },
    setDimensions: function(canvas_1, canvas_2) {
        Firefly.CANVAS_WIDTH = Math.floor(window.innerWidth/Firefly.params.INVERSE_SIZE);
        Firefly.CANVAS_HEIGHT = Math.floor(window.innerHeight/Firefly.params.INVERSE_SIZE);
        canvas_1.width = Firefly.CANVAS_WIDTH;
        canvas_1.height = Firefly.CANVAS_HEIGHT;
        canvas_2.width = Firefly.CANVAS_WIDTH;
        canvas_2.height = Firefly.CANVAS_HEIGHT;
    }
};