$(document).ready(function ($) {
    var assets = {};
    var num = 0;
    var playNum = 0;
    var navNum = 0;
    var r;
    var offsetX = 0;
    var texture;
    var bannerTime;
    var autoTime;
    var videoArr = [];
    var playArr = [];
    var picAll = 0;
    $("#wrap").animate({"right": "0%"});
    /*$("#carousel").swipe({
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
     });*/
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
    var itemCount = $('item').length;
    var tcItemInitialRotation = 360 / itemCount;
    var tcZDistance = 150;
    init()
    function init() {
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
    var url = "http://120.92.4.46:8080/from/headPageApi/headPage.do";
    url = "./data/headPage.do.json";
    $.getJSON(url, function (json) {
        videoImage(json, function () {
            $("#leftTitle h3").html(playArr[0].title);
        })

        cacheImages(json, function () {

            init1();
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
        var cachedImages = [];
        cacheImage(0);

        function cacheImage(idx) {
            try {

                if (idx == urls.length)return allComplete();
                var img = new Image();
                img.crossOrigin = "anynonus";

                img.onload = function () {
                    cachedImages.push(img);
                    // alert( urls[idx]);
                    cacheImage(idx + 1);
                }

                img.src = urls[idx];

            }
            catch (e) {
                alert(e.message)
            }

            //img.src = "https://yweb0.cnliveimg.com/img/CMCC_MOVIE/622079536_336_220.jpg";
        }

        function allComplete() {

            assets.cachedImages = cachedImages;
            onComplete();
        }
    }

    //create concat big image
    function getConcatImage() {
        var canvas = $("<canvas>");
        var drawArr = assets.cachedImages.concat();
        drawArr.push(assets.cachedImages[0]);
        drawArr.unshift(assets.cachedImages[assets.cachedImages.length - 1]);
        var len = drawArr.length;
        canvas.get(0).width = 1024 * len;
        canvas.get(0).height = 512;
        var ctx = canvas.get(0).getContext('2d');
        for (var i = 0; i < len; i++) {
            drawImage(drawArr[i], i, 1024, 512);
        }

        function drawImage(image, idx) {
            var tx = 1024 * idx;
            ctx.drawImage(image, tx, 0, 1024, 512);
        }

        return canvas.get(0).toDataURL();
    }


    function init1() {

        container = document.createElement('div');
        document.getElementById("leftBk").appendChild(container);
        camera = new THREE.PerspectiveCamera(45, 1800 / 1700, 1, 12000);
        camera.fov = 135;
        camera.updateProjectionMatrix();
        // scene
        scene = new THREE.Scene();
        var ambient = new THREE.AmbientLight(0x101030);
        scene.add(ambient);
        var directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1);
        scene.add(directionalLight);
        // texture
        manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) {
        };
        texture = new THREE.Texture();
        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
            }
        };
        var onError = function (xhr) {
        };
        var loader = new THREE.ImageLoader(manager);
        loader.load(getConcatImage(), function (image) {

            texture.image = image;
            texture.needsUpdate = true;
            texture.offset = new THREE.Vector2(1 / (picAll + 2), 0);
            texture.repeat.set(1 / (picAll + 2), 1);

        });

        // model
        var texture1 = new THREE.Texture();
        var loader = new THREE.OBJLoader(manager);
        loader.load('img/DaPingDi.obj', function (object) {
            object.traverse(function (child) {
                console.log(child)
                if (child instanceof THREE.Mesh) {
                    console.log(child.material)
                    child.material.map = texture1;
                }
            });
            object.position.y = -1200;
            object.position.x = 4000;
            scene.add(object);
        }, onProgress, onError);


        var loader = new THREE.ImageLoader(manager);
        loader.load('img/wallBk2.jpg', function (image) {
            texture1.image = image;
            texture1.needsUpdate = true;
        });
        //model
        var loader = new THREE.OBJLoader(manager);
        loader.load('img/Daping.obj', function (object) {

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            });
            object.position.y = -1180;
            object.position.x = 4000;
            scene.add(object);
        }, onProgress, onError);

//		var loader = new THREE.FBXLoader( manager );
//		loader.load( 'img/BeiMian.FBX', function( object ) {
//			object.traverse( function( child ) {
//				if ( child instanceof THREE.Mesh ) {
//					// pass
//				}
//				if ( child instanceof THREE.SkinnedMesh ) {
//					if ( child.geometry.animations !== undefined || child.geometry.morphAnimations !== undefined ) {
//						child.mixer = new THREE.AnimationMixer( child );
//						mixers.push( child.mixer );
//						var action = child.mixer.clipAction( child.geometry.animations[ 0 ] );
//						action.play();
//					}
//				}
//			} );
//			scene.add( object );
//		}, onProgress, onError );

        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(2000, 1400);
        container.appendChild(renderer.domElement);

        //
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

    //

    var state = "";

    function titleChange(data, type) {
        window.clearInterval(bannerTime);
        $(".bar-bk").removeClass("selected");
        $(".bar-bk").eq(data).addClass("selected");
        $("#leftTitle h3").html(playArr[data].title);
        state = type;
        if (type == "up") {
            offsetX = 1 / (picAll + 2) * (data);

        } else if (type == "down") {
            offsetX = 1 / (picAll + 2) * (data + 2);

        }

    }


    function animate() {
        window.requestAnimationFrame(animate);
        render();
    }

    function render() {

        if (state == "down") {
            offsetX -= 0.01;
        }
       else  if (state == "up") {
            offsetX += 0.01;
        }



        texture.offset = new THREE.Vector2(offsetX, 0);
        camera.lookAt(new THREE.Vector3());
        renderer.render(scene, camera);
    }


});
