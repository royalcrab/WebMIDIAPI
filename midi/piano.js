var canvas;
var ctx;
var offsetX = 0;
var offsetY = 20;
var keySize = 10;
var blackKeySize = 3;

var nazoX = 10;
var preNote = -1;

function init(){
    canvas = document.getElementById("piano");
    if ( ! canvas || ! canvas.getContext ) { return false; }
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', onDown, false);
    canvas.addEventListener('mouseup', onUp, false);
    canvas.addEventListener('click', onClick, false);
    canvas.addEventListener('mouseover', onOver, false);
    canvas.addEventListener('mouseout', onOut, false);

    canvas.addEventListener("mousemove", onMove, false );
 
    var i = 0;
    while ( i < 88 ){
        drawKey(i+21, offsetX, offsetY, blackKeySize, keySize, "white", "black", "black");
        i ++;
    }


}

function drawKey(note, x, y, ox, size, lowColor, upColor, lineColor){
    if ( note < 21 || note > 108 ){ return false; }

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = lineColor;
    x += (Math.floor(note/12)-1) * size * 7;
    switch( note % 12 ){
        case 0:
        ctx.fillStyle = lowColor;
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+size*5);
        ctx.lineTo(x+size, y+size*5);
        ctx.lineTo(x+size, y+size*3);
        ctx.lineTo(x+size-ox, y+size*3);
        ctx.lineTo(x+size-ox, y);
        ctx.lineTo(x,y);
        ctx.fill();
        break;
        case 1:
        x += size - ox;
        ctx.fillStyle = upColor;
        ctx.fillRect( x, y, ox*2, size*3);
        ctx.strokeRect( x, y, ox*2, size*3);
        break;
        case 2:
        x += size;
        ctx.fillStyle = lowColor;
        ctx.moveTo(x+ox, y);
        ctx.lineTo(x+ox, y+size*3);
        ctx.lineTo(x, y+size*3);
        ctx.lineTo(x, y+size*5);
        ctx.lineTo(x+size, y+size*5);
        ctx.lineTo(x+size, y+size*3);
        ctx.lineTo(x+size-ox, y+size*3);
        ctx.lineTo(x+size-ox, y);
        ctx.lineTo(x+ox,y);
        ctx.fill();
        break;
        case 3:
        x += size*2 - ox;
        ctx.fillStyle = upColor;
        ctx.fillRect( x, y, ox*2, size*3);
        ctx.strokeRect( x, y, ox*2, size*3);
        break;
        case 4:
        ctx.fillStyle = lowColor;
        x += size*2;
        ctx.moveTo(x+ox, y);
        ctx.lineTo(x+ox, y+size*3);
        ctx.lineTo(x, y+size*3);
        ctx.lineTo(x, y+size*5);
        ctx.lineTo(x+size, y+size*5);
        ctx.lineTo(x+size, y);
        ctx.lineTo(x+size-ox, y);
        ctx.lineTo(x+ox,y);
        ctx.fill();
        break;
        case 5:
        ctx.fillStyle = lowColor;
        x += size*3;
        ctx.moveTo(x, y);
        ctx.lineTo(x, y+size*5);
        ctx.lineTo(x+size, y+size*5);
        ctx.lineTo(x+size, y+size*3);
        ctx.lineTo(x+size-ox, y+size*3);
        ctx.lineTo(x+size-ox, y);
        ctx.lineTo(x,y);
        ctx.fill();
        break;
        case 6:
        x += size*4 - ox;
        ctx.fillStyle = upColor;
        ctx.fillRect( x, y, ox*2, size*3);
        ctx.strokeRect( x, y, ox*2, size*3);
        break;
        case 7:
        ctx.fillStyle = lowColor;
        x += size*4;
        ctx.moveTo(x+ox, y);
        ctx.lineTo(x+ox, y+size*3);
        ctx.lineTo(x, y+size*3);
        ctx.lineTo(x, y+size*5);
        ctx.lineTo(x+size, y+size*5);
        ctx.lineTo(x+size, y+size*3);
        ctx.lineTo(x+size-ox, y+size*3);
        ctx.lineTo(x+size-ox, y);
        ctx.lineTo(x+ox,y);
        ctx.fill();
        break;
        case 8:
        x += size*5 - ox;
        ctx.fillStyle = upColor;
        ctx.fillRect( x, y, ox*2, size*3);
        ctx.strokeRect( x, y, ox*2, size*3);

        break;
        case 9:
        ctx.fillStyle = lowColor;
        x += size*5;
        ctx.moveTo(x+ox, y);
        ctx.lineTo(x+ox, y+size*3);
        ctx.lineTo(x, y+size*3);
        ctx.lineTo(x, y+size*5);
        ctx.lineTo(x+size, y+size*5);
        ctx.lineTo(x+size, y+size*3);
        ctx.lineTo(x+size-ox, y+size*3);
        ctx.lineTo(x+size-ox, y);
        ctx.lineTo(x+ox,y);
        ctx.fill();
        break;
        case 10:
        x += size*6 - ox;
        ctx.fillStyle = upColor;
        ctx.fillRect( x, y, ox*2, size*3);
        ctx.strokeRect( x, y, ox*2, size*3);

        break;
        case 11:
        ctx.fillStyle = lowColor;
        x += size*6;
        ctx.moveTo(x+ox, y);
        ctx.lineTo(x+ox, y+size*3);
        ctx.lineTo(x, y+size*3);
        ctx.lineTo(x, y+size*5);
        ctx.lineTo(x+size, y+size*5);
        ctx.lineTo(x+size, y);
        ctx.lineTo(x+size-ox, y);
        ctx.lineTo(x+ox,y);
        ctx.fill();
        break;
        default:
        break;
    }
    ctx.stroke();
}

function onDown(e) {
  console.log("down");
}

function onUp(e) {
  console.log("up");
}

function onClick(e) {
    console.log("click");
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    console.log("x:", x, "y:", y);
  }

function onOver(e) {
  console.log("mouseover");

}

function onOut() {
  console.log("mouseout");
  if ( 20 < preNote && preNote < 109 ){
    drawKey( preNote, offsetX, offsetY, blackKeySize, keySize, "white", "black", "black" );
    preNote = -1;
  }
}

function getNote(x, y){
    var note = -1;
    x -= offsetX;
    y -= offsetY;
    if ( 0 < y && keySize*4 > y ){
//        console.log(((x+blackKeySize+1) % keySize ) );
        if ( ((x+blackKeySize+1) % keySize ) < blackKeySize*2 ){
            var tx = Math.floor((x+blackKeySize+1)/keySize);
//            console.log(tx);
            switch( tx % 7){
                case 0:
                console.log(Math.floor(tx/7)*12+10);
                return Math.floor(tx/7)*12+10;
                case 1:
                break;
                case 2:
                console.log(Math.floor(tx/7)*12+13);
                return Math.floor(tx/7)*12+13;
                case 3:
                console.log(Math.floor(tx/7)*12+15);
                return Math.floor(tx/7)*12+15;
                case 4:
                break;
                case 5:
                console.log(Math.floor(tx/7)*12+18);
                return Math.floor(tx/7)*12+18;
                case 6:
                console.log(Math.floor(tx/7)*12+20);
                return Math.floor(tx/7)*12+20;
            }

        }
    }
    if ( 0 < y && keySize*6 > y ){
        var tx = Math.floor( x / keySize );
        var ux = Math.floor((tx-1) / 7)*12+12;
        switch ( tx % 7 ){
            case 0:
            console.log(ux+11);
            return ux+11;
            case 1:
            console.log(ux);
            return ux;
            case 2:
            console.log(ux+2);
            return ux+2;
            case 3:
            console.log(ux+4);
            return ux+4;
            case 4:
            console.log(ux+5);
            return ux+5;
            case 5:
            console.log(ux+7);
            return ux+7;
            case 6:
            console.log(ux+9);
            return ux+9;
        }
    }
    return -1;
}


function onMove(e){
    var x = e.clientX-canvas.offsetLeft+nazoX;
    var y = e.clientY-canvas.offsetTop;
    console.log( "x:" + x + " y:" + y );
    note = getNote(e.clientX-canvas.offsetLeft+nazoX, e.clientY-canvas.offsetTop );
    if ( note == preNote ) return 0;
    if ( 20 < preNote && preNote < 109 ){
        drawKey( preNote, offsetX, offsetY, blackKeySize, keySize, "white", "black", "black" );
    }
    preNote = note;
    if ( note == -1 || (note < 21 || 108 < note)) return 0;
    drawKey( note, offsetX, offsetY, blackKeySize, keySize, "skyblue", "skyblue", "black" );
    return 1;
}
init();


