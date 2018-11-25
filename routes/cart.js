const express = require('express')
    , router = express.Router()
    , passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res) => {
    let cart = req.session.cart;
    console.log(cart)
    let displayCart = {
        items: [],
        total: 0
    }
    let totalAmount = 0;
    // for (let product of cart) {
    //     displayCart.items.push(product);
    //     totalAmount += (product.qty * product.price);
    // }
    displayCart.total = totalAmount;
    res.render('products/cart',{
        // products: displayCart
    });
});
module.exports = router;