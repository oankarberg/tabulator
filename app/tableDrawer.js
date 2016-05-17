
define(function () {
    var data = null;
    var table;
    var sortingFunction = null;
    var currentlySorting = {by: "", order: ""};

    function _sortBy (column, order) {
            if (column != null && order != null){
                if (order == "ascending"){
                    currentlySorting.by = column
                    currentlySorting.order = order
                    sortingFunction = function (a,b) { return d3.ascending(a[column], b[column])};
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
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .attr("style", "font-family: Courier") // sets the font style
                .html(function(d) { return d.value; });
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
                        .text(function(column) { return column; })
                        .on("click", function(d) {
                        if ((currentlySorting.by) == d){
                            if (currentlySorting.order == "ascending")
                                _sortBy(d, "descending");
                            else
                                _sortBy(d, "ascending");
                        }else
                            _sortBy(d, "ascending");
                     });
                
                updateTable();
                return table;
            }

        },
        sortBy: function (column, order) {
            _sortBy(column,order)
        }

    };
});

