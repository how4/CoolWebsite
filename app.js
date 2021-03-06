var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();


require("./models/database.js");

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

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


app.get("/logout",function(req,res) {
    res.clearCookie("userID");
    res.redirect("/login");
})

app.get("/aboutus",function (req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/aboutus.html');};
});

app.get("/account/settings", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/settings.html');};
});

app.get("/game", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/game.html');};
});

app.get("/game/recycling", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/recycling.html');};
});

app.get("/game/playerscore", function(req,res) {
    res.redirect("/account");
});

app.get("/blog", function(req,res) {
    if(cookieCheck(req,res)) {res.sendFile(__dirname + '/site/blog.html');};
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
exports.cookieCheck = cookieCheck;