
define(function () {
    var fields;

    var _arrayFields = []; 

    var paddingHeight = 4;
    var paddingHeightForFillColor = 6;
    var columnHeight = 22;
    var paddingWidth = 20;
    var data = null;
    var tabled3; 
    var sortingFunction = null;
    var currentlySorting = {by: "", order: ""};


    function _paddingEstimation(size){
        var endSize = 50;
        var maxPadding = 15;
        var minPadding = 2;
        var t = size/endSize;
        if (t > 1)
            t = 1;

        var interpolation = (1-t)*maxPadding + t*minPadding;

        paddingHeight = interpolation;

    }

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

            var displayName = _formatName(name);
            var column = { name: name, 
                displayName: displayName, 
                id: i,
                type: type, 
                maxValue: 0,
                minValue: 0,
                maxDecimals: 0,
                circlesOn: false,
                width: 0,
                isHeader: false,
                visible: true,
                previousRowVal: undefined,
                alignStyle: "text-align:left;",
                padding: "padding: 4px 20px;",
                sortingByArray: []
            };
            fields[name] = column
            _arrayFields.push(column)
        });

        //Check first row to see if it is a "header"
        var foundEntries =[];
        for (var i=0; i < data.length; i++){
            var entry = data[i][_arrayFields[0].name]
            if (Number(entry))
                break;
            if (foundEntries.indexOf(entry) != -1)
                break;
            foundEntries.push(entry);

            if (i == (data.length - 1)){

                _arrayFields[0].isHeader = true;
            }
        }


        return _arrayFields;
    }
    function _resetPreviousRowValues(){
        _arrayFields.forEach(function(column, i){
            column.previousRowVal = undefined;
        });
    }

    function customAscending(a, b){
            return a - b;
    }
    function customDescending(a, b){
            return b - a;
    }

 //Draw the Ellipse
    function _sortBy (column, order) {
            if (column != null && order != null){
                if (order == "ascending"){
                    currentlySorting.by = column
                    currentlySorting.order = order
                    sortingFunction = function (a,b) { 
                        if(column.type == ObjectTypes.Ordinal){
                            return customAscending(column.sortingByArray.indexOf(a[column.name]), column.sortingByArray.indexOf(b[column.name]));
                        }else{
                          return d3.ascending(a[column.name], b[column.name]);   
                        }

                    }
                }else if (order =="descending"){
                    currentlySorting.by = column
                    currentlySorting.order = order
                    sortingFunction = function (a,b) {
                        if(column.type == ObjectTypes.Ordinal){
                            return customDescending(column.sortingByArray.indexOf(a[column.name]), column.sortingByArray.indexOf((b[column.name])));
                        } else{
                            return d3.descending(a[column.name], b[column.name]);
                        }
                        // return d3.descending(a[column.name], b[column.name]);
                        
                    }
                        
                }
            }
            prevRowIndex = 0;
            _resetPreviousRowValues();
            _resetTRClassNames();
            updateTable()
        }


    function _resetTRClassNames(){
        var oddRows = document.querySelectorAll(".odd");
        var evenRows = document.querySelectorAll(".even");
        for(var i = 0; i < evenRows.length; i++){
            evenRows[i].classList.remove("even");
        }
        for(var i = 0; i < oddRows.length; i++){
            oddRows[i].classList.remove("odd");
        }
    }
    function _createCircleStyle(self,v){
        var column = v.column
        d3.select(self).append("svg")
            .attr("width", column.width )
            .attr("height", "100%")
            .append("circle")
            .attr("cx", self.clientWidth / 2 + "px")
            .attr("cy", columnHeight / 2 + 3+ "px")
            .attr("r", function(d){ 
                var max = column.maxValue +  Math.abs(column.minValue);
                var x = Math.abs(d.value - column.minValue ) / max  * 6
                return x;
            });
    }
    function _styleCell(v){
        
        var column = v.column;

        if(column.circlesOn){
            _createCircleStyle(this,v);
            return v.column.alignStyle+";padding: 0px 0px; max-height:" + columnHeight+paddingHeight*2+"px;";
        }else{

            if (v.column.isHeader){
                d3.select(this).classed("headerCell",true);
            }
            return v.column.alignStyle+":left;padding:" +paddingHeight+"px "+ paddingWidth+"px;";
        }
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
        
        v.column.width = this.clientWidth;
    }
    var prevRowIndex = 0;
    function _mapDataTypes(row){

      
        var tempRowIndex = prevRowIndex;
        var columns = _arrayFields.filter(function(c){return c.visible})
        var mapped = columns.map(function(column) {
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
                val = val.toFixed(2);
                column.alignStyle = "text-align:right;"

            // Nominal Value...
            }else{
                if(!column.previousRowVal){
                    column.previousRowVal = val;
                }else if(currentlySorting.by == column && column.previousRowVal == val){
                    val = ""
                    tempRowIndex = prevRowIndex + 1;
                }else{
                    column.previousRowVal = val;
                }
                

            }
            return {column: column, value: val};
        });


        
        _setTRClassName(this,tempRowIndex);
        // row.index = 
        return mapped;
    }

    function _setTRClassName(self, tempRowIndex){
        if(paddingHeight > paddingHeightForFillColor){
            self.parentNode.classList.add("even");
            return;
        }
        // Get TR CLass
        var sibl = self.parentNode.previousSibling
        if(tempRowIndex == prevRowIndex){
            if(sibl && sibl.classList){
                if(sibl.classList[0] == "even"){
                    self.parentNode.classList.add("odd");
                }else{
                    self.parentNode.classList.add("even");
                }
                
            }else{
                // First ROW
                self.parentNode.classList.add("odd");
            }
        }else{
            self.parentNode.classList.add(sibl.classList[0]);
        }

        // SET BACKGROUND COLOR
        if(self.parentNode.classList.contains("odd")){
            self.parentNode.style.backgroundColor = "rgba(234,234,234, " + (1 - (paddingHeight / paddingHeightForFillColor))+ ")";
        }
    }

    function updateTable(){
        if (data == null)
            return

        var columns = d3.keys(data[0])

        if (sortingFunction) {
            data = data.sort(sortingFunction)
        }
        var tWrapper = d3.select("#table-wrapper");

        tWrapper.select("thead").selectAll("tr").selectAll("th").remove();
        tWrapper.select("thead").selectAll("tr").remove();

        tWrapper.select("thead")
                    .append("tr")
                    .selectAll("th")
                    .data(_arrayFields.filter(function(d){ return d.visible }))
                    .enter()
                    .append("th")
                    .attr("style", function(value){return value.alignStyle + value.padding + "padding-bottom: 10px;"})
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
                 

        tWrapper.select("tbody").selectAll("tr").remove();

        // create a row for each object in the data
         var rows = tWrapper.select("tbody").selectAll("tr")
            .data(data)
            .enter()
            .append("tr");


        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(_mapDataTypes)
            .enter()
            .append("td")
            .attr("getDims", _setDimensionsOfCell)
            // }) // sets the font style
            .html(function(d) { 
                return ObjectTypes.Quantitative == d.column.type && d.column.circlesOn ? "" : d.value
            })
            .attr("style", _styleCell)



            $(tabled3).dragtable('redraw').dragtable({persistState: _reorderColumns })
           

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
                
                _paddingEstimation(data.length);


                var newWrapper = d3.select("#main-content").append("div").attr("id","table-wrapper"),
                    newTable = newWrapper.append("table").attr("id", "generated-table"),
                    t = newTable.append("col").attr("class", "columnHover").attr("span", _arrayFields.length ),
                    thead = newTable.append("thead"),
                    tbody = newTable.append("tbody");

                tabled3 = newTable
                
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
                        

            $(tabled3).dragtable({persistState: _reorderColumns })
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
                    .attr("style", _styleCell)

                updateTable();
                return tabled3;
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
        },

        setPadding: function(padding){
            paddingHeight = padding;
            updateTable();
        },
        getPadding: function(){
            return paddingHeight;
        }
    };
});

