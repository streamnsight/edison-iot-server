/**
 * Created by emmanuel on 2/12/17.
 */

var clients = [];
var timeout = null;

var wsExpress = function(getClientDevices) {
    return (function (ws, req) {
        console.log('web');
        clients.push(ws);
        //console.log(clients.map(function(client) {
        //    return client.id;
        //}));
        // Set timeout to send the list of connected devices on open
        function sendData() {
            var data = {
                devices: getClientDevices().map(function (socket) { return socket.id;}),
                viewers: clients.length
            };
           // if (ws.readyState = ws.OFF) {
                ws.send(JSON.stringify(data));
            //}
            timeout = setTimeout(sendData, 1000);
        }
        timeout = setTimeout(sendData, 1000);

        ws.on('message', function (msg) {
            try {
                var message = JSON.parse(msg);
                if (message.id) {
                    console.log(message);
                    var device_id = message.id;

                    var devices = getClientDevices();
                    var socket = devices.filter(function(socket){
                        return socket.id == device_id;
                    });
                    if (socket.length > 0) {
                        socket[0].send(JSON.stringify({data: {lcd: {text: message.text }}}));
                    }
                }
            }
            catch(e) {
                console.log(e.message);
            }
        });

        ws.on('close', function() {
            clearTimeout(timeout);
        });

        ws.on('close', function() {
            // remove socket from client list
            var index = clients.indexOf(ws);
            if (index > -1) {
                clients.splice(index, 1);
            }
        })
    })
};

module.exports = {
    handler: wsExpress,
    clients: clients
};