$(document).ready(function($){
	var assets = {};
	var num=0;
	var navNum=0;
	var r;
	var offsetX=0;
	var texture;
	var bannerTime;
	var autoTime;
	$("#wrap").animate({"right":"0%"});
	$("#carousel").swipe({
	    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
	      if(direction == "left"){
	      	num++
	      	num==6?num=0:num=num;
	      	rotateto -= tcItemInitialRotation;
        	tcRotate(rotateto);
        	titleChange(num,"up");
	      }else if(direction == "right"){
	      	num--;
	      	num==-1?num=5:num=num;
	      	rotateto += tcItemInitialRotation;
        	tcRotate(rotateto);
        	titleChange(num,"down");
	      }else if(!direction){
	      }
	      window.clearInterval(autoTime);
	      autoTime = setInterval(function(){
		    	num++;
		    	num==6?num=0:num=num;
		    	titleChange(num,"up");
		        rotateto -= tcItemInitialRotation;
		        tcRotate(rotateto);
		    },5000);
	    },
	     threshold:0
	});
	$("#leftBk").swipe( {
	    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
	      if(direction == "left"){
	      	num++
	      	num==6?num=0:num=num;
	      	rotateto -= tcItemInitialRotation;
        	tcRotate(rotateto);
        	titleChange(num,"up");
	      }else if(direction == "right"){
	      	num--;
	      	num==-1?num=5:num=num;
	      	rotateto += tcItemInitialRotation;
        	tcRotate(rotateto);
        	titleChange(num,"down");
	      }else if(!direction){
	      	navNum=0;
	      	$("#menu").animate({"right":"0%"})
	      }
	        window.clearInterval(autoTime);
	        autoTime = setInterval(function(){
		    	num++;
		    	num==6?num=0:num=num;
		    	titleChange(num,"up");
		        rotateto -= tcItemInitialRotation;
		        tcRotate(rotateto);
		    },5000);
	      
	    },
	     threshold:0
	});
	$(".closed").on("click",function(){
		$("#iframB").animate({"top":"100%"})
	})
    var crotation;
    var rotateto = 0;
    var itemCount = $('item').length; 
    var tcItemInitialRotation = 360/itemCount;
    var tcZDistance = 150;
    init()
    function init(){
    	var screenWid = window.screen.width;
    	var screenHei = window.screen.height;
//  	404 583
    	var r = screenHei/780;
    	setTimeout(function(){
    		r = $("#rightBk").width()/340;
    		var s = $("#rightBk").height();
    		var t = $("#carousel").height()*r/2;
    		$("#carousel").css("-webkit-transform","scale(" + r + ")"); 
			$("#carousel").css({"right":20-340*(1-r)/2+"px"});
			$("#leftBk").css("-webkit-transform","scale(" + $("#wrap").height()/1400 + ")");
			$("#leftTitle").css("-webkit-transform","scale(" + $("#wrap").height()/1400 + ")");			
    	},1);
		
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
    autoTime = setInterval(function(){
    	num++;
    	num==6?num=0:num=num;
    	titleChange(num,"up");
        rotateto -= tcItemInitialRotation;
        tcRotate(rotateto);
    },5000);
    setInterval(function(){
    	navNum++;
    	if(navNum == 5){
    		$("#menu").animate({"right":"-20%"})
    	}
    },1000)


	var container;
	var camera, scene, renderer;
	var mouseX = 0, mouseY = 0;
	var windowHalfX = 500;
	var windowHalfY = 350;
	$.getJSON("http://120.92.4.46:8080/from/headPageApi/headPage.do",function(json){
		cacheImages(json,function(){
			init1();
			animate();
		});
	});
	
	//cache images
	function cacheImages(json,onComplete)
	{
		var urls = [];
		$.each(json.data.playBillList, function() {
			urls.push(this.angleIcon);
		});
		var cachedImages = [];
		cacheImage(0);
		
		function cacheImage(idx)
		{
			if(idx == urls.length)return allComplete();
			var img = new Image();
			img.crossOrigin = "anynonus";
			img.onload = function()
			{
				cachedImages.push(img);
				cacheImage(idx+1);
			}
			//img.src = urls[idx];
			img.src = "img/banner.jpg";
		}
		
		function allComplete()
		{
			assets.cachedImages = cachedImages;
			onComplete();
		}
	}
	
	//create concat big image
	function getConcatImage()
	{
		var canvas = $("<canvas>");
		var drawArr = assets.cachedImages.concat();
		drawArr.push(assets.cachedImages[0]);
		drawArr.unshift(assets.cachedImages[assets.cachedImages.length-1]);
		var len = drawArr.length;
		canvas.get(0).width = 1024*len;
		canvas.get(0).height = 500;
		var ctx = canvas.get(0).getContext('2d');
		for(var i=0;i<len;i++)
		{
			drawImage(drawArr[i],i,1024,500);
		}
		
		function drawImage(image,idx)
		{
			var tx = 1024*idx;
			ctx.drawImage(image,tx,0);
		}
		return canvas.get(0).toDataURL();
	}
	
	
	function init1() {
		container = document.createElement( 'div' );
		document.getElementById("leftBk").appendChild( container );
		camera = new THREE.PerspectiveCamera( 45, 2000 /1400, 1, 12000 );
        camera.fov = 135;
        camera.updateProjectionMatrix();
		// scene
		scene = new THREE.Scene();
		var ambient = new THREE.AmbientLight( 0x101030 );
		scene.add( ambient );
		var directionalLight = new THREE.DirectionalLight( 0xffeedd );
		directionalLight.position.set( 0, 0, 1 );
		scene.add( directionalLight );
		// texture
		manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
		};
		texture = new THREE.Texture();
		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
			}
		};
		var onError = function ( xhr ) {
		};
		var loader = new THREE.ImageLoader( manager );
		loader.load(getConcatImage(), function ( image ) {
			texture.image = image;
			texture.needsUpdate = true;
			texture.offset = new THREE.Vector2(0.125,0);
			texture.repeat.set( 0.125, 1);
			
		} );
		
		// model
		var texture1 = new THREE.Texture();
		var loader = new THREE.OBJLoader( manager );
		loader.load( 'img/DaPingDi.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material.map = texture1;
				}
			} );
			object.position.y = -1200;
			object.position.x = 3700;
			scene.add( object );
		}, onProgress, onError );
		
		var loader = new THREE.ImageLoader( manager );
		loader.load( 'img/wallBk.jpg', function ( image ) {
			texture1.image = image;
			texture1.needsUpdate = true;
		} );
		// model
		var loader = new THREE.OBJLoader( manager );
		loader.load( 'img/DaPing.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material.map = texture;
				}
			} );
			object.position.y = -1180;
			object.position.x = 3700;
			scene.add( object );
		}, onProgress, onError );
		
		renderer = new THREE.WebGLRenderer({
			alpha:true,
			antialias:true
		});
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( 2000, 1400 );
		container.appendChild( renderer.domElement );
		
		//
	}
	function titleChange(data,type){
		window.clearInterval(bannerTime);
    	$(".bar-bk").removeClass("selected");
    	$(".bar-bk").eq(data).addClass("selected");
    	
    	if(type == "up"){
    		offsetX = 0.125*(data);
    		bannerTime = setInterval(function(){
				offsetX+=0.001;
				if(offsetX >= 0.125*(data+1)){
					window.clearInterval(bannerTime);
				}
				texture.offset = new THREE.Vector2(offsetX,0);
			},5)
    	}else if(type == "down"){
    		offsetX = 0.125*(data+2);
    		bannerTime = setInterval(function(){
				offsetX-=0.001;
				if(offsetX <= 0.125*(data+1)){
					window.clearInterval(bannerTime);
				}
				texture.offset = new THREE.Vector2(offsetX,0);
			},5)
    	}
		
   }
	function canvasPic(){
		var c=document.getElementById("myCanvas");
		var cxt=c.getContext("2d");
		var img=new Image()
		img.src="img/banner.jpg"
		cxt.drawImage(img,0,0);
	}
	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	function onDocumentMouseMove( event ) {
		mouseX = ( event.clientX - windowHalfX ) / 2;
		mouseY = ( event.clientY - windowHalfY ) / 2;
	}
	//
	/*
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	function render() {
		camera.lookAt(new THREE.Vector3());
		renderer.render( scene, camera );
	}
	*/
	function animate()
	{
		requestAnimationFrame(function(){
			camera.lookAt(new THREE.Vector3());
			renderer.render( scene, camera );
			requestAnimationFrame(arguments.callee);
		});
	}
});
