/**
 * Created by arvind on 18/7/17.
 */

var socket = io();
var username = prompt("Enter You Your Name...");
$(function () {
    var drawing = false;

    socket.emit('username', username);

    socket.on('draw', otherDraw);

    var canvas = $(".whiteboard")[0];
    var cxt = canvas.getContext('2d');

    $(".red").click(function () {
        curr.color = "red";
    });

    $(".blue").click(function () {
        curr.color = "blue";
    });

    $(".black").click(function () {
        curr.color = "black";
    });

    $(".yellow").click(function () {
        curr.color = "yellow";
    });

    $(".green").click(function () {
        curr.color = "green";
    });

    canvas.addEventListener('mousedown', mousbtnpressed);
    canvas.addEventListener('mouseup', mousebtnreleased);
    canvas.addEventListener('mouseout', mousebtnreleased);
    canvas.addEventListener('mousemove',throttle(mousemoving,10));

    onResize();
    var curr = {
        color : "black"
    };

    function otherDraw(obj) {
        drawline(obj.x0, obj.y0, obj.x1, obj.y1, obj.color, false);
    }

    function throttle(callback, delay) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    function drawline(x0, y0, x1, y1, color, emit) {
        cxt.beginPath();
        cxt.moveTo(x0, y0);
        cxt.lineTo(x1, y1);
        cxt.strokeStyle = color;
        cxt.lineWidth = 2;
        cxt.stroke();
        cxt.closePath();

        if(!emit){
            return;
        }

        socket.emit('draw', {
            x0 : x0,
            x1 : x1,
            y0 : y0,
            y1 : y1,
            color : color
        })
    }

    function mousemoving(e) {

        var prevx = curr.curx;
        var prevy = curr.cury;
        var newx = e.clientX;
        var newy = e.clientY;

        console.log("From " + prevx + ", " + prevy);
        console.log("Moving" + newx + ", " + newy);
        if(!drawing){
            return;
        }

        drawline(prevx, prevy, newx, newy, curr.color, true);
        curr.curx = newx;
        curr.cury = newy;
    };

    function mousebtnreleased(e) {
        if(!drawing){
            return;
        }

        var prevx = curr.curx;
        var prevy = curr.cury;
        var newx = e.clientX;
        var newy = e.clientY;

        drawing = false;
        drawline(prevx, prevy, newx, newy, curr.color, true);
    }

    function mousbtnpressed(e) {
        console.log("Pressed at " + e.clientX + ", " + e.clientY);
        drawing = true;
        curr.curx = e.clientX;
        curr.cury = e.clientY;
    }

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

});