define(function () {

    var table;

    function createRow(category){
        var element = document.createElement("div");
        element.className = "category-dashboard-category";
        element.innerHTML = "<span class='category-dashboard-category-header'>"+category.displayName+"</span>";
        

        var list = document.createElement("ul");
        list.className = "sub-nav";
        $(element).find('.category-dashboard-category-header').click(function() {
            $(list).toggleClass('visible');

        });
        if (category.type == ObjectTypes.Quantitative){
            var item1 = document.createElement("li");
            item1.textContent ="Toggle Circles: ";
            var button = document.createElement("button");
            var span = document.createElement("span");
            button.className = "toggle-circle";
            span.classList.add("span-circle");
            button.addEventListener("click", function() {
                button.classList.toggle("active");
                table.toggleCircles(category) } );
            // button.textContent = "Toggle Circle";
            button.appendChild(span);
            item1.appendChild(button);
            list.appendChild(item1);
        }
        
        var item2 = document.createElement("li");
        var button = document.createElement("button");
        button.textContent ="Toggle Visibility";
        $(button).click(function () { table.toggleVisibility(category)})
        item2.appendChild(button);
        list.appendChild(item2);
        element.appendChild(list);
        
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