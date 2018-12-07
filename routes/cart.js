const express = require('express')
    , router = express.Router();
const Product = require('../models/product');

router.get('/', (req, res) => {
    let cart = req.session.cart || {};
    let displayCart = {
        items: [],
        total: 0
    };
    let totalAmount = 0;
    for (let product in cart) {
        displayCart.items.push(cart[product]);
        totalAmount += (cart[product].price * cart[product].qty);
    };
    displayCart.total = totalAmount;
    res.render('products/cart',{
        products: displayCart
    });
});

router.post('/:id', (req,res) => {
    req.session.cart = req.session.cart || {};
    let cart = req.session.cart;
    Product.findOne({
        _id: req.params.id
    }, (err, product) => {
        if (err) throw err;
        if (cart[req.params.id]) {
            let addedQty = Number(req.body.qty);
            cart[req.params.id].qty = Number(cart[req.params.id].qty) + Number(addedQty);
            // cart[req.params.id].qty += Number(addedQty);
        } else {
            let { _id:id, title, price, imagePath1 } = product;
            cart[req.params.id] = {
                id: id,
                title: title,
                price: price,
                imagePath: imagePath1,
                qty: req.body.qty || 1
            }
        }
        res.redirect('/cart');
    });
});
router.delete('/delete-from-cart/:id',(req,res) => {
    delete req.session.cart[req.params.id];
    res.location('/cart');
    res.redirect(303,'/cart');
});

module.exports = router;