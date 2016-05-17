
define(function () {


    var ObjectTypes = {nominal: "Nominal",
                        quantitative: "Quantitative",
                        ordinal: "Ordinal",
                        interval: "Interval"};

    var maxColumn = {};
    var minColumn = {};
    var data = null;
    var table;
    var sortingFunction = null;
    var currentlySorting = {by: "", order: ""};


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
        
    function updateTable(){
        if (data == null)
            return

        var columns = d3.keys(data[0])

        if (sortingFunction) {
            data = data.sort(sortingFunction)
        }

        d3.select("tbody").selectAll("tr").remove();

        // create a row for each object in the data
         var rows = d3.select("tbody").selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    // Map data types
                    var val =  row[column];
                    var datatype;
                    if(Number(val)){
                        val = Number(val)
                        if(maxColumn[column] < Number(val)){maxColumn[column] = val}
                        if(minColumn[column] > Number(val)){minColumn[column] = val}
                        datatype = ObjectTypes.quantitative;
                        row[column] = Number(row[column])
                    }else{
                        datatype = ObjectTypes.nominal;
                    }
                    return {column: column, value: row[column], datatype: datatype };
                });
            })
            .enter()
            .append("td") 
            .attr("style",function(v){
                if(v.datatype == ObjectTypes.quantitative){
                    this.innerHTML = ""
                    return "font-family: Courier;text-align: center;";
                }else{
                    return "font-family: Courier;";
                }
            })
            .append("div")
            .attr("style",function(v){
                // Style circles
                if(v.datatype == ObjectTypes.quantitative){
                    this.style.background = "green;"
                    var max = maxColumn[v.column] +  Math.abs(minColumn[v.column])
                    var x = Math.abs(v.value - minColumn[v.column] ) / max  * 30 + "px";
                    var y = Math.abs(v.value - minColumn[v.column]) / max * 30 + "px";
                    return "margin-left: auto; margin-right: auto;position: relative;background: green; border-radius: 50%;height: "+y+"; width:" + x +";";
                }else{
                    return "font-family: Courier;";
                }
            }) // sets the font style
            .html(function(d) { return d.value;
                    return ObjectTypes.quantitative == d.datatype ? "" : d.value})
    }
    
    return {
        initData: function () {
            // Get the data
            d3.csv("sample_data_sales.csv", function(error, newData) {
                // render the table
                data = newData
                 var peopleTable = createTable(data);
            });

            // The table generation function

            function createTable(data) {
                var columns = d3.keys(data[0])
                
                var newTable = d3.select("body").append("table"),
                    thead = newTable.append("thead"),
                    tbody = newTable.append("tbody");

                table = newTable
                // append the header row
                thead.append("tr")
                    .selectAll("th")
                    .data(columns)
                    .enter()
                    .append("th")
                        .text(function(column) { maxColumn[column] = 0; 
                                                minColumn[column] = 0; 
                                                return column; })
                        .on("click", function(d) {
                            if ((currentlySorting.by) == d){
                                if (currentlySorting.order == "ascending")
                                _sortBy(d, "descending");
                                else
                                    _sortBy(d, "ascending");
                                }else
                                _sortBy(d, "ascending");
                        });

                // create a row for each object in the data
                var rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr");

                
                // create a cell in each row for each column
                var cells = rows.selectAll("td")
                    .data(function(row) {
                        return columns.map(function(column) {
                            // Map data types
                            var val =  row[column];
                            var datatype;
                            if(Number(val)){
                                val = Number(val)
                                if(maxColumn[column] < Number(val)){maxColumn[column]  = val }
                                if(minColumn[column] > Number(val)){minColumn[column]  = val}
                                datatype = ObjectTypes.quantitative;
                            }else{
                                datatype = ObjectTypes.nominal;
                            }
                            return {column: column, value: row[column], datatype: datatype };
                        });
                    })
                    .enter()
                    .append("td") 
                    .attr("style",function(v){
                        if(v.datatype == ObjectTypes.quantitative){
                            this.innerHTML = ""
                            return "font-family: Courier;text-align: center;";
                        }else{
                            return "font-family: Courier;";
                        }
                    })
                    .append("div")
                    .attr("style",function(v){
                        // Style circles
                        if(v.datatype == ObjectTypes.quantitative){
                            this.style.background = "green;"
                            console.log('miin ', minColumn[v.column])
                            var max = maxColumn[v.column] +  Math.abs(minColumn[v.column])
                            var x = (v.value - (minColumn[v.column]) ) / max * 30 + "px";
                            var y = (v.value - (minColumn[v.column])) / max * 30 + "px";
                            return "margin-left: auto; margin-right: auto;position: relative;background: green; border-radius: 50%;height: "+y+"; width:" + x +";";
                        }else{
                            return "font-family: Courier;";
                        }
                    }) // sets the font style
                    .html(function(d) { return ObjectTypes.quantitative == d.datatype ? "" : d.value})

                        

                
                updateTable();
                return table;
            }

        },
        sortBy: function (column, order) {
            _sortBy(column,order)
        }

    };
});

