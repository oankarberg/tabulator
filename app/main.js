


var ObjectTypes = {Nominal: "Nominal",
                        Numerical: "Numerical",
                        Ordinal: "Ordinal"};
                        // Interval: "Interval"};

define(function (require) {

    var fileHandler = require('./fileHandler.js');
    var table = require('./tableDrawer.js');
    var categoryDashboard = require('./categoryDashboard.js');


    fileHandler.setFileCallback( function (data) {
        table.resetTable();
        $('#sidebar').show();
        $('#sidebar').css("display","block")
        categoryDashboard.reset("category-dashboard");
        $('.welcome').hide();
        var fields = table.initData(data)
        categoryDashboard.createDashboard("category-dashboard", fields, table,data);
        var upload = $("#file-upload-content");
        upload.remove();
        upload.prependTo("#sidebar");

        var late = fields[0].displayName

       var tableWrapper = document.getElementById("table-wrapper");
        var h1 = document.createElement("h1");
        h1.id = "table_header";
        tableWrapper.insertBefore(h1, tableWrapper.firstChild);
        // var header = document.getElementById("table_header");
        h1.innerHTML =  "Showing data by <span id='sortedby'>"+late +"</span>";





        
     





    });



    var saveTable = require('./saveTable.js');
    var saveButton = document.getElementById("save-table-button");
    saveButton.addEventListener("click",function(){ saveTable.saveToImage("Tabulator-GeneratedTable")});
    

});