var express = require('express');
var bodyParser = require('body-parser');
var socketIO = require('socket.io')
var cookieParser = require('cookie-parser');
var app = express();


require("./models/database.js");

var router = require('./router/router.js');
app.use('/',router);
app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());

var cookieCheck = function(req,res) {
    if (!req.cookies.userID) {
        res.redirect("/login");
        return false;
    }
    return true;
}
app.get("/",function(req, res, next) {
    if(cookieCheck(req,res)) {res.redirect("/home");};
});

app.get("/home",function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/home.html');};

});

app.get("/logout",function(req,res) {
    res.clearCookie("userID");
    res.redirect("/home");
})

app.get("/login", function(req,res) {
    res.sendFile(__dirname + '/site/login.html');
});

app.get("/aboutus",function (req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/aboutus.html');};
});

app.get("/account", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/account.html');};
});
app.get("/account/settings", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/settings.html');};
});

app.get("/account/settings/changeusername", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/changeusername.html');};
});

app.get("/account/settings/changepassword", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/changepassword.html');};
});

app.get("/account/settings/changeemail", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/changeemail.html');};
});

app.get("/account/settings/changepostal", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/changepostal.html');};
});

app.get("/game", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/game.html');};
});

app.get("/game/charities", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/charities.html');};
});

app.get("/game/recycling", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/recycling.html');};
});

app.get("/game/playerscore", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/playerscore.html');};
});

app.get("/game/friends", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/friends.html');};
});

app.get("/user", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/user.html');};
});

app.get("/blog", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/blog.html');};
});


const PORT = process.env.PORT || 4000;
const appServer = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(appServer);

io.on('connection',function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    exports.socket = client;
});

exports.io = io;
