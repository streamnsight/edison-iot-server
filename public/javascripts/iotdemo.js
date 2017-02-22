/**
 * Created by emmanuel on 2/12/17.
 */

var device_list = [];
var nb_clients = 0;
var serverURL = window.location.host;

WebSocket.prototype.attachListeners = function() {
    this.onopen = onOpen;
    this.onclose = onClose;
    this.onmessage = onMessage;
    this.onerror = onError;
};

WebSocket.prototype.removeAllListeners = function() {
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
};

var ws = new WebSocket('ws://' + serverURL + '/web');
ws.attachListeners();

function onOpen() {
    var data = {
        'client': window.location
    };
    ws.send(JSON.stringify(data));
    $("#url_error").text("");
}

function onClose(code, reason) {
    if (code != 1000) {
        $("#url_error").text("Could not connect. Check the Server URL");
    }
    setTimeout(function(){
        ws.removeAllListeners();
        ws = new WebSocket('ws://' + serverURL + '/web');
        ws.attachListeners();
    }, 1000);
}

function onError(e, msg) {
    $("#url_error").text(e);
}

function onMessage(msg){
    try {
        console.log(msg);
        var message = JSON.parse(msg.data);
        nb_clients = message.viewers;
        var diff = _.isEqual(message.devices, device_list);
        if (!diff) {
            device_list = message.devices;
            refresh_view();
        }
    }
    catch (e) {
        console.log(e.message);
    }
}


function sendMessage() {
    console.log(this);
    var message = {
        id: this.id,
        text: $("input[id='"+this.id+"']")[0].value
    };
    ws.send(JSON.stringify(message));
}

function refresh_view() {
    $("#device_list").empty();
    device_list.forEach(function(device){
        var device_node = genNode(device);
        $("#device_list").append(device_node)
    });
    $("button.message").click(sendMessage)
}

function genNode(device) {
    return $.parseHTML("<li><span class='device'>"+device+"</span><input id='"+device+"' type='text' maxlength='32'><button id="+device+" type='button' class='btn btn-primary message'>Send Message</button></li>");
}

function updateURL() {
    serverURL = $("input[id='url']")[0].value;
    ws.close();
}
