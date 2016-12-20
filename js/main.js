$(document).ready(function($){
	var num=0;
	$("#wrap").animate({"right":"0%"});
	$("#carousel").swipe( {
	    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
	    
	      if(direction == "left"){
	      	num++
	      	num==7?num=0:num=num;
	      	rotateto -= tcItemInitialRotation;
        	tcRotate(rotateto);
	      }else if(direction == "right"){
	      	num--;
	      	num==-1?num=6:num=num;
	      	rotateto += tcItemInitialRotation;
        	tcRotate(rotateto);
	      }else if(!direction){
	      	alert(num);
	      }
	    },
	     threshold:0
	  });
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
    		var s = $("#rightBk").height();
    		var t = $("#carousel").height()*r/2;
    		$("#carousel").css("-webkit-transform","scale(" + r + ")"); 
			$("#carousel").css({"right":20-340*(1-r)/2+"px"});
			$("#carousel").css({"top":20*r+"%"});
			$("#carousel").css({"margin-top":s/4.5+"px"});
			
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
    setInterval(function(){
    	num++;
    	num==7?num=0:num=num;
        rotateto -= tcItemInitialRotation;
        tcRotate(rotateto);
    },5000)


	var container;
	var camera, scene, renderer;
	var mouseX = 0, mouseY = 0;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	init1();
	animate();
	function init1() {
		container = document.createElement( 'div' );
		document.getElementById("leftBk").appendChild( container );
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
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
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};
		var texture = new THREE.Texture();
		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};
		var onError = function ( xhr ) {
		};
		var loader = new THREE.ImageLoader( manager );
		loader.load( 'img/banner.jpg', function ( image ) {
			texture.image = image;
			texture.needsUpdate = true;
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
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );
		//
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
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	function render() {
		camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 0;
        camera.up.x = 0;
        camera.up.y = 1; //相机朝向--相机上方为y轴
        camera.up.z = 0;
        camera.lookAt({  //相机的中心点
              x : 0,
              y : 0,
              z : 0
          });
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
	}
});
