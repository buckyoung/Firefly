var FFExamples = FFExamples || {};

FFExamples.all = {};

FFExamples.all.initialize = function() {

    // To add an example, just put the filename here:
	var examples = [
        'new - mouseColony',
        'bloomType - avocadoWorld',
        'bloomType - epidemic',
        'bloomType - mergingDiamonds',
        'bloomType - rippleWorld',
        'bloomType - runBloom',
        'bloomType - sunBurst',
        'buck - beehive',
        'buck - cyclicWithConway',
        'buck - iceVsForest',
        'buck - iceVsSeed',
        'classic - briansBrain',
        'classic - conwaysGameOfLife',
        'classic - cyclic',
        'classic - forestFire',
        'classic - seed',
        'classic - serviettes',
        'classic - walledCities',
        'elementary - rule110',
        'elementary - rule184',
        'elementary - rule184SingleLine',
        'elementary - rule30',
        'elementary - rule90',
        'gasType - gas',
        'gasType - gasVsGas',
        'gasType - warringNations',
	];

    // Dynamically load js on page
	examples.forEach(function(example) {
        var myArr = example.split(" - ");

		var imported = document.createElement('script');
		imported.src = './examples/' + myArr[1] + '.js';
		document.head.appendChild(imported);
	});

    // Dynamically register each model 
    Firefly(function(FF) {
        examples.forEach(function(example) {
            // title case to create names
            var myArr = example.split(" - ");

            var modelName = myArr[1];

            myArr[0] = myArr[0].replace( /([A-Z])/g, " $1" );
            myArr[1] = myArr[1].replace( /([A-Z])/g, " $1" );
            myArr[0] = myArr[0].charAt(0).toUpperCase() + myArr[0].slice(1);
            myArr[1] = myArr[1].charAt(0).toUpperCase() + myArr[1].slice(1);

            FF.registerModel(myArr[0] + " - " + myArr[1], function() {
                FFExamples[modelName].initialize(FF);
            });
        });  
    });
};