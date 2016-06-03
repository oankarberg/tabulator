define(function () {

    var table;

    var dashboardID;
    function _checkValue(self,subNav,category){
         if(self.options[self.selectedIndex].value != ObjectTypes.Ordinal){
            // tableMeta.style.display = "none";
            self.parentNode.nextSibling.style.display ="none";
        }else{

            self.parentNode.nextSibling.style.display ="block";
            // subNav.style.maxHeight = subNav.clientHeight + self.parentNode.nextSibling.clientHeight + "px";

        }
        category.type = self.options[self.selectedIndex].value 
       
    }
    function _setupDataTypeSelection(parentElement, category, data){
        var selectMetaData = document.getElementById("select-meta-data");
        

            var columnId =  category.id
            var ul = document.createElement("ul");    
            ul.className = "metalist"
    
            var element = document.createElement("li");
            var select = document.createElement("select");  
            
            
            var defaulOp = document.createElement("option");
            defaulOp.textContent = "Choose Type";
            defaulOp.selected = true;
            defaulOp.disabled = true;
            select.appendChild(defaulOp)
            var scales =Object.keys(ObjectTypes);
            for(var k = 0; k < scales.length; k++){
                if(category.type != "Numerical"  && scales[k] != "Numerical"){
                    var el = document.createElement("option");
                    el.textContent = scales[k];
                    el.value = scales[k]
                    if(el.value == category.type){
                        el.selected = true;
                    }
                    select.appendChild(el)

                }else if(category.type == "Numerical" && scales[k] == "Numerical"){
                    var el = document.createElement("option");
                    el.textContent = scales[k];
                    el.value = scales[k]
                    if(el.value == category.type){
                        el.selected = true;
                    }
                    select.appendChild(el)
                }
                
                
            }
            select.addEventListener("change", function(){_checkValue(this,parentElement,category)});

            element.appendChild(select);

            ul.appendChild(element);

            var tableMeta = document.createElement("li");
            var innerTablehtml= "<table id='sort-" + columnId +"'  class='grid' >" + 
                                    "<thead>" + 
                                    "<tr><th class='index'>Index</th><th> " + category.displayName + "</th></tr>" + 
                                "</thead>" + 
                                "<tbody>";

            var existingValues = []
            var index  = 1
            for(var i  = 1; i < data.length; i++){
                // console.log("lool" ,data[i][fields[key].name])

                var cellValue = data[i][category.name]
                if($.inArray(cellValue, existingValues) == -1){
                     category.sortingByArray.unshift(cellValue)
                    innerTablehtml += "<tr><td class='" + columnId + "-index'>" + index +  "</td><td class='" + columnId + "-cellValue'>" + cellValue + "</td></tr>" 
                    index++;
                }
                    
                existingValues.push(cellValue);
                    

            }
            innerTablehtml += "</tbody>" +  "</table>" 
            tableMeta.innerHTML = innerTablehtml;

       
            ul.appendChild(tableMeta);
            
            parentElement.appendChild(ul);

            if(select.options[select.selectedIndex].value != ObjectTypes.Ordinal){
                tableMeta.style.display = "none";
            }


           

    }

    function createRow(category,data){
        var element = document.createElement("div");
        element.className = "category-dashboard-category";
        element.innerHTML = "<p class='category-dashboard-category-header'>"+category.displayName+"</p>";
        

        var list = document.createElement("ul");
        list.className = "sub-nav";
        $(element).find('.category-dashboard-category-header').click(function() {
            $(list).toggleClass('visible');
            // $(list).height(0);
        });
        if (category.type == ObjectTypes.Numerical){
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
        _setupDataTypeSelection(list, category, data)
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
        createDashboard : function(id, categories, _table,data) {
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
            Object.keys(categories).forEach (function (key,value) {

                div.appendChild(createRow(categories[key], data));
                var columnId = categories[key].id;
                var category =  categories[key]
                var fixHelperModified = function(e, tr) {
                    var $originals = tr.children();
                    var $helper = tr.clone();
                    $helper.children().each(function(index) {
                        $(this).width($originals.eq(index).width())
                    });
                    return $helper;
                },
                updateIndex = function(e, ui) {
                    $("td." + columnId + "-index", ui.item.parent()).each(function (i) {
                        $(this).html(i + 1);
                    });
                    //Insert Sort Order
                    category.sortingByArray = []
                    $("td." + columnId + "-cellValue", ui.item.parent()).each(function (i,element) {
                        category.sortingByArray.push(element.innerHTML)
                    });
                };


                $("#sort-"+columnId +" tbody").sortable({
                    helper: fixHelperModified,
                    stop: updateIndex
                }).disableSelection();

            });

             


        // var selectMetaData = document.getElementById("select-meta-data");
        

        // Object.keys(categories).forEach (function (key) {
        //     var columnId =  categories[key].id
        //     var ul = document.createElement("ul");    
        //     ul.className = "metalist"
        //     var el = document.createElement("li");  
        //     el.className = "category";
        //     el.innerHTML = "<span class='category-dashboard-category-header'>"+categories[key].displayName+"</span>";
        //     ul.appendChild(el);
        //     var element = document.createElement("li");
        //     var select = document.createElement("select");
            
            
        //     var el = document.createElement("option");
        //     el.textContent = "Choose Type";
        //     el.selected = true;
        //     el.disabled = true;
        //     select.appendChild(el)
        //     var scales =Object.keys(ObjectTypes);
        //     for(var k = 0; k < scales.length; k++){
        //         var el = document.createElement("option");

        //         el.textContent = scales[k];
        //         el.value = scales[k]
        //         if(el.value == categories[columnId].type){
        //             el.selected = true;
        //         }
        //         select.appendChild(el)
                
        //     }

        //     element.appendChild(select);

        //     ul.appendChild(element);

        //     var tableMeta = document.createElement("li");
        //     var innerTablehtml= "<table id='sort-" + columnId +"'  class='grid' >" + 
        //                             "<thead>" + 
        //                             "<tr><th class='index'>Index</th><th> " + categories[key].displayName + "</th></tr>" + 
        //                         "</thead>" + 
        //                         "<tbody>";

        //     var existingValues = []
        //     var index  = 1
        //     for(var i  = 1; i < data.length; i++){
        //         // console.log("lool" ,data[i][fields[key].name])

        //         var cellValue = data[i][categories[key].name]
        //         if($.inArray(cellValue, existingValues) == -1){

        //             innerTablehtml += "<tr><td class='" + columnId + "-index'>" + index +  "</td><td class='" + columnId + "-cellValue'>" + cellValue + "</td></tr>" 
        //             index++;
        //         }
                    
        //         existingValues.push(cellValue);
                    

        //     }
        //     innerTablehtml += "</tbody>" +  "</table>" 
        //     tableMeta.innerHTML = innerTablehtml;

            
        //     var tableWrapper = document.createElement("li");
        //     tableWrapper.appendChild(tableMeta);
        //     ul.appendChild(tableWrapper);
            
        //     selectMetaData.appendChild(ul);


        //     var fixHelperModified = function(e, tr) {
        //         var $originals = tr.children();
        //         var $helper = tr.clone();
        //         $helper.children().each(function(index) {
        //             $(this).width($originals.eq(index).width())
        //         });
        //         return $helper;
        //     },
        //     updateIndex = function(e, ui) {

        //         $("td." + columnId + "-index", ui.item.parent()).each(function (i) {
        //             $(this).html(i + 1);
        //         });
        //         //Insert Sort Order
        //         categories[columnId].sortingByArray = []
        //         $("td." + columnId + "-cellValue", ui.item.parent()).each(function (i,element) {
        //             categories[columnId].sortingByArray.push(element.innerHTML)
        //         });
        //     };


        //     $("#sort-"+columnId +" tbody").sortable({
        //         helper: fixHelperModified,
        //         stop: updateIndex
        //     }).disableSelection();


        // });




        },
        reset : function(id) {
            d3.select("#"+id).html("");

        }
    }
});