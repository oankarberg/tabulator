
define(function (require) {
 
  function ConvertToImage(fileName) {
        // var oldWidth = $("#generated-table").width();
        // var oldHeight = $("#generated-table").height();
        // console.log('old height ', oldHeight)
        // var scaledElement = $("#generated-table").css({
        //     'transform': 'scale(3,3)',
        //     '-ms-transform': 'scale(3,3)',
        //     '-webkit-transform': 'scale(3,3)',
        //     // 'width': oldWidth * 3 + 'px',
        //     // 'heigh': oldHeight * 3 + 'px'
        // }).addClass("scaled-element");
        // console.log('scaledElement ',scaledElement)
        // var oldWidth = scaledElement.width();
        // var oldHeight = scaledElement.height();

        // var newWidth = oldWidth / 3;
        // var newHeight = oldHeight / 3

        // $("body").append(scaledElement); // add the element to body

        html2canvas($("#table-wrapper"), {
          onrendered: function(canvas) {
            //scale back your element
            
              // canvas is the final rendered <canvas> element
              var myImage = canvas.toDataURL("image/png");
              // window.open(myImage);
              // document.write('<img src="'+myImage+'"/>');

              var link = document.createElement('a');
              link.href = myImage;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              var w=window.open();
              // document.location.pathname  = myImage;
            // w.document.write("<h3 style='text-align:center;'>"+"ReportTitle"+"</h3>");
              w.document.write("<img src='"+myImage+"' />");
            // w.print();
            // scaledElement.css({
            // 'transform': '',
            // '-ms-transform': '',
            // '-webkit-transform': '' });
            // scaledElement.remove(); // removed when rendering is done

          }

          
        });
        
      }
  return{
    saveToImage: function(fileName){

      ConvertToImage(fileName);
      
    }
  }
  
    

});