var canvas;
var ctx;
var v;

function init(){

    canvas = document.getElementById("roll");
    if ( ! canvas || ! canvas.getContext ) { return false; }
    ctx = canvas.getContext('2d');
    v = document.getElementById("video");
    drawRoll();
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
    }, false);
    //再生完了を知らせる
    v.addEventListener("ended", function(){
        document.getElementById("kanryou").innerHTML = "動画の再生が完了しました。";
    }, false);

    drawRoll();
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
function displayRoll( dat, dataMin, dataMax ){
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
    ctx.strokeStyle = "gray";
    var sx = Math.floor( (dataMin + 999 ) / 1000 );
    var ex = Math.floor( dataMax / 1000 );
    for ( ; sx < ex+1; sx+=1){
//        console.log( sx*rate*1000 + "," + ex*rate*1000);
        ctx.beginPath();
        ctx.moveTo( keyOffsetLeft + keyWidth + 1 + sx*rate*1000, keyOffsetTop);
        ctx.lineTo( keyOffsetLeft + keyWidth + 1 + sx*rate*1000, keyOffsetTop + keyAllHeight);
        ctx.stroke();
    }
}


var keyPos = [
    1.5, 2, 3.5, 4, 5, 6.5, 7, 8.5, 9, 10.5, 11, 12
]
var keyH = [
    1.5, 1, 2,   1, 1.5, 1.5, 1,   2, 1, 2,   1, 1.5
];

function drawRoll()
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
        displayRoll( data, 0, 45000 );
    }
}

init();
