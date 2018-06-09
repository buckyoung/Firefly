// var FFExamples = FFExamples || {};

// FFExamples.ant = {};

// // At a white square, turn 90° right, flip the color of the square, move forward one unit
// // At a black square, turn 90° left, flip the color of the square, move forward one unit

// FFExamples.ant.initialize = function(FF) {
//     var antSquareState = 'white';
//     var antDirection = 0; // 0 = N, 1 = E, 2 = S, 3 = W

//     initializeModel(FF);

//     function initializeModel(FF) {
//         FF.registerState('black', [255, 255, 255], processSquare);
//         FF.registerState('white', [0, 0, 0], processSquare);
//         FF.registerState('ant', [200, 0, 0], processAnt);

//         FF.initialize(initializeWorld(FF));
//     }

//     function processSquare(currentCell, nextCell) {
//         // do nothing
//     }

//     function processAnt(currentCell, nextCell) {
//         nextCell.setState(antSquareState == 'white' ? 'black' : 'white');
        
//         var cellToMoveTo = getCellInDirection(currentCell, antDirection);

//         antSquareState = cellToMoveTo.getState();
//         cellToMoveTo.setState('ant'); // TODO BUG need the NEXT CELL to be set to ant

//         antDirection = getNewAntDirection(antSquareState, antDirection);
//     }

//     function initializeWorld(FF) {
//         return function(world, width, height) {
//             for (var i = 0; i < width; i++) {
//                 for (var j = 0; j < height; j++) {
//                     world[i][j] = new FF.Cell('white', i, j); 
//                 }
//             }

//             var w = parseInt(width/2);
//             var h = parseInt(height/2);

//             // Put a single ant in the center of an all-white field
//             world[w][h] = new FF.Cell('ant', w, h); 
//         };
//     }

//     function getNewAntDirection(state, currentDirection) {
//         var multiplier = (state === 'white' ? 1 : -1);

//         var newDirection = (currentDirection + (1 * multiplier));

//         if (newDirection < 0) {
//             return 3;
//         }

//         if (newDirection > 3) {
//             return 0;
//         }

//         return newDirection;
//     }

//     function getCellInDirection(currentCell, direction) {
//         switch (direction) {
//             case 0:
//                 return currentCell.getSpecificNeighbor(0, 1);
//             case 1: 
//                 return currentCell.getSpecificNeighbor(1, 0);
//             case 2: 
//                 return currentCell.getSpecificNeighbor(0, -1);
//             case 3: 
//                 return currentCell.getSpecificNeighbor(-1, 0);
//         }
//     }
// };