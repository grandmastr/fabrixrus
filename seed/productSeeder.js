let Product = require('../models/product');
let mongoose = require('mongoose');
mongoose.connect('localhost:27017/fabrixrus');

let products = [
    new Product({
        imagePath: '/images/sample.jpg',
        title: 'Aso-Oke',
        description: 'Amazing Clothing!!!!!!!!!!!',
        price: 200
    }),
    new Product({
        imagePath: '/images/shady.jpg',
        title: 'Aso-Oke',
        description: 'Israel\"s picture',
        price: 200
    }),
    new Product({
        imagePath: '/images/sample2.png',
        title: 'Aso-Oke',
        description: 'Amazing!!!!!!!!!!!',
        price: 200
    }),
];
let done = 0;
for (let product of products) {
    product.save((err,result) => {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}