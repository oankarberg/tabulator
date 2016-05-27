define(function () {




    var ObjectTypes = {nominal: "Nominal",
                        quantitative: "Quantitative",
                        ordinal: "Ordinal",
                        interval: "Interval"};
    /*
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
    }*/

    var callback = function (result, fields) { console.log("no callback provided");};

    document.getElementById("fileuploadinput").addEventListener('change', function(event){
                var file = event.target.files[0]
                if (file){
                    Papa.parse(file, { header: true, complete: function(results, file) {
                        //var fields = _findFields(results.data)
                        document.getElementById("file-upload").style.float = "right"
                        callback(results.data)
                    }})
                }else{

                }
            });
    function getDefaultCSV(filename){
        d3.csv("csvfiles/" + filename + ".csv", function(error, data) {
            document.getElementById("file-upload").style.float = "right"
            callback(data);
        });
    }
    var defaultCSVFileButtons = document.querySelectorAll('.selectDefaultFile');
    for(var i = 0; i < defaultCSVFileButtons.length; i++){
        var button = defaultCSVFileButtons[i];
        console.log()
        button.addEventListener("click", function(){
            getDefaultCSV(this.innerHTML)})
    };
    //
    return {

        setFileCallback: function(cb){
            callback = cb;
        }
    }

});