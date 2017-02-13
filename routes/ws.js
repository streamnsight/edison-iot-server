/**
 * Created by emmanuel on 2/12/17.
 */

var express = require('express');
var uuid = require('uuid/v4');
// elasticsearch client
var elasticsearch = require('elasticsearch');
var esClient      = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var ws = function (ws, req) {
    console.log('input');
    ws.on('message', function (msg) {
        try {
            var data = JSON.parse(msg);
            console.log(data);
            //console.log(typeof data);
            //console.log(data.meta.timestamp);
            var date = data['meta'].timestamp;
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
};

module.exports = ws;