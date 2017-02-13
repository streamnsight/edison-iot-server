/**
 * Created by emmanuel on 2/4/17.
 */

/*
 This is just to test the websocket server endpoint
 */

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001/input');
//, { perMessageDeflate: false }

ws.on('open', function open() {
    console.log("open");
    ws.send(JSON.stringify({'id':'client', 'data': {}}));
});

ws.on('error', function error(error) {
    console.log(this);
    console.log(error);
});