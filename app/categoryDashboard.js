define(function () {

    var table;

    var ObjectTypes = {nominal: "Nominal",
                    quantitative: "Quantitative",
                    ordinal: "Ordinal",
                    interval: "Interval"};

    function createRow(category){
        document.find
        var element = document.createElement("div");
        element.className = "category-dashboard-category";
        element.textContent = category.displayName;
        if (category.type == ObjectTypes.quantitative){

            var button = document.createElement("button");
            var span = document.createElement("span");
            button.className = "toggle-circle";
            span.classList.add("span-circle");
            button.addEventListener("click", function() {
                button.classList.toggle("active");
                table.toggleCircles(category) } );
            // button.textContent = "Toggle Circle";
            element.appendChild(button);
            button.appendChild(span);
        }

        return element;
    }


    return {
        createDashboard : function(id, categories, _table) {
            table = _table;
            var div = document.getElementById(id)
            div.style.visibility = "visible"
            if (!div)
                return

            Object.keys(categories).forEach (function (key) {
                div.appendChild(createRow(categories[key]));
            });
        }
    }
});