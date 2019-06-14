/***************************
 * reporting module
 */
Firefly.modules.reporting = function(FF) {
    // Private Variables
    var registeredStates = [];
    var snapshotInterval = 100;
    var report = {};
    var table;
    var row;

    // Public Methods
    FF.registerReportTracking = registerReportTracking;
    FF.setReportingSnapshotInterval = setReportingSnapshotInterval;

    // Protected Methods
    Firefly.reporting = {};
    Firefly.reporting.onUpdate = onUpdate;
    
    Firefly.reporting.initialize = initialize;
    function initialize() {
        console.log('youre a genious');
        registeredStates = [];
        report = {};
        table = document.getElementById('report');
        row = table.insertRow(0);
    }

    /** Registeres a cell state to track & the color to report it as */
    function registerReportTracking(name) {
        // TODO add ROW parameter that allows the reporting drawer to track multiple different things at once
        //      -- example: One row tracks pinkPeople vs greenPeople, another row tracks pinkCities vs greenCities

        registeredStates.push(name);
    }

    /** Will create a reporting snapshot at each <interval> generation */
    function setReportingSnapshotInterval(interval) {
        snapshotInterval = interval;
    }

    /** To be called every frame, stores the reporting snapshot */
    function onUpdate() {
        // Short circuit if no states to report on
        if (registeredStates.length == 0) { return; }
        
        // Short circuit if not time to take a snapshot
        var generationCount = FF.getGenerationCount();
        if (generationCount % snapshotInterval != 0) { return; }

        // Store report snapshot at this generation
        report[generationCount] = {};

        var totalCellCount = 0;
        var count = 0;

        registeredStates.forEach(function(stateName) {
            count = FF.getStateCount(stateName);
            console.log('count', count);
            report[generationCount][stateName] = count;
            totalCellCount += count;
            console.log('total', totalCellCount);
        });

        report[generationCount]['total'] = totalCellCount;

        console.log('finaltotal', totalCellCount);

        /*
            report =   
                {
                    ...
                    530: {greenPeople: 246, pinkPeople: 36, total: 282},
                    540: {greenPeople: 245, pinkPeople: 31, total: 276},
                    550: {greenPeople: 293, pinkPeople: 39, total: 332},
                    ...
                }
        */

        updateUI();
    }

    /** To be called every snapshot */
    function updateUI() {
        var td = row.insertCell();
        var div;
        var percent = 0;

        for (var generation in report) {
            if (!report.hasOwnProperty(generation)) { continue; } // Short circuit

            for (var stateName in report[generation]) {
                if (!report[generation].hasOwnProperty(stateName)) { continue; } // Short circuit
                if (stateName === 'total') { continue; } // Short circuit
                if (report[generation]['total'] === 0) { continue; } // Short circuit

                console.log(report[generation]);
                console.log(report[generation][stateName] / report[generation]['total']);

                percent = parseInt((report[generation][stateName] / report[generation]['total']) * 100);

                console.log(percent);

                if (Number.isNaN(percent)) { continue; } // Short circuit


                div = document.createElement('div');
                div.style.background = Firefly.state.getStateHexColor(stateName);
                div.style.height = percent + '%';
                div.style.width = '100%';

                td.appendChild(div);
            }
        }
        throw new Error("my error message");
    }
};