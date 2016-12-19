$(document).ready(function($){
	
    var crotation;
    var rotateto = 0;
    var itemCount = $('item').length; // count of items in corousel
    var tcItemInitialRotation = 360/itemCount;
    var tcZDistance = 150;
    init()
    function init(){
    	var screenWid = window.screen.width;
    	var screenHei = window.screen.height;
//  	404 583
    	var r = screenHei/780;
    	setTimeout(function(){
    		var r = $("#rightBk").width()/340;
    		var t = $("#carousel").height()*r/2;
    		$("#carousel").css("-webkit-transform","scale(" + r + ")"); 
			$("#carousel").css({"right":20-340*(1-r)/2+"px"});
			
    	},100);
    	
		
    }
    
    $('item').each( function(index) {
                   
        $(this).css({
            'transform' : 'rotateY('+( tcItemInitialRotation * index )+'deg) translateZ('+tcZDistance+'px)'
        }).attr('tc-rotation', ( tcItemInitialRotation * index ) );

    });
    
    function tcRotate(tcdeg){
        $('#container').css({
            'transform'         : 'rotateY('+ tcdeg +'deg)',
            '-ms-transform'     : 'rotateY('+ tcdeg +'deg)',
            '-webkit-transform' : 'rotateY('+ tcdeg +'deg)'
        });
    }
    setInterval(function(){
        rotateto -= tcItemInitialRotation;
        tcRotate(rotateto);
    },2000)

});
