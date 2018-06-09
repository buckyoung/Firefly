var FFExamples = FFExamples || {};

FFExamples.all = {};

FFExamples.all.initialize = function() {
    Firefly(function(FF) {
        FF.registerModel('Brian\'s Brain', function() {
            FFExamples.brians.initialize(FF);
        });

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

        FF.registerModel('Walled Cities', function() {
            FFExamples.walledCities.initialize(FF);
        });

        FF.registerModel('Serviettes', function() {
            FFExamples.serviettes.initialize(FF);
        });

        FF.registerModel('Elementary \- Rule 184', function() {
            FFExamples.rule184.initialize(FF);
        });

        FF.registerModel('Elementary \- Rule 184 Single Line', function() {
            FFExamples.rule184SingleLine.initialize(FF);
        });

        FF.registerModel('Elementary \- Rule 90', function() {
            FFExamples.rule90.initialize(FF);
        });

        FF.registerModel('Elementary \- Rule 30 (chaos)', function() {
            FFExamples.rule30.initialize(FF);
        });

        FF.registerModel('Elementary \- Rule 110 (stable/chaos)', function() {
            FFExamples.rule110.initialize(FF);
        });

        FF.registerModel('Seeds', function() {
            FFExamples.seed.initialize(FF);
        });

        FF.registerModel('Ice vs. Seeds (mod)', function() {
            FFExamples.iceVsSeed.initialize(FF);
        });

        FF.registerModel('Ice vs. Forest Fire', function() {
            FFExamples.iceVsForest.initialize(FF);
        });      
    });
};