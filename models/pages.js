let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    pageName: {
        type: String,
        required: true
    },
    pageContent: {
        type: String,
        required: true
    },
    dateLastUpdated: {
        type: Date,
        default: Date.now
    }
});

let Page = module.exports = mongoose.model('Page', schema);