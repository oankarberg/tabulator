define(function () {

    var table;

    var dashboardID;

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


    var fonts = {
         "Gill Sans": "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif",
         "Arial": "Arial, Helvetica, sans-serif ",
         "Helvetica": "'Helvetica Neue', Helvetica, Arial, sans-serif",
         "Verdana": "Verdana, Geneva, sans-serif ",
         "Times New Roman": "'Times New Roman', Times, serif ",
         "Palatino":"Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua', Georgia, serif",
         "Georgia": "Georgia, Times, 'Times New Roman', serif "
    }
    var list = $('.change-font');
    for(var i = 0; i < list.length; i++){
        list[i].addEventListener("click",function(){document.getElementById("table-wrapper").style.fontFamily = fonts[this.innerHTML];})
    }
    function _reset(){
        var dashboard = document.querySelectorAll(".category-dashboard-category");
        if(dashboard.length > 0){
            for(var i = 0; i < dashboard.length; i++){
                dashboard[i].parentNode.removeChild(dashboard[i]);
            };
            // var _ = dashboard.removeChild(dashboard.childNode);
            
        }
    }

    return {
        createDashboard : function(id, categories, _table) {
            _reset();
            table = _table;
            var div = document.getElementById(id)
            
            if (!div)
                return


            div.innerHTML = "<div id='paddingSlider'></div>";
            $( "#paddingSlider" ).slider({
                value: table.getPadding(),
                min: 2,
                max: 11,
                step: 0.5,
                slide: function( event, ui ) {
                    table.setPadding(ui.value);
                }
            })
            Object.keys(categories).forEach (function (key) {
                div.appendChild(createRow(categories[key]));
            });
        },
        reset : function(id) {
            d3.select("#"+id).html("");

        }
    }
});