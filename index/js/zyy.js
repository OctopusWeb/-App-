$(document).ready(function ($) 
{
    var assets = {};
    var num = 0;
    var playNum = 0;
    var navNum = 0;
    var r;
    var bannerTime;
    var autoTime;
    var videoArr = [];
    var playArr = [];
    var picAll = 0;
    var itemCount = $('item').length;
    var tcItemInitialRotation = 360 / itemCount;
    
    
    //=========================
    var screenObj;//大屏对象
    var manager;
    var updateOffsetFlag=false;//更新纹理偏移量的标志位
    var animationCount=0;//纹理偏移量
    var newScreenTex;//新的纹理对象
    var firstPicPath;
    //==================
    
    $("#wrap").animate({"right": "0%"});
    $("#carousel").swipe({
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == "left") {
                num++
                num == 6 ? num = 0 : num = num;
                rotateto -= tcItemInitialRotation;
                tcRotate(rotateto);
            } else if (direction == "right") {
                num--;
                num == -1 ? num = 5 : num = num;
                rotateto += tcItemInitialRotation;
                tcRotate(rotateto);
            } else if (!direction) {
                console.log(videoArr[num]);
                if (typeof videoHallClick == "undefined") {
                    console.log("并没有找到videoHallClick方法")
                } else {
                    videoHallClick(videoArr[num].auditoriumId, videoArr[num].loadType, videoArr[num].loadUrl);
                }
            }
            window.clearInterval(autoTime);
            autoTime = setInterval(function () {
                num++;
                num == 6 ? num = 0 : num = num;
                rotateto -= tcItemInitialRotation;
                tcRotate(rotateto);
            }, 5000);
        },
        threshold: 0
    });
    $("#leftEvent").swipe({
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == "left") {
                playNum++
                playNum == picAll ? playNum = 0 : playNum = playNum;
                titleChange(playNum, "up");
            } else if (direction == "right") {
                playNum--;
                playNum == -1 ? playNum = picAll - 1 : playNum = playNum;
                titleChange(playNum, "down");
            } else if (!direction) {
                if (typeof playBillClick == "undefined") {
                    console.log("并没有找到playBillClick方法")
                } else {
                    playBillClick(playArr[playNum].auditoriumId, playArr[playNum].playArr, videoArr[playNum].loadUrl);
                }
            }
        },
        threshold: 0
    });
    $(".closed").on("click", function () {
        $("#iframB").animate({"top": "100%"})
    })
    $("body").on("click", function (e) {
        e.stopPropagation()
        navNum = 0;
        $("#menu").animate({"right": "0%"})
    })
    $(".search").on("click", function () {
        if (typeof searchClick == "undefined") {
            console.log("并没有找到searchClick方法")
        } else {
            searchClick();
        }

    })
    $(".person").on("click", function () {
        if (typeof userCentetClick == "undefined") {
            console.log("并没有找到userCentetClick方法")
        } else {
            userCentetClick();
        }

    })
    $(".menu").on("click", function () {
        if (typeof mobileMovieClick == "undefined") {
            console.log("并没有找到mobileMovieClick方法")
        } else {
            mobileMovieClick();
        }

    })
    var crotation;
    var rotateto = 0;
    
    var tcZDistance = 150;
    init()
    function init() 
    {
        var screenWid = window.screen.width;
        var screenHei = window.screen.height;
        var r = screenHei / 780;
        setTimeout(function () {
            r = $("#rightBk").width() / 340;
            var s = $("#rightBk").height();
            var t = $("#carousel").height() * r / 2;
            $("#carousel").css("-webkit-transform", "scale(" + r + ")");
            $("#carousel").css({"right": 20 - 340 * (1 - r) / 2 + "px"});
            $("#leftBk").css("-webkit-transform", "scale(" + $("#wrap").height() / 1400 + ")");
            $("#leftTitle").css("-webkit-transform", "scale(" + $("#wrap").height() / 1400 + ")");
        }, 1);

    }


    $('item').each(function (index) {
        $(this).css({
            'transform': 'rotateY(' + ( tcItemInitialRotation * index ) + 'deg) translateZ(' + tcZDistance + 'px)'
        }).attr('tc-rotation', ( tcItemInitialRotation * index ));

    });

    function tcRotate(tcdeg) {
        $('#container').css({
            'transform': 'rotateY(' + tcdeg + 'deg)',
            '-ms-transform': 'rotateY(' + tcdeg + 'deg)',
            '-webkit-transform': 'rotateY(' + tcdeg + 'deg)'
        });
    }

    autoTime = setInterval(function () {
        num++;
        num == 6 ? num = 0 : num = num;
        rotateto -= tcItemInitialRotation;
        tcRotate(rotateto);
    }, 5000);
    setInterval(function () {
        navNum++;
        if (navNum == 5) {
            $("#menu").animate({"right": "-20%"})
        }
    }, 1000)



    var container;
    var camera, scene, renderer;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = 500;
    var windowHalfY = 350;
    
    /**
     * parse json
     */
    $.getJSON("http://120.92.4.46:8080/from/headPageApi/headPage.do", function (json) {
        videoImage(json, function () {
            $("#leftTitle h3").html(playArr[0].title);
        })
        cacheImages(json, function () {
            initScene();
            animate();
        });
    });

    function videoImage(json, onComplete) {
        for (var i = 0; i < json.data.videoHallList.length; i++) {
            $("#container img").eq(i).attr({"src": json.data.videoHallList[i].pic});
            videoArr.push(json.data.videoHallList[i]);
        }
        for (var i = 0; i < json.data.playBillList.length; i++) {
            playArr.push(json.data.playBillList[i]);
        }
        onComplete()
    }

    //cache images
    function cacheImages(json, onComplete) {
        picAll = json.data.playBillList.length;
        var index = "";
        for (var i = 0; i < picAll; i++) {
            index += '<div class="bar-bk"></div>';
        }
        $(".bar").html(index);
        $(".bar .bar-bk").eq(0).addClass("selected");
        $(".bar .bar-bk").css({"width": 50 / (picAll - 1) - 2 + "%"});
        
        var urls = [];
        $.each(json.data.playBillList, function () {
            urls.push(this.pic);
        });
        firstPicPath=json.data.playBillList[0].pic;
        var cachedImages = [];
        cacheImage(0);

        function cacheImage(idx) {
            if (idx == urls.length)return allComplete();
            var img = new Image();
            img.crossOrigin = "anynonus";
            img.onload = function () {
                cachedImages.push(img);
                cacheImage(idx + 1);
            }
            img.src = urls[idx];
            //img.src = "https://yweb0.cnliveimg.com/img/CMCC_MOVIE/622079536_336_220.jpg";
        }

        function allComplete() {
            assets.cachedImages = cachedImages;
            onComplete();
        }
    }


    function initScene() {
        container = document.createElement('div');
        document.getElementById("leftBk").appendChild(container);
        
        /**
         * camera set 
         */
        camera = new THREE.PerspectiveCamera(45, 1800 / 1700, 1, 12000);
        camera.fov = 135;
        camera.updateProjectionMatrix();
        
        /**
         * scene
         */
        scene = new THREE.Scene();
        var ambient = new THREE.AmbientLight(0x101030);
        scene.add(ambient);
        var directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);
        
        
		/**
		 * texture and model
		 */
        manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) {
        };				
        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
            }
        };
        var onError = function (xhr) {
        };

        /**
         * screen bg model
         */
        //load texture 
        var textureBG = new THREE.Texture();
        var loader = new THREE.ImageLoader(manager);
        loader.load('img/wallBk.jpg', function (image) {
            textureBG.image = image;
            textureBG.needsUpdate = true;
        });
        //load obj
        var loader = new THREE.OBJLoader(manager);
        loader.load('img/DaPingDi.obj', function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = textureBG;
                }
            });
            object.position.y = -1200;
            object.position.x = 4000;
            scene.add(object);
        }, onProgress, onError);
 
 
        /**
         * screen model
         */
        //load texture
		var screenTex = new THREE.Texture();
		var loader = new THREE.ImageLoader( manager );
		loader.load( firstPicPath, function ( image ) {

			screenTex.image = image;
			screenTex.needsUpdate = true;
			
		} );
        //load obj
        var loader = new THREE.OBJLoader(manager);
        loader.load('img/Daping.obj', function (object) {
        	
        	screenObj=object;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = screenTex;
                }
            });
            object.position.y = -1180;
            object.position.x = 4000;
            scene.add(object);
        }, onProgress, onError);


		/**
		 * render
		 */
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(2000, 1400);
        container.appendChild(renderer.domElement);
    }
	var icon=false;//left
    function titleChange(data, type) {
        window.clearInterval(bannerTime);
        $(".bar-bk").removeClass("selected");
        $(".bar-bk").eq(data).addClass("selected");
        $("#leftTitle h3").html(playArr[data].title);

        if (type == "up") {
        	
			var pre = (data - 1 + picAll) % picAll;
			var aim = data;
			updateTexture(pre,aim);
			icon=false;
//			updateOffsetFlag=true;
			
       	} else if (type == "down") {
       		
       		var pre = (data + 1) % picAll;
			var aim = data;
			updateTexture(aim,pre);
			
			icon=true;
        }

   	}

    function canvasPic() {
        var c = document.getElementById("myCanvas");
        var cxt = c.getContext("2d");
        var img = new Image()
        img.src = "img/banner.jpg"
        cxt.drawImage(img, 0, 0);
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;
    }

    function animate() {
        window.requestAnimationFrame(animate);
        render();
    }

    function render() 
    {	
		if(updateOffsetFlag)
    	{	
    		animationCount+=1;
    		if(!icon)//left
    		{	    		
	    		newScreenTex.offset = new THREE.Vector2(animationCount/100, 0);
	    		
    		}else{
	    		newScreenTex.offset = new THREE.Vector2(0.5-animationCount/100, 0);	    		
    		}
			if(animationCount==50)
    		{
    			updateOffsetFlag=false;
    			animationCount=0;
    		}
    	}

    	camera.lookAt(new THREE.Vector3());
	    renderer.render(scene, camera);

    }

    //create concat big image
    function getConcatImage(pre,aim) 
    {
        var canvas = $("<canvas>");
        canvas.get(0).width = 1024*2;
        canvas.get(0).height = 512;
        var ctx = canvas.get(0).getContext('2d');
         
        drawImage(assets.cachedImages[pre],0,0);
		drawImage(assets.cachedImages[aim],1024,0);
 


        function drawImage(image,x,y) {
            ctx.drawImage(image, x,y,1024,512);
        }

        return canvas.get(0).toDataURL();
    }
    
	function newTexture(pre,aim)
	{
		var updateScreenTexture = new THREE.Texture();
		var loader = new THREE.ImageLoader(manager);
        loader.load(getConcatImage(pre,aim), function (image) {
            updateScreenTexture.image = image;
            updateScreenTexture.needsUpdate = true;
            if(!icon)
            {
            	updateScreenTexture.offset = new THREE.Vector2(0, 0);
            }else{
            	updateScreenTexture.offset = new THREE.Vector2(0.5, 0);
            }
            
            updateScreenTexture.repeat.set(0.5, 1);

        });
        return updateScreenTexture;
	}

	function updateTexture(pre,aim) 
	{
		newScreenTex=newTexture(pre,aim);
       	updateOffsetFlag=true;
	    screenObj.traverse( function ( child ) {
	     	if (child instanceof THREE.Mesh) {
	          //create a global var to reference later when changing textures
	          child;
	          //apply texture
	          child.material.map = newScreenTex;
	          //child.material.map = THREE.ImageUtils.loadTexture(textureArray[index]);
	          child.material.needsUpdate = true;
	      	}
	    });
	}
});
