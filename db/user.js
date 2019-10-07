var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    created: {type: Date, default: Date.now},
    workspace: {
        type: [{
            title: String,
            content: String,
            created: {type: Date, default: Date.now}
        }],
        default: []
    }
});

module.exports = mongoose.model('user', userSchema);