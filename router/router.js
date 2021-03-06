var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var controller = require('../controllers/controller.js');
var app = require('../app');

var router = express.Router();
var msgs = require('../views/messages.json');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());


router.post('/register', controller.createUser);
router.post('/login', controller.login);
router.post('/game/recycling', controller.updateScore);
router.post('/game/charities', controller.updateCharity);
router.post('/game/addFollow', controller.addFollowed);
router.post('/game/removeFollow', controller.removeFollowed);
router.post('/changeUsername', controller.changeUsername);
router.post('/changeEmail', controller.changeEmail);
router.post('/changePostal', controller.changePostal);
router.post('/changePassword', controller.changePassword);

router.get('/account/settings/changeusername', function(req,res) {
    controller.getUser(req,function(err,user) {
        if(app.cookieCheck(req, res) && !err) {
            var message = null;
            if (req.query['msg']) {
                message = msgs[req.query['msg']]
            }
            var username = user.username;
            res.render('changeattribute', {
                current: username,
                msg: message,
                operation: "Username",
                name: username
            });
        }
        else {
            res.redirect('/login');
        }
    });

});

router.get('/account/settings/changeemail', function(req,res) {
    controller.getUser(req,function(err,user) {
        if(app.cookieCheck(req, res) && !err) {
            var message = null;
            if (req.query['msg']) {
                message = msgs[req.query['msg']]
            }
            var current = user.email;
            res.render('changeattribute', {
                current: current,
                msg: message,
                operation: "Email",
                email: current
            });
        }
        else {
            res.redirect('/login');
        }
    });
});

router.get('/account/settings/changepostal', function(req,res) {
    controller.getUser(req,function(err,user) {
        if(app.cookieCheck(req, res) && !err) {
            var message = null;
            if (req.query['msg']) {
                message = msgs[req.query['msg']]
            }
            var current = user.postcode;
            res.render('changeattribute', {
                current: current,
                msg: message,
                operation: "Postal",
                postalCode: current
            });
        }
        else {
            res.redirect('/login');
        }
    });
});

router.get('/account/settings/changepassword', function(req,res) {
    controller.getUser(req,function(err,user) {
        if(app.cookieCheck(req, res) && !err) {
            var message = null;
            if (req.query['msg']) {
                message = msgs[req.query['msg']]
            }
            res.render('changePassword', {
                msg: message
            });
        }
        else {
            res.redirect('/login');
        }
    });

});

router.get('/home',function(req,res) {
    controller.getTop5Friend(req,res,function(friends) {
        controller.getTop5Global(req,res,function(global) {
            if (app.cookieCheck(req,res)) {
                res.render('home',{top5Global:global,top5Friends:friends});
            } else {
                res.redirect("/login");
            }
        });
    });
});

router.get('/login',function(req,res) {
    res.render('login');
});
router.get('/game/recycling',function(req,res) {
    var message = null;
    if (req.query['msg']) {
        message = msgs[req.query['msg']]
    }
    if (app.cookieCheck(req,res)) {
        res.render('recycling',{msgs:message});
    } else {
        res.redirect('/login');
    }

});
router.get('/game/charities',function(req,res) {
    controller.getCharities(req,function(err,charities) {
        var theme = charities.theme;
        var message = null;
        if (req.query['msg']) {
            message = msgs[req.query['msg']]
        }
        if(app.cookieCheck(req,res) && !err) res.render('charities',{
            theme:theme,
            name1:charities.charities[0].name,
            des1:charities.charities[0].descrip,
            avatar1:charities.charities[0].avatar,
            name2:charities.charities[1].name,
            des2:charities.charities[1].descrip,
            avatar2:charities.charities[1].avatar,
            name3:charities.charities[2].name,
            des3:charities.charities[2].descrip,
            avatar3:charities.charities[2].avatar,
            msgs:message
        });
    });
});

router.get('/account',function(req,res) {
    controller.getUser(req,function(err,user) {
        var score = user.score;
        if(app.cookieCheck(req,res) && !err) res.render('account',{
            papAmount:score.paper,
            mAmount:score.metal,
            plaAmount:score.plastic,
            gAmount:score.glass,
            profilePicture:user.profilePicture
        });
    });
});

router.post('/user', function (req, res) {
    controller.findOneUser(req, function(err, user) {
        if(user==null) {
            res.redirect('/game/friends?msg=404');
        }
        else if(req.cookies.username == user.username) {
            res.redirect('/game/friends?msg=204')
        }
        else {
            var score = user.score;
            var username = user.username;
            var profilePicPath = user.profilePicture;
            if (app.cookieCheck(req, res) && !err) res.render('otheraccount', {
                name: username,
                path: profilePicPath,
                papAmount: score.paper,
                mAmount: score.metal,
                plaAmount: score.plastic,
                gAmount: score.glass,
                profilePicture: user.profilePicture
            });
        }
    });
});

router.get('/game/friends', function(req, res) {
    controller.getFollowed(req, res, function(friends) {
        var message = null;
        if (req.query['msg']) {
            message = msgs[req.query['msg']]
        }

        if (app.cookieCheck(req, res)) res.render('friends', {
            followed: friends,
            msg: message
        });
        else {
            res.redirect('/login')
        }
    });
});


module.exports = router;