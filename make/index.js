var fs = require('fs');
var exec = require("child_process").exec;
var Make = require('../db/make');

/*
router.get('/:id/:work_id', function (req, res, next) {
    User.findOne({id: req.params.id}, (err, user) => {
        if (err) throw error;
        if (!user) throw "no user";
        var content = null;
        //console.log(user);

        for (var i = 0; i < user.workspace.length; i++) {
            if (user.workspace[i]._id.toString() === req.params.work_id) {
                content = user.workspace[i].content;
                break;
            }
        }

        var file = "./make/" + req.params.id + "/" + req.params.work_id + ".c";
        var out = "./make/" + req.params.id + "/" + req.params.work_id + ".out";
        var path = "./make/" + req.params.id;

        if (!fs.existsSync(path)) {
            fs.mkdir;
            fs.mkdirSync(path);
        }

        fs.writeFile(file, content, function (err) {
            if (err) throw err;
            console.log("File Saved");
        });

        var cmd = "g++ -o " + out + " " + file;
        exec(cmd, function (err, stdout, stderr) {
                console.log(stderr);
                if (stderr)
                    res.json({stderr: stderr});
                else
                    exec(out, function (err, stdout, stderr) {
                        console.log(stdout);
                        console.log(stderr);
                        res.json({stdout: stdout, stderr: stderr});
                    })
            }
        )
    })
});
*/


function execute(make, callback) {
    if (make.code.toString().includes('system')) {
        make.output.stdout = 'ban system call';
        make.result = 1;
        make.save();
        return;
    }
    const path = `${__dirname}/${make._id}`;
    const file = `${path}/main.cpp`;
    const out = `${path}/Main`;
    const input = `${path}/input.in`;
    const cmd = `g++ -o ${out} ${file}`;

    console.log(path);
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    fs.writeFileSync(file, make.code);
    fs.writeFileSync(input, make.input);

    exec(cmd, (err, stdout, stderr) => {
        if (err) throw err;
        if (stderr) {
            make.output.stderr = stderr;
            make.result = 1;
            make.save();
            return;
        }
        exec(`${out} < ${input} `, (err, stdout, stderr) => {
            if (err) throw err;
            make.output.stdout = stdout;
            make.output.stderr = stderr;
            make.result = 1;
            make.save();
        });
    });

}

module.exports.start = function () {
    Make.find({result: 0}, (err, makes) => {
        if (err || !makes) return;
        makes.forEach((make) => {
            execute(make);
        });
    });
};