
define(function () {
    var fields;

    var _arrayFields = []; 


    var data = null;
    var table;
    var sortingFunction = null;
    var currentlySorting = {by: "", order: ""};

    var testCols = [1,2,3,4,5,6,7,8,9,10,11,12]
        
    function _toggleVisibility(category){
        category.visible = category.visible ? false : true;
        updateTable(); 
    }
    function _reorderColumns(table) {
        var startIndex = table.startIndex-1;
        var endIndex = table.endIndex-1;
        var i, temp;
        if (startIndex < endIndex){
            for ( i = startIndex; i < endIndex; i++){
                temp = _arrayFields[i];
                _arrayFields[i] = _arrayFields[i+1];
                _arrayFields[i+1] = temp;
            }
        }else{
            for ( i = startIndex; i > endIndex; i--){
                temp = _arrayFields[i];
                _arrayFields[i] = _arrayFields[i-1];
                _arrayFields[i-1] = temp;
            }
        }
        updateTable()
        

    }
    function _formatName(name){
        var newName  = name.replace(/(^|_)(\w)/g, function ($0, $1, $2) {
            return ($1 && ' ') + $2.toUpperCase();
        });
        return newName.replace(/([a-z])([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase()});
    }
    //find fields
    function _findFields(data){

        var names = d3.keys(data[0])
        var fields = {};
        names.forEach(function (name, i ){
            var type = ObjectTypes.Nominal;
            if (Number(data[0][name]))
                type = ObjectTypes.Quantitative;
            else {
                type = ObjectTypes.Nominal;
            }

            // var displayName = _formatName(name);
            var column = { name: name, 
                displayName: name, 
                type: type, 
                currentPosition: i,
                maxValue: 0,
                minValue: 0,
                maxDecimals: 0,
                circlesOn: false,
                width: 0,
                height: 0,
                visible: true,
                previousRowVal: undefined,
                alignStyle: "text-align:left;padding: 4px 20px;"
            };
            fields[name] = column
            _arrayFields.push(column)
        });
        return _arrayFields;
    }
    function _resetPreviousRowValues(){
        _arrayFields.forEach(function(column, i){
            column.previousRowVal = undefined;
        });
    }

 //Draw the Ellipse
    function _sortBy (column, order) {
            if (column != null && order != null){
                if (order == "ascending"){
                    currentlySorting.by = column
                    currentlySorting.order = order
                    sortingFunction = function (a,b) { 
                                                    return d3.ascending(a[column.name], b[column.name])};
                }else if (order =="descending"){
                    currentlySorting.by = column
                    currentlySorting.order = order
                    sortingFunction = function (a,b) { return d3.descending(a[column.name], b[column.name])};
                }
            }
            _resetPreviousRowValues();
            updateTable()
        }

    function _appendCircleForNumbers(v){
        
        var column = v.column;

        if(column.circlesOn){
            d3.select(this).append("svg")
            .attr("width", column.width )
            .attr("height", column.height )
            .append("circle")
            .attr("cx", this.clientWidth / 2 + "px")
            .attr("cy", column.height / 2 + 3 + "px")
            .attr("r", function(d){ 
                var max = column.maxValue +  Math.abs(column.minValue);
                var x = Math.abs(d.value - column.minValue ) / max  * 6
                return x;
            })

            return "text-align:left;padding: 0px 0px; max-height: 28px;";
        }else{
            return column.alignStyle;
            
        }

        return "font-family: 'Gill Sans', 'Gill Sans MT', Calibri, sans-serif;"
    }

    var countDecimals = function(value) {
        if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
        return 0;
    }
    
    function _toggleCircles(column){
        column.circlesOn = column.circlesOn ? false : true
        updateTable();
    }
    function _setDimensionsOfCell(v){
        v.column.height =  22;
        v.column.width = this.clientWidth;
    }
    function _mapDataTypes(row){
        var columns = _arrayFields.filter(function(c){return c.visible})
        return columns.map(function(column) {
            var val =  row[column.name];
            var datatype;
            if(column.type == ObjectTypes.Quantitative){
                val = Number(val)
                if(column.maxValue < val) {column.maxValue = val}
                if(column.minValue > val) {column.minValue = val}
                if(column.maxDecimals < countDecimals(val)){
                    column.maxDecimals = countDecimals(val);
                }
                // GENERATE MANY DECIMALS
                row[column.name] = val;
                val = val.toFixed(column.maxDecimals);
                column.alignStyle = "text-align:right; padding-left: 20px; padding-right: 20px;";
            // Nominal Value...
            }else{
                if(!column.previousRowVal){
                    column.previousRowVal = val;
                }else if(currentlySorting.by == column && column.previousRowVal == val){
                    val = ""
                }else{
                    column.previousRowVal = val;
                }
                

            }
            return {column: column, value: val};
        });
    }


    function updateTable(){
        if (data == null)
            return

        var columns = d3.keys(data[0])

        if (sortingFunction) {
            data = data.sort(sortingFunction)
        }
        d3.select("thead").selectAll("tr").selectAll("th").remove();
        d3.select("thead").selectAll("tr").remove();

        d3.select("thead").append("tr")
                    .selectAll("th")
                    .data(_arrayFields.filter(function(d){ return d.visible }))
                    .enter()
                    .append("th")
                    .attr("style", function(value){return value.alignStyle;})
                    .on("click", function(d) {
                            var arrowToBeRemoved = document.getElementById("arrow");
                            if(arrowToBeRemoved){arrowToBeRemoved.parentNode.removeChild(arrowToBeRemoved)}
                            var img = document.createElement("img");
                            img.id = "arrow";
                            if ((currentlySorting.by) == d){
                                if (currentlySorting.order == "ascending"){
                                    _sortBy(d, "descending");
                                    img.src = "/svg/arrow_down.png";
                                    img.id = "arrow";
                                    this.firstChild.appendChild(img);
                                }else{
                                    img.src = "/svg/arrow_up.png";
                                    this.firstChild.appendChild(img);
                                    _sortBy(d, "ascending");
                                }
                            }else{            
                                img.src = "/svg/arrow_up.png";
                                this.firstChild.appendChild(img);
                                _sortBy(d, "ascending");
                            }
                        })
                    .append("span")
                        .text(function(column) {
                                                return column.displayName; })
                 

        d3.select("tbody").selectAll("tr").remove();

        // create a row for each object in the data
         var rows = d3.select("tbody").selectAll("tr")
            .data(data)
            .enter()
            .append("tr");


        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(_mapDataTypes)
            .enter()
            .append("td")
            .attr("getDims",_setDimensionsOfCell)
            // }) // sets the font style
            .html(function(d) { 
                return ObjectTypes.Quantitative == d.column.type && d.column.circlesOn ? "" : d.value
            })
            .attr("style", _appendCircleForNumbers)
            $(table).dragtable('redraw').dragtable({persistState: _reorderColumns })
           

    }
    
    return {
        initData: function (jsondata) {
        
            data = jsondata
            fields = _findFields(data);
            var peopleTable = createTable(data, fields);
            return fields;

            // The table generation function
            function createTable(data) {
                var columns = d3.keys(data[0])
    
                var newTable = d3.select("body").append("div").attr("id","table-wrapper").append("table").attr("id", "generated-table"),

                    thead = newTable.append("thead"),
                    tbody = newTable.append("tbody");

                table = newTable
                
                // append the header row
                thead.append("tr")
                    .selectAll("th")
                    .data(_arrayFields.filter(function(d){ return d.visible }))
                    .enter()
                    .append("th")
                    .on("click", function(d) {
                            var arrowToBeRemoved = document.getElementById("arrow");
                            if(arrowToBeRemoved){arrowToBeRemoved.parentNode.removeChild(arrowToBeRemoved)}
                            var img = document.createElement("img");
                            img.id = "arrow";
                            if ((currentlySorting.by) == d){
                                if (currentlySorting.order == "ascending"){
                                    _sortBy(d, "descending");
                                    img.src = "/svg/arrow_down.png";
                                    img.id = "arrow";
                                    this.firstChild.appendChild(img);
                                }else{
                                    img.src = "/svg/arrow_up.png";
                                    this.firstChild.appendChild(img);
                                    _sortBy(d, "ascending");
                                }
                            }else{            
                                img.src = "/svg/arrow_up.png";
                                this.firstChild.appendChild(img);
                                _sortBy(d, "ascending");
                            }
                        })
                    .append("span")
                        .text(function(column) {
                                                return column.displayName; })
                        

            $(table).dragtable({persistState: _reorderColumns })
                // create a row for each object in the data
                var rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr");
                
                // create a cell in each row for each column
                var cells = rows.selectAll("td")
                    .data(_mapDataTypes)
                    .enter()
                    .append("td")
                    .attr("getDims",_setDimensionsOfCell)
                    // }) // sets the font style
                    .html(function(d) { 
                        return ObjectTypes.Quantitative == d.column.type && d.column.circlesOn ? "" : d.value
                    })
                    .attr("style", _appendCircleForNumbers)

                updateTable();
                return table;
            }

        },
        resetTable: function(){

            var tableDiv = document.getElementById("table-wrapper");
            if(tableDiv){tableDiv.parentNode.removeChild(tableDiv);}
            _arrayFields = [];
        },
        sortBy: function (column, order) {
            _sortBy(column,order)
        },
        toggleCircles: function(column){
            _toggleCircles(column)
        },

        toggleVisibility: function(category){
            _toggleVisibility(category);
        }
    };
});

