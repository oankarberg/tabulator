
define(function (require) {

    var table = require('./tableDrawer.js');
    table.initData()

    var circleButton = document.getElementById("toggleCircles");
    circleButton.addEventListener("click", table.toggleCircles);

});