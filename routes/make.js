var express = require('express');
var router = express.Router();
var Make = require('../db/make');


router.get('/:id', function (req, res, next) {
    Make.findOne({_id: req.params.id}, (err, make) => {
        if (err) throw error;
        if (!make) throw "no make";
        res.json(make);
    });
});


router.post('/', function (req, res, next) {
    /*
    {
        code : '#include...',
        input : '1 2'
    }
    */
    var make = new Make({code: req.body.code, input: req.body.input});
    make.save();
    res.json(make);
});

module.exports = router;