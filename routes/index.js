var express = require('express');
var router = express.Router();
var User = require('../db/user');

/* GET home page. */
router.get('/:id', function (req, res, next) {
    User.findOne({id: req.params.id}, (err, user) => {
        if (err) throw err;
        if (!user) {
            new User({id: req.params.id,}).save((err, nuser) => {
                res.json(nuser);
            });
            return;
        }
        res.json(user);
    });
});

//TODO post로 workspace저장
/*
work : {
            _id : String
            title: String,
            content: String,
        }
 */
router.post('/:id/:work_id', function (req, res, next) {
    console.log(req.body, req.params);
    User.findOne({id: req.params.id}, (err, user) => {
        if (err) throw error;
        if (!user) throw "no user";
        var found = null;
        console.log(user);
        for (var i = 0; i < user.workspace.length; i++) {
            if (user.workspace[i]._id.toString() === req.params.work_id) {
                user.workspace[i].title = req.body.title;
                user.workspace[i].content = req.body.content;
                found = user.workspace[i];
                break;
            }
        }
        user.markModified();
        user.save();
        res.json({result: found ? "success" : "failed", work: found});
    });
});

router.post('/:id', function (req, res, next) {
    console.log(req.body);
    User.findOne({id: req.params.id}, (err, user) => {
        if (err) throw error;
        if (!user)
            user = new User({id: req.params.id});
        user.workspace.push({title: req.body.title, content: req.body.content});
        user.save();
        res.json({result: "success", work: user.workspace[user.workspace.length - 1]});
    });
});


module.exports = router;
