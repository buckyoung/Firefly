var FFExamples = FFExamples || {};

FFExamples.goldDiamonds = {};

// Cool world discovered while making flyingFire.js
FFExamples.goldDiamonds.initialize = function(FF) {
    var animationFrameCount = 30;
    var bugProb = 0.00001;

    initializeModel(FF);

    function initializeModel(FF) {
        var emptyR = 0;
        var emptyG = 0;
        var emptyB = 0;

        var bugR = 250;
        var bugG = 218;
        var bugB = 94;

        var R = emptyR;
        var G = emptyG;
        var B = emptyB;

        FF.registerState('empty', [emptyR, emptyG, emptyB], processEmpty);

        var halfFrameCount = parseInt(animationFrameCount/2);

        // colors fading in
        R = emptyR;
        G = emptyG;
        B = emptyB;
        for (var i=0; i < halfFrameCount; i++) {
            R = parseInt(R+(bugR/halfFrameCount)); 
            G = parseInt(G+(bugG/halfFrameCount));
            B = parseInt(B+(bugB/halfFrameCount));

            if (R > bugR) { R = bugR; }
            if (G > bugG) { G = bugG; }
            if (B > bugB) { B = bugB; }

            FF.registerState('' + (i+1), [R, G, B], processBug);
        }
        
        // Colors fading out
        R = bugR;
        G = bugG;
        B = bugB;
        for (var i=halfFrameCount; i < animationFrameCount; i++) {
            R = parseInt(R-(bugR/halfFrameCount)); 
            G = parseInt(G-(bugG/halfFrameCount));
            B = parseInt(B-(bugB/halfFrameCount));

            if (R < emptyR) { R = emptyR; }
            if (G < emptyG) { G = emptyG; }
            if (B < emptyB) { B = emptyB; }

            FF.registerState('' + (i+1), [R, G, B], processBug);
        }

        FF.initialize(initializeWorld(FF));
    }

    function processEmpty(currentCell, nextCell) {
        if (Math.random() <= bugProb) {
            nextCell.setState('1');
            return;
        }

        nextCell.setState('empty');





        var leftState = currentCell.getSpecificNeighbor(-1, 0).getState();
        var rightState = currentCell.getSpecificNeighbor(1, 0).getState();
        var upState = currentCell.getSpecificNeighbor(0, 1).getState();
        var downState = currentCell.getSpecificNeighbor(0, -1).getState();

        // var random = parseInt(Math.random() * (animationFrameCount - 1) + 1); // min = 1, max = animationFrameCount

        if (leftState == parseInt(animationFrameCount/2)) {
            // nextCell.setState(random+'');
            nextCell.setState(leftState)
            return;
        }

        if (rightState == parseInt(animationFrameCount/3)) {
            // nextCell.setState(random+'');
            nextCell.setState(rightState)
            return;
        }

        if (upState == parseInt(animationFrameCount/4)) {
            // nextCell.setState(random+'');
            nextCell.setState(upState)
            return;
        }

        if (downState == parseInt(animationFrameCount/5)) {
            // nextCell.setState(random+'');
            nextCell.setState(downState)
            return;
        }
    }

    function processBug(currentCell, nextCell) {
        var newState = parseInt(currentCell.getState()) + 1;

        if (newState >= animationFrameCount) {
            nextCell.setState('empty');
            return;
        }

        nextCell.setState(newState + '');
    }

    function initializeWorld(FF) {
        return function(world, width, height) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    world[i][j] = new FF.Cell('empty', i, j); 
                }
            }
        };
    }
};