var FFExamples = FFExamples || {};

FFExamples.anyInit = {};

FFExamples.anyInit.initialize = function() {
    Firefly(function(FF) {
        FF.registerModel('Any LIFE', function() {
            FFExamples.anylife.initialize(FF);
        });  
    });
};