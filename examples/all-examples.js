var FFExamples = FFExamples || {};

FFExamples.all = {};

FFExamples.all.initialize = function() {
    Firefly(function(FF) {
        FF.registerModel('Conway\'s Game of Life', function() {
            FFExamples.conway.initialize(FF);
        });

        FF.registerModel('Forest Fire', function() {
            FFExamples.forest.initialize(FF);
        });

        FF.registerModel('Cyclic', function() {
            FFExamples.cyclic.initialize(FF);
        });

        FF.registerModel('Cyclic (with Conway\'s)', function() {
            FFExamples.cyclicWithConway.initialize(FF);
        });
    });
};