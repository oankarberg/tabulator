define(function () {

    function createRow(category){
        var element = document.createElement("div");
        element.className = "category-dashboard-category";
        element.textContent = category.name;
        return element;
    }


    return {
        createDashboard : function(id, categories) {
            var div = document.getElementById(id)
            if (!div)
                return

            categories.forEach(function(category) {
                div.appendChild(createRow(category));
            });
        }
    }
});