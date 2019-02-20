var FFExamples = FFExamples || {};

FFExamples.all = {};

FFExamples.all.initialize = function() {

    // To add an example, just put the filename here:
	var examples = [
        'beehive',
        'briansBrain',
        'conwaysGameOfLife',
        'cyclic',
        'cyclicWithConway',
        'forestFire',
        'iceVsForest',
        'iceVsSeed',
        'rule110',
        'rule184',
        'rule184SingleLine',
        'rule30',
        'rule90',
        'seed',
        'serviettes',
        'trippy1AvocadoWorld',
        'trippy2Epidemic',
        'trippy2SunBurst',
        'trippy3RippleWorld',
        'trippy4MergingDiamonds',
        'walledCities',
	];

    // Dynamically load js on page
	examples.forEach(function(example) {
		var imported = document.createElement('script');
		imported.src = './examples/' + example + '.js';
		document.head.appendChild(imported);
	});

    // Dynamically register each model 
    Firefly(function(FF) {
        examples.forEach(function(example) {
            // title case to create names
            var temp = example.replace( /([A-Z])/g, " $1" );
            var name = temp.charAt(0).toUpperCase() + temp.slice(1);

            FF.registerModel(name, function() {
                FFExamples[example].initialize(FF);
            });
        });  
    });
};