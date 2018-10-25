let Product = require('../models/product');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fabrixrus', { useNewUrlParser:true })
    .then(() => {
        console.log('Connected!!!');
    }).catch((err) => {
        console.warn(err);
});


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
    })
];
let done = 0;
for (let i = 0; i < products.length; i++) {
    products[i].save((err,data) => {
        done++;
        if(done === products.length) {
            exit();
        }
    });
}
const exit = () => {
    mongoose.disconnect();
};