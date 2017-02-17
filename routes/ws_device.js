/**
 * Created by emmanuel on 2/12/17.
 */

var uuid = require('uuid/v4');
// elasticsearch client
var elasticsearch = require('elasticsearch');
var esClient      = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var clients = [];

var wsExpress = function (ws, req) {
    console.log('input');
    clients.push(ws);
    console.log(clients.map(function(client) {
        return client.id;
    }));

    ws.on('message', function (msg) {
        try {
            var data = JSON.parse(msg);
            //console.log(data);
            //console.log(typeof data);
            //console.log(data.meta.timestamp);
            var date = data.meta.timestamp;
            var id = data.meta.id;
            // Set ID on socket for tracking
            ws.id = id;
            esClient.create({
                index: 'iotdemo-' + date.substring(0,10), // we use the ISO timestamp to roll indices over every day with format YYYY-MM-dd = 10 characters
                type: 'edison',
                id: uuid(),
                body: data
            }, function (error, response) {
                if (error) console.log(error);
            });
        }
        catch(e) {
            console.log(e.message + " " + data);
        }
    });

    ws.on('close', function() {
        // remove socket from client list
        var index = clients.indexOf(ws);
        if (index > -1) {
            clients.splice(index, 1);
        }
    })
};

function getClients(){
    return clients;
}

module.exports = {
    handler: wsExpress,
    clients: getClients
};