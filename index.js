const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const app = express();

const httpServer = http.createServer(app);

const WS_PORT = process.env.WS_PORT || 3001;
const HTTP_PORT = process.env.HTTP_PORT || 3000;

// app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

const wsServer = new WebSocket.Server({ server: httpServer });

let connectedClients = [];
wsServer.on('connection', async (ws, req)=>{
    console.log('Connesso');
    connectedClients.push(ws);
    ws.on('message', data=>{
        connectedClients.forEach((ws, i) => {
            if(ws.readyState === ws.OPEN) {
                ws.send(data);
            }
            else{
                connectedClients.splice(i , 1);
            }
        });
    });
});

app.get('/client', (req, res)=>{
    res.render('client');
});
app.get('/streamer', (req, res)=>{
    res.render('streamer');
});

httpServer.listen(HTTP_PORT , () =>{
    console.log("HTTP server listening at http://localhost");
});