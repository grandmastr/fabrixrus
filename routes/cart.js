const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    // , { Transaction, Card } = require('paystack-js');
const Product = require('../models/product');

router.get('/', (req, res) => {
    let cart = req.session.cart || {};
    let displayCart = {
        items: [],
        total: 0
    }
    let totalAmount = 0;
    for (let product in cart) {
        displayCart.items.push(cart[product]);
        totalAmount += (cart[product].price * cart[product].qty);
    }
    displayCart.total = totalAmount;
    console.log(cart);
    console.log(displayCart.items);
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
            cart[req.params.id].qty += Number(req.body.qty);
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

module.exports = router;