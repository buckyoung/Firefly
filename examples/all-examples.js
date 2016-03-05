var FFExamples = FFExamples || {};

FFExamples.all = {};

FFExamples.all.initialize = function() {
    Firefly(function(FF) {
        FF.registerModel('Conway\'s Game of Life', function(FF) {
            FFExamples.conway.initialize(FF);
        });

        FF.registerModel('Forest Fire', function(FF) {
            FFExamples.forest.initialize(FF);
        });

        FF.registerModel('Cyclic', function(FF) {
            FFExamples.cyclic.initialize(FF);
        });

        FF.registerModel('Cyclic (with Conway\'s)', function(FF) {
            FFExamples.cyclicWithConway.initialize(FF);
        });
    });
};