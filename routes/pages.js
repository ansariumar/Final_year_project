const express = require('express');
const router = express.Router();
const { Page } = require('../models/pagesM.js');
const { Product } = require('../models/ProductM.js');

router.get('/',  (req, res) => {
    // if (req.session.loggedIn === false) req.session.loggedIn = undefined;
    Page.findOne({slug: "home"}, (err, page) => {
        if (err) console.log(err);
        else {
            res.render('index.ejs', {title: page.title, content: page.content, user: req.session.user})
        }
    })

})

router.get('/test',  async (req, res) => {

    const DBproduct = await Product.find({}).sort({date: 'desc'}).catch(err => console.log(err));
    const firstFourProducts = DBproduct.slice(0, 4);

    res.render("indexTest.ejs", { title: "All products", products: firstFourProducts, user: req.session.user })
           


})

router.get('/:slug',  (req, res) => {

    Page.findOne({slug: req.params.slug}, (err, page) => {
        if (err) console.log(err);
        if (!page) {
            res.redirect('/');
        } else {
            res.render('index.ejs', {title: page.title, content: page.content})
        }
    })

})

module.exports = router;
