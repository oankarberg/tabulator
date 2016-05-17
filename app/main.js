
define(function (require) {

    var table = require('./tableDrawer.js');
    var categoryDashboard = require('./categoryDashboard.js');


    categories = table.initData("sample_data_sales.csv", function(data, fields) {
        categoryDashboard.createDashboard("category-dashboard", fields);
    });

    var circleButton = document.getElementById("toggleCircles");
    circleButton.addEventListener("click", table.toggleCircles);

});