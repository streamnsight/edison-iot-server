/**
 * Created by emmanuel on 2/12/17.
 */

var device_list = [];
var nb_clients = 0;
var serverURL = "192.168.20.105:3001";
var ws = new WebSocket('ws://' + serverURL + '/web');

function onOpen() {
    var data = {
        'client': window.location
    };
    ws.send(JSON.stringify(data));
    $("#url_error").text("");
}

function onClose() {
    ws = new WebSocket('ws://' + serverURL + '/web');
    attachListeners();
}

function onError(error) {
    $("#url_error").text(error.message);
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

function attachListeners() {
    ws.addEventListener('open', onOpen);
    ws.addEventListener('close', onClose);
    ws.addEventListener('error', onError);
    ws.addEventListener('message', onMessage);
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
    $("button").click(sendMessage)
}

function genNode(device) {
    return $.parseHTML("<li><span class='device'>"+device+"</span><input id='"+device+"' type='text' maxlength='32'><button id="+device+" type='button' class='btn btn-primary'>Send Message</button></li>");
}

function updateURL() {
    serverURL = $("input[id='url']")[0].value;
    ws.close();
}
// on load, first time running
attachListeners();
