
define(function () {

    var ObjectTypes = {nominal: "Nominal",
                        quantitative: "Quantitative",
                        ordinal: "Ordinal",
                        interval: "Interval"};
    return {
        initData: function () {


            // Get the data
            d3.csv("sample_data_sales.csv", function(error, data) {
        

                // render the table
                 var headerNames = d3.keys(data[0]);
                 var peopleTable = tabulate(data, headerNames);
                 

            });
            // The table generation function
            function tabulate(data, columns) {
                var max = {};
                var table = d3.select("body").append("table"),
                    thead = table.append("thead"),
                    tbody = table.append("tbody");

                // append the header row
                thead.append("tr")
                    .selectAll("th")
                    .data(columns)
                    .enter()
                    .append("th")
                        .text(function(column) { max[column] = 0; 
                                                return column; });

                // create a row for each object in the data
                var rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr");

                
                // create a cell in each row for each column
                var cells = rows.selectAll("td")
                    .data(function(row) {
                        return columns.map(function(column) {
                            var val =  row[column];
                            var datatype;
                            if(Number(val)){
                                if(max[column] < Number(val)){max[column]  = val}
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
                        if(v.datatype == ObjectTypes.quantitative){
                            this.style.background = "green;"
                            var x = Math.abs(v.value) / max[v.column] * 30 + "px";
                            var y = Math.abs(v.value) / max[v.column] * 30 + "px";
                            return "margin-left: auto; margin-right: auto;position: relative;background: green; border-radius: 50%;height: "+y+"; width:" + x +";";
                        }else{
                            return "font-family: Courier;";
                        }
                      


                      
                    }) // sets the font style

                    .html(function(d) { return ObjectTypes.quantitative == d.datatype ? "" : d.value});
                
                return table;
            }

        }
    };
});

