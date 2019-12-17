var FFExamples = FFExamples || {};

FFExamples.flyingFireV2 = {};

// TODO - have black things flying around and have them light up occassionally? (instead of the bug only coming to life when it lights up)
// TODO - maybe you need to define movement patterns for each state from 1->animationFrameCount -- then we would know exactly when to delete the exited-cell
//          - thinking maybe like 1-3 = move left... 4-8 = move up ... 9-10 = move down, etc... then i can also re-roll this every so often perhaps? might need a callback in between frames to make this work tho!
//          
//          
// IDEA Would be amazing if the flies could randomly move about & if they came within 5 cells of a glow worm at the bottom of the screen, they would move down 
//      and mate with it - causing another fly to be born. 

FFExamples.flyingFireV2.initialize = function(FF) {
    var animationFrameCount = 50;
    var bugProb = 0.000005;

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

        var random = parseInt(Math.random() * (animationFrameCount - (animationFrameCount/2)) + (animationFrameCount/2)); // (max - min) + min

        if (leftState == parseInt(animationFrameCount/5)) {
            // nextCell.setState(random+'');
            nextCell.setState((parseInt(leftState)+1) + '');
            return;
        }

        if (rightState == parseInt(animationFrameCount/2)) {
            // nextCell.setState(random+'');
            nextCell.setState((parseInt(rightState)+1) + '');
            return;
        }

        if (upState == parseInt((animationFrameCount*3)/4)) {
            // nextCell.setState(random+'');
            nextCell.setState((parseInt(upState)+1) + '');
            return;
        }

        if (downState == parseInt(animationFrameCount/3)) {
            // nextCell.setState(random+'');
            nextCell.setState((parseInt(downState)+1) + '');
            return;
        }
    }

    function processBug(currentCell, nextCell) {
        var state = currentCell.getState();

        if (
            state == parseInt(animationFrameCount/2) ||
            state == parseInt(animationFrameCount/3) ||
            state == parseInt((animationFrameCount*3)/4) ||
            state == parseInt(animationFrameCount/5)
        ) {
            nextCell.setState('empty')
            return;
        }

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