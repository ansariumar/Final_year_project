const express = require('express');
const router = express.Router();
const { Page } = require('../models/pagesM.js');

router.get('/',  (req, res) => {
    console.log("here i am in pages.js")
    Page.findOne({slug: "home"}, (err, page) => {
        if (err) console.log(err);
        else {
            console.log("here")
            res.render('index.ejs', {title: page.title, content: page.content})
        }
    })

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
