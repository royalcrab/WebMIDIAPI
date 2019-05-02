var midi, data;
var arr = [];
var startTime = new Date();
var counter = 0;

// start talking to MIDI controller
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    console.warn("No MIDI support in your browser")
}

// on success
function onMIDISuccess(midiData) {
    // this is all our MIDI data
    midi = midiData;
    var allInputs = midi.inputs.values();
    // loop over all available inputs and listen for any MIDI input
    for (var input = allInputs.next(); input && !input.done; input = allInputs.next()) {
        // when a MIDI value is received call the onMIDIMessage function
        input.value.onmidimessage = gotMIDImessage;
    }
}

function gotMIDImessage(messageData) {
    var dataList = document.querySelector('#midi-data ul');
    var newItem = document.createElement('li');
    var newTime = new Date();
    var now = newTime.getTime()-startTime.getTime();
    var newText = messageData.data + "," + now;
    var newData = [now];

    var str = "";
    for (var i=0; i<event.data.length; i++) {
        newData.push( event.data[i] );
        str += "0x" + event.data[i].toString(16) + " ";
    }
    arr.push( newData );

    newItem.appendChild(document.createTextNode(newText));
    dataList.appendChild(newItem);

  // changinf key color on piano keyboard (if it exists).
    if ( canvas != null ){
        if ( event.data[0] == 0x90 ){
            if ( event.data[2] == 0 ){
                drawKey(event.data[1], offsetX, offsetY, blackKeySize, keySize, "white", "black", "black");
            }else{
                drawKey(event.data[1], offsetX, offsetY, blackKeySize, keySize, "green", "green", "green");
            }
        }else if ( event.data[0] == 0x80 ){
            drawKey(event.data[1], offsetX, offsetY, blackKeySize, keySize, "white", "black", "black");
        }
    }
    console.log( str );
}

// on failure
function onMIDIFailure() {
    console.warn("Not found MIDI controller")
}


function saveTextAsFile()
{
    var textToWrite = document.getElementById("midi-data").innerHTML;
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    //var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
    var now = new Date();
    var fileNameToSaveAs = "midi_" + now.toLocaleDateString() + "_" + now.toLocaleTimeString() + ".txt";
    var downloadLink = document.createElement("a");

    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";

    counter += 1;
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();

    // reset startime and data array
    arr = [];
    startTime = new Date();
}


function resetNumber(){
  counter = 0;
}

function clearText(){
  var mididata = document.querySelector('#midi-data ul');
  while( mididata.firstChild ){
    mididata.removeChild( mididata.firstChild );
  }
  startTime = new Date();
  arr = [];
}

function postMidiData() {
 
//    var form = document.createElement('form');
//    var request = document.createElement('input');

//    var res = [];

    /*
    form.method = 'POST';
    form.action = '/kani/recv.php';
 
    request.name = 'data';
    request.value = document.getElementById('dat').innerHTML;

    arr =  document.getElementById('dat').getElementsByTagName('li');


    for(var i = 0; i < arr.length; i++){
        if(arr[i].innerText == '') break;

        res[i] = arr[i].innerText.split(',');

        for(var i2 = 0; i2 < res[i].length; i2++){
            if(res[i][i2].match(/\-?\d+(.\d+)?(e[\+\-]d+)?/)){
                res[i][i2] = parseFloat(res[i][i2].replace('"', ''));
            }
        }
    }*/

    var JSONdata = '{ "midi": ' + JSON.stringify(arr) + '}';
    console.log( JSONdata );

    // Using AJAX
    var url = "recv.php";

    $.ajax({
        type : 'post',
        url : url,
        data : JSONdata,
        contentType: 'application/json',
//        dataType : 'JSON',
        scriptCharset: 'utf-8',
    })
    .then(
    // success
    function (res) {
//        alert("succesfully sent data.");
    },
    // error
    function (res) {

    });

}
