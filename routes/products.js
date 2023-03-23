const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const { Product } = require('../models/ProductM.js');
const { Category } = require('../models/CategoryM.js');


// TO GET ALL THE PRODUCTS
router.get('/', async (req, res) => {

    const DBproduct = await Product.find({}).catch(err => console.log(err)); 
    res.render("all_products.ejs", { title: "All products", products: DBproduct })

})


// TO GET THE PRODUCTS FROM A SPECIFIC CATEGORY
router.get('/:category', async (req, res) => {
    const categorySlug = req.params.category;
    console.log(categorySlug)

    const requiredCategory = await Category.findOne({slug: categorySlug}).catch(err => console.log(err));     //Find the specific category you need "inside the Category table"
    console.log(requiredCategory)
    const productsOfCategory = await Product.find({category: categorySlug}).catch(err => console.log(err));

    res.render("cat_products.ejs", { title: requiredCategory.title, products: productsOfCategory })

})

router.get('/:category/:product', async (req,res) => {
    console.log("here")
    var galleryImages = null;

    const product = await Product.findOne({slug: req.params.product}).catch(err => console.log(err));
    const galleryDir = `public/product_images/${product._id}/gallery`;

    fs.readdir(galleryDir, (err, files) => {
        if (err) console.log(err);
        else {
            galleryImages = files;

            res.render('product.ejs', { title: product.title, product: product, galleryImages: galleryImages, loggedIn: true         })
        }
    })

})

module.exports = router;
