var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var UserInfo = mongoose.model('account');
var server = require('../app');

var createUser = function(req,res) {

    var user = new UserInfo({
        "username":req.body.username,
        "password":passwordHash.generate(req.body.password),
        "email":req.body.email,
    });
    UserInfo.find({$or: [{email: user.email}, {username: user.username}]},function(err,user) {
        if (!err && !user) {
            user.save(function (err) {
                if (!err) {
                    res.redirect("./login");
                } else {
                    res.sendStatus(400);
                }
            });
        } else {
            server.io.emit("messages","Account or Email already exists");
        }
    });


}

var login = function(req,res) {

    var username = req.body.username;
    UserInfo.findOne({username: username},function(err,user) {
        if (!err && user != null) {
            if (passwordHash.verify(req.body.password,user.password)) {
                res.cookie('userID',user.id, { maxAge: 900000, httpOnly: true })
                res.redirect("/home");
            } else {
                server.io.emit("messages","Password is incorrect.");
            }
        } else {
            server.io.emit('messages','Account does not exist');
        }
    })
};

var updateScore = function(req,res) {
    const newScore = {
        "Score": {
            "paper": req.body.Paper,
            "plastic": req.body.Plastic,
            "metal": req.body.Metal,
            "glass": req.body.Glass,
            "total": req.body.Total,
        }
    }
    UserInfo.update({_id: /*INSERT COOKIES HERE */req.params.id}, newScore, function(err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
}

module.exports.createUser = createUser;
module.exports.login = login;