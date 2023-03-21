const express = require('express');
const router = express.Router();
const { Product } = require('../models/ProductM.js');
const { Category } = require('../models/CategoryM.js');

// TO GET ALL THE PRODUCTS
router.get('/', async (req, res) => {

    const DBproduct = await Product.find({}).catch(err => console.log(err)); 
    res.render("all_products.ejs", { title: "All products", products: DBproduct })

})

// TO GET ALL THE PRODUCTS IN THE SPECIFIC CATEGORY
router.get('/:category', async (req, res) => {
    const categorySlug = req.params.category;

    const category = await Category.findOne({slug: categorySlug}).catch(err => console.log(err)); 
    res.render("cat_products.ejs", { title: category.title, products: DBproduct })


})

module.exports = router;
