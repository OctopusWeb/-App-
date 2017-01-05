var cache = {};

$(document).ready(function () {

    cache.w = $(window).width();
    cache.h = $(window).height();

    $(".loadingText").css("font-size", cache.h / 8);
    $(".loadingText").css("left", (cache.w - $(".loadingText").width()) / 2);
    $(".loadingText").css("top", (cache.h - $(".loadingText").height()) / 2);


    loadData();

});

function loadData() {
    var url = "http://120.92.4.46:8080/from/headPageApi/headPage.do";
    url = "./data/headpage.do.json";
    $.getJSON(url, function (json) {


        loadVideo(json.data.videoHallList);
        // loadPlay(json.data.playBillList);
        console.log(json)

        loadComplete();
    });
};

function loadVideo(list) {


    var r = $("#rightBk").width() / 340;
    var s = $("#rightBk").height();
    var t = $("#carousel").height() * r / 2;
    $("#carousel").css("-webkit-transform", "scale(" + r + ")");
    $("#carousel").css({"right": 20 - 340 * (1 - r) / 2 + "px"});
    $("#leftBk").css("-webkit-transform", "scale(" + $("#wrap").height() / 1400 + ")");
    $("#leftTitle").css("-webkit-transform", "scale(" + $("#wrap").height() / 1400 + ")");

    cache.videoArr = [];
    for (var i = 0; i < list.length; i++) {

        var item = list[i];

        $("#container").append('<item><img src="' + item.pic + '"></item>')
        cache.videoArr.push(item);
    }
    var itemCount = $('item').length;
    var tcItemInitialRotation = 360 / itemCount;
    var tcZDistance = 150;
    $('item').each(function (index) {
        $(this).css({
            'transform': 'rotateY(' + ( tcItemInitialRotation * index ) + 'deg) translateZ(' + tcZDistance + 'px)'
        }).attr('tc-rotation', ( tcItemInitialRotation * index ));

    });
    var rotateto = 0;
    autoTime = setInterval(function () {
        //   num++;
        // num == 6 ? num = 0 : num = num;
        rotateto -= tcItemInitialRotation;
        tcRotate(rotateto);
    }, 5000);
}

function tcRotate(tcdeg) {
    $('#container').css({
        'transform': 'rotateY(' + tcdeg + 'deg)',
        '-ms-transform': 'rotateY(' + tcdeg + 'deg)',
        '-webkit-transform': 'rotateY(' + tcdeg + 'deg)'
    });
}

function loadPlay(list) {
    cache.playArr = [];
    for (var i = 0; i < list.length; i++) {
        cache.playArr.push(list[i]);
    }
}

function loadComplete() {
    $(".loadingText").remove();
    $("#wrap").animate({"right": "0%"});
}

function loadModel() {


    var container = document.createElement('div');
    document.getElementById("leftBk").appendChild(container);
    //
    var camera = new THREE.PerspectiveCamera(45, 1800 / 1700, 1, 12000);
    camera.fov = 135;
    camera.updateProjectionMatrix();
    // scene
    var scene = new THREE.Scene();
    var ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);
    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);
    // texture
};