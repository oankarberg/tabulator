
define(function (require) {

    var fileHandler = require('./fileHandler.js');
    var table = require('./tableDrawer.js');
    var categoryDashboard = require('./categoryDashboard.js');

    
    fileHandler.setFileCallback( function (data) {
        var fields = table.initData(data)
        categoryDashboard.createDashboard("category-dashboard", fields, table);

        var tableWrapper = document.getElementById("table-wrapper");
        var h1 = document.createElement("h1");
        h1.id = "table_header";
        tableWrapper.insertBefore(h1, tableWrapper.firstChild);
        // var header = document.getElementById("table_header");
        
        var late = fields[Object.keys(data[0])[0]].displayName
        h1.innerHTML =  "Showing data by " + late
    });



    var saveTable = require('./saveTable.js');
    var saveButton = document.getElementById("save-table-button");
    saveButton.addEventListener("click",function(){ saveTable.saveToImage("Tabulator-GeneratedTable")});
    

});