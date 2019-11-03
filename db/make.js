var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var makeSchema = new Schema({
    code: String,
    created: {type: Date, default: Date.now},
    result: {type: Number, default: 0}, // 0 ready 1 over
    input: {type: String, default: ''},
    output: {stdout: {type: String, default: ''}, stderr: {type: String, default: ''}}
});

module.exports = mongoose.model('make', makeSchema);