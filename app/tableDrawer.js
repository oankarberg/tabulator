
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
            var type = ObjectTypes.nominal;
            if (Number(data[0][name]))
                type = ObjectTypes.quantitative;

            maxColumn[name] = 0; 
            minColumn[name] = 0;
            maximumDecimals[name] = 0;
            
            var displayName = _formatName(name);
            fields[name] = { name: name, displayName: displayName, type: type, currentPosition: i};
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
            d3.select(this).append("svg")
            .attr("width", widthForCell[v] )
            .attr("height", heightForCell[v] )
            .append("circle")
            .attr("cx", this.clientWidth / 2 + "px")
            .attr("cy", this.clientHeight / 2 + "px")
            .attr("r", function(d){ 
                var max = maxColumn[d.column] +  Math.abs(minColumn[d.column])
                var x = Math.abs(d.value - minColumn[d.column] ) / max  * 10
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

        return "font-family: 'Gill Sans', 'Gill Sans MT', Calibri, sans-serif; text-ali"
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
    function setDimensionsOfCell(v){
        heightForCell[v] =  30
        widthForCell[v] = this.clientWidth 
        return {height: heightForCell[v], width: widthForCell[v]}
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
            return {column: column, value: row[column], datatype: datatype };
        });
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
            .data(_mapDataTypes)
            .enter()
            .append("td")
            .attr("getDims",setDimensionsOfCell)
            // }) // sets the font style
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
                    .append("span")
                        .text(function(column) {
                                                return fields[column].displayName; })
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
                                    this.appendChild(img);
                                }else{
                                    img.src = "/svg/arrow_up.png";
                                    this.appendChild(img);
                                    _sortBy(d, "ascending");
                                }
                            }else{            
                                img.src = "/svg/arrow_up.png";
                                this.appendChild(img);
                                _sortBy(d, "ascending");
                            }
                        });

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
                    .attr("getDims",setDimensionsOfCell)
                    // }) // sets the font style
                    .html(function(d) { 
                        return ObjectTypes.quantitative == d.datatype && circlesOn ? "" : d.value
                    })
                    .attr("style", _appendCircleForNumbers)

                        

                
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

