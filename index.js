/**
 * Created by arvind on 18/7/17.
 */

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
const port = process.env.PORT;

var socket = require('socket.io');

var connected = [];

var io = socket(server);

io.on('connection', function (socket) {
    socket.on('username', function (username) {
        console.log("<<<" + username + "CONNECTED>>>");
        connected[socket.id] = username;

    });
    socket.on('disconnect', function () {
        var username = connected[socket.id];
        delete connected[socket.id];
        console.log("<<<" + username + "DISCONNECTED>>>")
    });
    socket.on('draw', function (obj) {
        socket.broadcast.emit('draw', obj);
    })
});

    app.use('/', express.static('front'));
    
    server.listen(port , function () {
        console.log("Server Listening on LocalHost " + port);
    });