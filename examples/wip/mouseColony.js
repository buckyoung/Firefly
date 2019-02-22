// Major issues with trying to move a single cell 
// because of when draws happen

// var FFExamples = FFExamples || {};

// FFExamples.mouseColony = {};

// // Game that starts with two mice
// // They wander around randomly & when two meet, they make a third

// FFExamples.mouseColony.initialize = function(FF) {
//     initializeModel(FF);

//     function initializeModel(FF) {
//         FF.registerState('mouse', [0, 0, 0], processMouse);
//         FF.registerState('child', [255, 0, 0], processChild);
//         FF.registerState('empty', [200, 200, 200], processEmpty);

//         FF.initialize(initializeWorld(FF));
//     }

//     function processChild(currentCell, nextCell) {
//         nextCell.setState('child');
//     }

//     function processMouse(currentCell, nextCell) {
//         if (currentCell.getPosition().x == 0) {
//             nextCell.setState('empty');
//             return;
//         }

//         nextCell.setState('mouse');
//     }

//     function processEmpty(currentCell, nextCell) {
//         // Breeding
//         if (currentCell.countMooreNeighbors('mouse') == 2) {
//             nextCell.setState('child');
//             return;
//         }

//         var xOffsets = [0, 0, 1]; // more 0's mean more chance to stand still
//         var yOffsets = [-1, 0, 1];

//         var randomXOffset = xOffsets[Math.floor(Math.random()*xOffsets.length)];; // can only move left because the cell in the next world is already drawn
//         var randomYOffset = yOffsets[Math.floor(Math.random()*yOffsets.length)]; // Safe to move up or down or straight

//         // Stand still
//         if (randomXOffset == 0) {
//             nextCell.setState('empty');
//             return;
//         }

//         var neighborCell = currentCell.getSpecificNeighbor(randomXOffset, randomYOffset); // issues with wrapping from left side to right

//         // Moving
//         if (neighborCell.getState() == 'mouse') {
//             nextCell.setState('mouse');
//             neighborCell.setState('empty');
//             return;
//         }

//         // Breeding
//         if (currentCell.countMooreNeighbors > 1) { // will likely never fire
//             nextCell.setState('child');
//             return;
//         }

//         nextCell.setState('empty');
//     }

//     function initializeWorld(FF) {
//         return function(world, width, height) {
//             for (var i = 0; i < width; i++) {
//                 for (var j = 0; j < height; j++) {
//                     var state = (Math.random() < .01 ? 'mouse' : 'empty');
//                     world[i][j] = new FF.Cell(state, i, j); 
//                 }
//             }

//             // world[Math.floor(width*1/3)][Math.floor(height/2)] = new FF.Cell('mouse', Math.floor(width*1/3), Math.floor(height/2)); 
//             // world[Math.floor(width*2/3)][Math.floor(height/2)] = new FF.Cell('mouse', Math.floor(width*2/3), Math.floor(height/2)); 
//         };
//     }
// };
