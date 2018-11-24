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
    imagePath1: {
        type: String,
        required: true
    },
    imagePath2: {
        type: String,
        required: true
    },
    imagePath3: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
});
let Product = module.exports = mongoose.model('Product', schema);
module.exports.postProduct = (product,callback) => {
    product.save(callback);
};
module.exports.updateProduct = (id,productDetails,callback) => {
    Product.updateOne({
        _id: id
    }, productDetails, callback);
};
module.exports.deleteProduct = (id,callback) => {
    Product.remove({ _id: id }, callback);
};