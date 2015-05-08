var port = 9997;

var connect = require('connect');
var http = require('http');
var slow = require('connect-slow');
var serveStatic = require('serve-static')

var app = connect()

            .use(slow({
                url: /.js/i,
                delay: 200
            }))

            //.use(slow({
            //    url: /\c.js$/i,
            //    delay: 0
            //}))

            .use(serveStatic('./'));

http.createServer(app).listen(port);