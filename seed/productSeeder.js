let Product = require('../models/product');
let mongoose = require('mongoose');
let dbname = 'fabrixrus';
mongoose.connect(`mongodb://localhost/${dbname}`, { useNewUrlParser:true })
    .then(() => {
        console.log(`Connected to ${dbname}`);
    }).catch((err) => {
        console.warn(`The following error occurred: ${err}`);
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
    }),
    new Product({
        imagePath: '/images/sample.jpg',
        title: 'Wonderful Aso-Oke',
        description: 'Awesome!!!!!!!!!!!',
        price: 400
    }),
    new Product({
        imagePath: '/images/sample.jpg',
        title: 'Wonderful Aso-Oke',
        description: 'Awesome!!!!!',
        price: 500
    }),
    new Product({
        imagePath: '/images/sample.jpg',
        title: 'Wonderful',
        description: 'Awesome!!!!',
        price: 1000
    })
];
let done = 0;
for (let product of products) {
    product.save((err,data) => {
       done++;
       if (done === products.length) exit()
    });
}
const exit = () => {
    mongoose.disconnect();
};