let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true 
    },
    imagePath: {
        type: String,
        required: true
    },
    // imagePath2: {
    //     type: String,
    //     required: true
    // },
    // imagePath3: {
    //     type: String,
    //     required: true
    // }
});
let Product = module.exports = mongoose.model('Product', schema);
module.exports.postProduct = (product,callback) => {
    product.save(callback);
};