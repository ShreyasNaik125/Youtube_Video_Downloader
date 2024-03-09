const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3000

var routes = require('./routes/routes')
app.use(express.urlencoded({extended:true}))

app.use('/',routes)

app.set('view engine','ejs')
app.use(express.static(__dirname+'\\public'))

server.listen(port)