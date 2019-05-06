var canvas;
var ctx;
var v;
var dmin = 0;
var dmax = 45000;
const songMax = 45000;
var preCurrent = 0;

function init(){

    canvas = document.getElementById("roll");
    if ( ! canvas || ! canvas.getContext ) { return false; }
    ctx = canvas.getContext('2d');
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

function fast() {
    if ( v.playbackRate > 0.1){
        v.playbackRate -= 0.1;
    }
}

const rollWidth = 900;
const keyWidth = 20;
const keyHeight = 4;
const keyOffsetLeft = 10;
const keyOffsetTop = 0;
const keyAllHeight = 400;

const rollOffsetLeft = 100; // roll の左端の座標
function displayRoll( dat, dataMin, dataMax, current ){
    var rate = rollWidth / (dataMax - dataMin) ;
    // データの最小分解能

    ctx.strokeStyle = "black";
    ctx.fillStyle = "lightgreen";
    
    for( var i = 0; i < dat.length; i++ ){
        // 範囲外なら表示しない
        var ict = parseInt(dat[i].time);
        var ic1 = parseInt(dat[i].c1);
        var ic2 = parseInt(dat[i].c2);
        var ic3 = parseInt(dat[i].c3);

        if ( ict < dataMin || ict > dataMax ) continue;

        // note on の場合は対応する note off を探す。なければとりあえず右端まで引く
        if ( ic1 == 0x90 && ic3 > 0 ){
            for( var j = i+1; j < dat.length; j++ ){

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
    console.log( "dataMin: " + dataMin + ", dataMax: " + dataMax );
    
    ctx.font = "10px 'arial'";
    ctx.strokeStyle = "gray";
    ctx.fillStyle = "white";

    var sx = Math.floor( (dataMin + 999 ) / 1000 );
    var ex = Math.floor( dataMax / 1000 );
    for ( ; sx < ex+1; sx+=1){

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
        }else if ( sx % 10 == 0 ){
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
