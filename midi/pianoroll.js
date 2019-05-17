/* MIT License 2019 royalcrab *

/*
    <canvas id="roll" width="1000" height="380"></canvas>
    <script src="./roll.js"></script>

    data 変数に MIDI データを入れておく必要がある。data がなければ
    もm表示しない。ダブルクリック禁止を推奨。
    
    var data = [
    { "time": "175", "c1": "254", "c2": "0", "c3": "0"},
    { "time": "378", "c1": "254", "c2": "0", "c3": "0"},
    { "time": "580", "c1": "254", "c2": "0", "c3": "0"},
    { "time": "771", "c1": "254", "c2": "0", "c3": "0"},
    { "time": "974", "c1": "254", "c2": "0", "c3": "0"},
    null ];

    こんな感でd、time, c1, c2, c3 を要素にもつオブジェクトの配列にする。

    time は 1ms 単位で時刻を指定する。175 ということは 175ms ということ。
    SMF の表記と違って、前のノートからの差分ではなくて、絶対時刻で指定する。

    c1, c2, c3 は MIDI コマンドの 1 byte 目、2 byte 目、3 byte 目
    4byte のコマンドには対応していない (オヌニコードみたいな)

    デンプや分解能の情報はまったく拾っていない。拍子の情報もひろってない。

    表示は c1 = 0x80 と 0x90 のデータ以外はほぼ無視している。
    0x90: note on
    0x80: note off
    NOTE OF のコマンドでも、音量 0 で NOTE OFF のかわりにしてくる
    MIDI 機材もあるので、NOTE ON 0 がきたら NOTE OFF と解釈するように
    してある。

    v は HTML5.0 の video タグを指定する。下記のような感じ。

    <video id="video" width="640"><source src="piano2hh.mp4"></video>
    
    こうしておくと、指定した動画ファイルと連動して再生できるようになる。
    
    ボタン関係は、だいたい下記のようにしたら動くはず。

    <input type="button" value="再生" onClick="playVideo()">
    <input type="button" value="一時停止" onClick="pauseVideo()"> <br>
    <input type="button" value="前" onClick="downVolume()">
    <input type="button" value="後" onClick="upVolume()"> <br>
    <input type="button" value="1秒前" onClick="seekDown()">
    <input type="button" value="1秒後" onClick="seekUp()">
    <br>
    <input type="button" value="-0.1倍" onClick="fast()">
    <input type="button" value="元の速度" onClick="setSpeed(1)">
    <input type="button" value="+0.1倍" onClick="slow()">
    <br>
    <input type="button" value="縮小" onClick="scaleUp()">
    <input type="button" value="拡大" onClick="scaleDown()">
    <br>
    <input type="button" value="前譜面" onClick="pageDown()">
    <input type="button" value="次譜面" onClick="pageUp()">
    <br>
    現在（秒）：<span id="ichi">0</span><br>
    全体（秒）：<span id="nagasa"></span><br>
    再生速度  ：<span id="speed">1.0</span><br>

    基本的に、動画側のフレームを変更することで、
    ddEventListener("timeupdate", function(){});
    を呼ばせて drawRoll で譜面をお update するみたいなことをしている。
    コールバック関数で v.func みたいになってるところは、
    v が存在しないときは短にエラーになる(譜面が更新されない)。
    
    拡大縮小の機能が適当で、現在表示されている譜面の先頭の時間部分を基準に
    拡大縮小かけるようになっている。たぶん、赤い戦があるところを中心に
    拡大縮小するとか本来すべき。

    velocity を何も表示していない。

*/

var canvas;
var ctx;
var v;
var dmin = 0;
var dmax = 45000;
var songMax = 45000;
var preCurrent = 0;

const rollWidth = 900;
const keyWidth = 20;
const keyHeight = 4;
const keyOffsetLeft = 10;
const keyOffsetTop = 0;
const keyAllHeight = 400;

function init(){

    canvas = document.getElementById("roll");
    if ( ! canvas || ! canvas.getContext ) { return false; }
    ctx = canvas.getContext('2d');

    var min = 10000000;
    var max = 0;
    if ( data != null && data != undefined ){
        for ( var i in data ){
            var d = data[i];
            if ( d == null ) continue;
            if ( min > d.time ) min = d.time;
            if ( max < d.time ) max = d.time;
        }
    }
    dmin = 0;
    songMax = max + 1000;

    var changeCurrent = function(e){
        var rect = e.target.getBoundingClientRect();

        x = e.clientX - rect.left;
        y = e.clientY - rect.top;

        x -= keyOffsetLeft + keyWidth + 1;

        var seekPoint = x * (dmax - dmin) / rollWidth + dmin;
        console.log( "x, seekPoint = " +  x + "," + seekPoint );

        if ( seekPoint > songMax ) return;
        if ( v != null ){
            v.currentTime = seekPoint / 1000;
        }
        drawRoll(data, dmin, dmax, seekPoint);
    }

    // ラインを動かしたらその位置にシークする
    var isMoving = false;
    canvas.onmousedown = (function(e){
        isMoving = true;
        changeCurrent(e);
    });
    canvas.onmouseup = (function(e){
        isMoving = false;
    });
    canvas.onmouseleave = (function(e){
        isMoving = false;
    });
    canvas.onmousemove = (function(e){
        if ( isMoving == true ){
            changeCurrent(e);
        }
    });

    v = document.getElementById("video");
    drawRoll(data, dmin, dmax, 0);
}

function getDuration() {
    //動画の長さ（秒）を表示
    document.getElementById("nagasa").innerHTML = v.duration;
}

function playVideo() {
    //再生完了の表示をクリア
    document.getElementById("kanryou").innerHTML = "";
    //動画を再生
    v.play();
    //現在の再生位置（秒）を表示
    v.addEventListener("timeupdate", function(){
        document.getElementById("ichi").innerHTML = v.currentTime;
        document.getElementById("speed").innerHTML = v.playbackRate;
        drawRoll( data, dmin, dmax, v.currentTime * 1000 );
    }, false);
    //再生完了を知らせる
    v.addEventListener("ended", function(){
        document.getElementById("kanryou").innerHTML = "動画の再生が完了しました。";
    }, false);

   
}

function pauseVideo() {
    v.pause();
}

function upVolume() {
    v.currentTime += 0.03;
}

function downVolume() {
    v.currentTime -= 0.03;
}

function seekUp() {
    v.currentTime += 1;
}

function scaleUp() {
    var tmpMax = (dmax - dmin) * 2 + dmin;
    if ( tmpMax > songMax ) tmpMax = songMax;
    dmax = tmpMax;
    drawRoll(data, dmin, dmax, preCurrent);
}

function scaleDown() {
    var tmpMax = (dmax - dmin) / 2;
    if ( tmpMax < 2000 ) tmpMax = 2000;
    dmax = tmpMax + dmin;
    drawRoll(data, dmin, dmax, preCurrent);
}

function pageUp() {
    var tmp = (dmax - dmin) * 3 / 4;
    var range = dmax - dmin;
    if ( dmin + tmp + range > songMax){
        dmin = songMax - range;
        dmax = songMax;
    }else{
        dmin += tmp;
        dmax += tmp;
    }
    drawRoll(data, dmin, dmax, preCurrent);
}

function pageDown() {
    var tmp = (dmax - dmin) * 3 / 4;
    if ( dmin - tmp < 0){
        var range = dmax - dmin;
        dmin = 0;
        dmax = range;
    }else{
        dmin -= tmp;
        dmax -= tmp;
    }
    drawRoll(data, dmin, dmax, preCurrent);
}

function seekDown() {
    v.currentTime -= 1;
}

function slow() {
    v.playbackRate += 0.1;
}

function setSpeed( speed ) {
    if ( speed < 0.1 ){
        speed = 0.1;
    }
    v.playbackRate = speed;
}

function fast() {
    if ( v.playbackRate > 0.1){
        v.playbackRate -= 0.1;
    }
}



//const rollOffsetLeft = 100; // roll の左端の座標
function displayRoll( dat, dataMin, dataMax, current ){
    var rate = rollWidth / (dataMax - dataMin) ;
    // データの最小分解能

    ctx.strokeStyle = "black";
    ctx.fillStyle = "lightgreen";
    
    for( var i = 0; i < dat.length; i++ ){
        // 範囲外なら表示しない
        if ( dat[i] == null ) continue;

        var ict = parseInt(dat[i].time);
        var ic1 = parseInt(dat[i].c1);
        var ic2 = parseInt(dat[i].c2);
        var ic3 = parseInt(dat[i].c3);

        if ( ict < dataMin || ict > dataMax ) continue;

        // note on の場合は対応する note off を探す。なければとりあえず右端まで引く
        if ( ic1 == 0x90 && ic3 > 0 ){
            for( var j = i+1; j < dat.length; j++ ){

                if ( dat[j] == null ) continue;

                var jct = parseInt(dat[j].time);
                var jc1 = parseInt(dat[j].c1);
                var jc2 = parseInt(dat[j].c2);
                var jc3 = parseInt(dat[j].c3);

                if ( ( jc1 == 0x80 && jc2 == ic2 ) || 
                    (jc1 == 0x90 && jc2 == ic2 && jc3 == 0 ) ){

                    var w; 
                    if ( jct > dataMax ){
                        w = (dataMax - ict) * rate;
                    }else{
                        w = (jct - ict) * rate;
                    }
                    var pos = keyOffsetTop + keyAllHeight - keyHeight * (ic2+1-12);
//                    console.log( "P:" + ict + "," + jct + "," + dat[i].c1 + "," + dat[i].c2 + "," + dat[i].c3 + "," + pos + "," + w);
                    ctx.fillRect( keyOffsetLeft + keyWidth + 1 + (ict - dataMin) * rate,
                         pos, w , keyHeight );
                    ctx.strokeRect( keyOffsetLeft + keyWidth + 1 + (ict - dataMin) * rate,
                        pos, w , keyHeight );
                    break;
                }
                
            }
        }
    }
//    console.log( "dataMin: " + dataMin + ", dataMax: " + dataMax );
    
    ctx.font = "10px 'arial'";
    ctx.strokeStyle = "gray";
    ctx.fillStyle = "white";

    var sx = Math.floor( (dataMin + 999 ) / 1000 );
    var ex = Math.floor( dataMax / 1000 );
    var inc = 1;

    if ( rate*1000 < 21 ) inc = 5;
    if ( rate*1000 < 11 ) inc = 10;
    if ( rate*1000 < 6 ) inc = 50;
    for ( ; sx < ex+1; sx+=inc){

//        console.log( sx*rate*1000 + "," + ex*rate*1000);
        var lineposx = keyOffsetLeft + keyWidth + 1 + (sx*1000-dataMin)*rate;
        ctx.beginPath();
        ctx.moveTo( lineposx, keyOffsetTop);
        ctx.lineTo( lineposx, keyOffsetTop + keyAllHeight);
        ctx.stroke();

        if ( rate*1000 > 20 ){
            ctx.fillText( sx*1000, lineposx, 10 ); // msec
        }else if ( rate*1000 > 10 && sx % 5 == 0 ){
            ctx.fillText( sx*1000, lineposx, 10 ); // msec 
        }else if ( rate*1000 > 5 && sx % 10 == 0 ){
            ctx.fillText( sx*1000, lineposx, 10 ); // msec 
        }else if ( sx % 50 == 0 ){
            ctx.fillText( sx*1000, lineposx, 10 ); // msec 
        }

    }

//    console.log( current );
    ctx.strokeStyle = "red";
    var cx = (current - dataMin) * rate;
    if ( cx < 0 ) return;
    ctx.beginPath();
    ctx.moveTo( keyOffsetLeft + keyWidth + 1 + cx , keyOffsetTop);
    ctx.lineTo( keyOffsetLeft + keyWidth + 1 + cx , keyOffsetTop + keyAllHeight);
    ctx.stroke();

    preCurrent = current;
}


var keyPos = [
    1.5, 2, 3.5, 4, 5, 6.5, 7, 8.5, 9, 10.5, 11, 12
]
var keyH = [
    1.5, 1, 2,   1, 1.5, 1.5, 1,   2, 1, 2,   1, 1.5
];

function drawRoll(data, dmin, dmax, current)
{
    ctx.fillStyle = "gray";
    ctx.fillRect( 0, 0, canvas.clientWidth, canvas.clientHeight );

    ctx.fillStyle = "white";
    ctx.fillRect( keyOffsetLeft, keyOffsetTop + keyHeight*2+1, keyWidth, keyHeight * 89 );

    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    for ( var i = 9; i < 97; i++ ){
        var b = i % 12;
        ctx.beginPath();
        if ( b == 1 || b == 3 || b == 6 || b == 8 || b == 10 ){
            ctx.fillStyle = "black";
            ctx.fillRect( keyOffsetLeft, 
                keyOffsetTop + keyAllHeight - ( Math.floor(i / 12) * keyHeight * 12 ) - keyHeight * keyPos[b], 
                keyWidth / 2, 
                keyH[b] * keyHeight );

            ctx.fillStyle = "skyblue";
                
        }else{
            ctx.strokeRect( keyOffsetLeft, 
                keyOffsetTop + keyAllHeight - ( Math.floor(i / 12) * keyHeight * 12 ) - keyHeight * keyPos[b],
                keyWidth,
                keyH[b] * keyHeight );
            ctx.fillStyle = "white";
        }

        ctx.fillRect( keyOffsetLeft + keyWidth + 1, keyOffsetTop + keyAllHeight - keyHeight * (i+1), rollWidth, keyHeight );
        ctx.strokeStyle = "lightgray";
        ctx.strokeRect( keyOffsetLeft + keyWidth + 1, keyOffsetTop + keyAllHeight - keyHeight * (i+1), rollWidth, keyHeight );
        ctx.strokeStyle = "black";
    }

    if ( data != null ){
        displayRoll( data, dmin, dmax, current );
    }
}

init();
