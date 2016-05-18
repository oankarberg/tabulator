
define(function () {
    var fields;


    var ObjectTypes = {nominal: "Nominal",
                        quantitative: "Quantitative",
                        ordinal: "Ordinal",
                        interval: "Interval"};

    var heightForCell = {};
    var widthForCell = {};

    var circlesOn = {};


    var maximumDecimals = {};
    var maxColumn = {};
    var minColumn = {};
    var data = null;
    var table;
    var sortingFunction = null;
    var currentlySorting = {by: "", order: ""};

    //find fields
    function _findFields(data){
        var names = d3.keys(data[0])
        var fields = [];
        names.forEach(function (name){
            var type = ObjectTypes.nominal;
            if (Number(data[0][name]))
                type = ObjectTypes.quantitative;
            fields.push({ name: name, type: type});
        });
        return fields;
    }

 
 //Draw the Ellipse



    function _sortBy (column, order) {
            if (column != null && order != null){
                if (order == "ascending"){
                    currentlySorting.by = column
                    currentlySorting.order = order
                    sortingFunction = function (a,b) { 
                                                    return d3.ascending(a[column], b[column])};
                }else if (order =="descending"){
                    currentlySorting.by = column
                    currentlySorting.order = order
                    sortingFunction = function (a,b) { return d3.descending(a[column], b[column])};
                }
            }
            updateTable()
        }

    function _appendCircleForNumbers(v){
        
        

        if(circlesOn[v.column]){
            console.log('circles ', circlesOn)
            d3.select(this).append("svg")
            .attr("width", widthForCell[v] + "px")
            .attr("height", heightForCell[v] + "px")
            .append("circle")
            .attr("cx", widthForCell[v] / 2 + "px")
            .attr("cy", heightForCell[v] / 2  + "px")
            .attr("r", function(d){ 

                var max = maxColumn[d.column] +  Math.abs(minColumn[v.column])
                var x = Math.abs(d.value - minColumn[d.column] ) / max  *  (heightForCell[v] / 2)
                return x;
            })
            
        }else{
            if(v.datatype == ObjectTypes.quantitative){
                return "text-align:right;"
            //     this.value = Number(v.value).toFixed(maximumDecimals[v.column]);
            //     this.innerHtml = this.value
            //     console.log(' ',this.innerHtml, Number(this.value).toFixed(maximumDecimals[v.column]) )
            }
            
        }


        
        return "font-family: 'Gill Sans', 'Gill Sans MT', Calibri, sans-serif;"
    }

    var countDecimals = function(value) {
        if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
        return 0;
    }
    
    function _toggleCircles(column){
        circlesOn[column.name] = circlesOn[column.name] ? false : true
        updateTable();
    }
    function setDimensionsOfCell(column){
        console.log('clienHesight ',this.clientWidth)
        heightForCell[column] =  this.clientHeight - 5
        widthForCell[column] = this.clientWidth 
    }
    function _mapDataTypes(row){
        var columns = d3.keys(data[0])
        return columns.map(function(column) {
            var val =  row[column];
            var datatype;
            if(Number(val)){
                val = Number(val)
                if(maxColumn[column] < Number(val)){maxColumn[column] = val}
                if(minColumn[column] > Number(val)){minColumn[column] = val}
                if(maximumDecimals[column] < countDecimals(val)){maximumDecimals[column] = countDecimals(val)}

                datatype = ObjectTypes.quantitative;
                // GENERATE MANY DECIMALS
                row[column] = Number(row[column]).toFixed(maximumDecimals[column])
            }else{
                datatype = ObjectTypes.nominal;
            }
            return {column: column, value: row[column], datatype: datatype};
        });
    }
    function updateTable(){
        if (data == null)
            return

        var columns = d3.keys(data[0])

        if (sortingFunction) {
            data = data.sort(sortingFunction)
        }

        d3.select(".tbody").selectAll(".div-td").remove();

        // create a row for each object in the data
         var rows = d3.select(".tbody").selectAll("div-tr")
                    .data(data)
                    .enter()
                    .append("div").attr("class", "div-tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(_mapDataTypes)
            .enter()
            .append("div").attr("class", "div-td")
            .html(function(d) { 
                return ObjectTypes.quantitative == d.datatype && circlesOn[d.column] ? "" : d.value
            })
            .attr("style", _appendCircleForNumbers)
            


    }
    
    return {
        initData: function (file, cb) {
            // Get the data
            d3.csv(file, function(error, newData) {
                // render the table
                data = newData
                fields = _findFields(data);
                var peopleTable = createTable(data);
                cb(data, fields);
            });

            // The table generation function

            function createTable(data) {
                var columns = d3.keys(data[0])
                

                var newTable = d3.select("body").append("div").attr("class","mainTable"),
                    // thead = newTable.append("div").attr("class","thead"),
                    tbody = newTable.append("div").attr("class", "tbody");


                table = newTable
                // append the header row
                tbody.append("div").attr("class", "div-tr")
                    .selectAll("th")
                    .data(columns)
                    .enter()
                    .append("div").attr("class", "div-th")
                    
                    .html(function(column) { maxColumn[column] = 0; 
                                            minColumn[column] = 0;
                                            maximumDecimals[column] = 0; 
                                            return column; })
                    .on("click", function(d) {
                        var arrowToBeRemoved = document.getElementById("arrow");
                        if(arrowToBeRemoved){arrowToBeRemoved.parentNode.removeChild(arrowToBeRemoved)}
                        var span = document.createElement("span");
                        var img = document.createElement("img");
                        span.id = "arrow";
                        if ((currentlySorting.by) == d){
                            if (currentlySorting.order == "ascending"){
                                _sortBy(d, "descending");
                                img.src = "/svg/arrow_down.png";
                                span.appendChild(img)
                                this.appendChild(span);
                            }else{
                                img.src = "/svg/arrow_up.png";
                                span.appendChild(img)
                                this.appendChild(span);
                                _sortBy(d, "ascending");
                            }
                        }else{            
                            img.src = "/svg/arrow_up.png";
                            span.appendChild(img)
                            this.appendChild(span);
                            _sortBy(d, "ascending");
                        }
                    })
                    

                // create a row for each object in the data
                var rows = tbody.selectAll("div-tr")
                    .data(data)
                    .enter()
                    .append("div").attr("class", "div-tr");

                
                // create a cell in each row for each column
                var cells = rows.selectAll("td")
                    .data(_mapDataTypes)
                    .enter()
                    .append("div").attr("class","div-td")
                    .html(function(d) { 
                        return ObjectTypes.quantitative == d.datatype && circlesOn[d.column] ? "" : d.value
                    })
                    .attr("style", _appendCircleForNumbers)
                    .attr("getDims",setDimensionsOfCell)

                        

                
                updateTable();
                return table;
            }

        },
        sortBy: function (column, order) {
            _sortBy(column,order)
        },
        toggleCircles: function(column){
            _toggleCircles(column)
        }

    };
});

