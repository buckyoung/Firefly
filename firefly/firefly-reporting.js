/***************************
 * reporting module
 */
Firefly.modules.reporting = function(FF) {
    // Private Variables
    var registeredStates = [];
    var snapshotInterval = 100;
    var report = {};
    var table = document.getElementById('report');
    var row = table.insertRow();

    // Public Methods
    FF.registerReportTracking = registerReportTracking;
    FF.setReportingSnapshotInterval = setReportingSnapshotInterval;

    // Protected Methods
    Firefly.reporting = {};
    Firefly.reporting.onUpdate = onUpdate;
    Firefly.reporting.initialize = initialize;

    function initialize() {
        registeredStates = [];
        report = {};
        snapshotInterval = 100;
        table = document.getElementById('report');
        table.innerHTML = '';
        row = table.insertRow();
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
            report[generationCount][stateName] = count;
            totalCellCount += count;
        });

        report[generationCount]['total'] = totalCellCount;

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

        updateUI(report[generationCount]);
    }

    /** To be called every snapshot */
    function updateUI(snapshot) {
        if (snapshot['total'] === 0) { return; } // Short circuit

        var td = row.insertCell();
        var div;
        var percent = 0;

        for (var stateName in snapshot) {
            if (!snapshot.hasOwnProperty(stateName)) { continue; } // Short circuit
            if (stateName === 'total') { continue; } // Short circuit
            
            percent = parseInt((snapshot[stateName] / snapshot['total']) * 100);

            div = document.createElement('div');
            div.style.background = Firefly.state.getStateHexColor(stateName);
            div.style.height = percent + '%';
            div.style.width = '100%';

            td.appendChild(div);
        }

        // Only report the last X number of snapshots in the UI
        if (row.childElementCount > 50) {
            var fc = row.firstChild;
            row.removeChild(fc);
        }
    }
};