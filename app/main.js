
define(function (require) {

    var fileHandler = require('./fileHandler.js');
    var table = require('./tableDrawer.js');
    var categoryDashboard = require('./categoryDashboard.js');

    
    fileHandler.setFileCallback( function (data) {
        var fields = table.initData(data)
        categoryDashboard.createDashboard("category-dashboard", fields, table);
        var header = document.getElementById("table_header");
        var late = fields[Object.keys(data[0])[0]].displayName
        header.innerHTML =  "Showing data by " + late
    });


});