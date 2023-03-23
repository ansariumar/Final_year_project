const express = require('express');
const router = express.Router();
const { Product } = require('../models/ProductM.js');

// GET Add Product to cart

router.get('/add/:product', (req, res) => {

    const productSlug = req.params.product;

    Product.findOne({ slug: productSlug }, (err, product) => {             //When addTOcart is clicked on a product, first we find that product in the DB
        if (typeof req.session.cart === "undefined") {             //IF the cart is empty 
            req.session.cart = [];                                     //initalize the session cart variable as an array
            req.session.cart.push({                             //THen push the current element as the fist element
                title: productSlug,
                qty: 1,
                price: parseFloat(product.price).toFixed(2),
                image: `/product_images/${product._id}/${product.image}`
            })
        } else {                                                             //If cart NOt empty
            const cart = req.session.cart;
            let newItem = true;

            for (let i = 0; i < cart.length; i++) {                     //loop throught every item in cart
                if (cart[i].title === productSlug) {                     //If this item already exist in the cart
                    cart[i].qty++;                             // increment the items quantity
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: productSlug,
                    qty: 1,
                    price: parseFloat(product.price).toFixed(2),
                    image: `/product_images/${product._id}/${product.image}`
                })
            }
        }
        console.log(req.session.cart);
        req.flash('success', "Product Added");
        res.redirect('back')
    })

})

router.get('/checkout', (req, res) => {

    if(req.session.cart && req.session.cart.length == 0) delete req.session.cart;

    const success = req.flash('success')
    res.render('checkout.ejs', { title: "Checkout", cart: req.session.cart, error: success })
})


router.get('/update/:product', (req, res) => {

    const slug = req.params.product;
    const cart = req.session.cart;
    const action = req.query.action;
    // console.log(slug, action, cart)
    for(let i = 0; i < cart.length; i++) {
            console.log("switch")
        if (cart[i].title == slug) {
            switch (action) {
            case "add":
                cart[i].qty++;
                break;
            case "remove":
                cart[i].qty--;
                if (cart[i].qty < 1) cart.splice(i,1);
                break;
            case "clear":
                cart.splice(i,1);
                if (cart.length == 0) delete req.session.cart;
                break;
            default:
                console.log('update Problem');
                break;
            }
            break;
        }
    }

    req.flash('success', "Product Updated Successfully!");
    res.redirect('/cart/checkout')

})

router.get('/clear', (req, res) => {
    delete req.session.cart;

    req.flash('success', "Cart cleared Successfully!");
    res.redirect('/cart/checkout')
})




router.get('/buynow', (req, res) => {
    delete req.session.cart;

    res.sendStatus(200)
})

module.exports = router;