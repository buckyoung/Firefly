/***************************
 * camera module
 */
Firefly.modules.camera = function(FF) {
    // Private Variables
    var shouldPan = false;
    var leftRightOffset = 0;
    var upDownOffset = 0;

    // Public Methods

    // Protected Methods
    Firefly.camera = {};
    Firefly.camera.initialize = initialize;
    Firefly.camera.panCameraForWorlds = panCameraForWorlds;
    Firefly.camera.shouldPanCamera = shouldPanCamera;

    document.addEventListener('keydown', onKeyDown, false);

    function initialize() {
        leftRightOffset = 0;
        upDownOffset = 0;
        shouldPanCamera = false;
    }

    function shouldPanCamera() {
        return shouldPan;
    }

    /** Listen for keys */
    function onKeyDown(e) {
        if (e.keyCode == 37) { // left
            leftRightOffset++;
            shouldPan = true;
        }

        if (e.keyCode == 39) { // right
            leftRightOffset--;
            shouldPan = true;
        }

        if (e.keyCode == 38) { // up
            upDownOffset--;
            shouldPan = true;
        }

        if (e.keyCode == 40) { // down
            upDownOffset++;
            shouldPan = true;
        }
    }

    /**
     *     +x |  Pan camera down
     *     -x |  Pan camera up
     *     +y |  Pan camera left
     *     -y |  Pan camera right
     */
    function panCameraForWorlds(world1, world2) {
        var y = leftRightOffset;
        var x = upDownOffset;

        // Shift and wrap - pan camera down
        while (x > 0) {
            world1.forEach(function (a) {
                a.push(a.shift());
            });
            world2.forEach(function (a) {
                a.push(a.shift());
            });
            x--;
        }
        
        // Shift and wrap - pan camera up
        while (x < 0) {
            world1.forEach(function (a) {
                a.unshift(a.pop());
            });
            world2.forEach(function (a) {
                a.unshift(a.pop());
            });
            x++;
        }

        // Shift and wrap - pan camera left
        while (y > 0) {
            world1.unshift(world1.pop().map(function (a) { return a; }));
            world2.unshift(world2.pop().map(function (a) { return a; }));
            y--;
        }
        
        // Shift and wrap - pan camera right
        while (y < 0) {
            world1.push(world1.shift().map(function (a) { return a; }));
            world2.push(world2.shift().map(function (a) { return a; }));
            y++;
        }

        // Reset state
        shouldPan = false;
        leftRightOffset = 0;
        upDownOffset = 0;
    }
};