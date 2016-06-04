define(function () {


    var callback = function (result, fields) { console.log("no callback provided");};

    document.getElementById("fileuploadinput").addEventListener('change', function(event){
                var file = event.target.files[0]
                if (file){
                    Papa.parse(file, { header: true, complete: function(results, file) {
                        //var fields = _findFields(results.data)
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