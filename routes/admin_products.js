const flash = require('connect-flash');
const express = require('express');
const { Product } = require('../models/ProductM.js');
const { Category, validateCategory } = require('../models/CategoryM.js');
const { mkdirp } = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-Img');
const { isAdmin } = require('../config/auth.js')
const url = require('url')




const router = express.Router();


router.get('/', isAdmin, async (req, res) => {

    const count = await Product.count();

    const DBproduct = await Product.find({})

    let error = req.flash("success")
    if (error.length === 0) error = null

    res.render('admin/products.ejs', { title: "All products", products: DBproduct, count: count, error: error })

})

router.get('/add-product', isAdmin, async (req, res) => {

    const title = "";
    const desc = "";
    const price = "";
    const ytLink = "";

    const existingCategories = await Category.find({});

    res.render('admin/add_product.ejs', { title: title, desc: desc, price: price, categories: existingCategories, ytLink: ytLink })
})

router.get('/edit-product/:id', isAdmin, async (req, res) => {
    let errors;
    if (req.session.error) errors = req.session.errors;

    req.session.error = null


    const existingCategories = await Category.find({});

    const existingProduct = await Product.findOne({ _id: req.params.id });
    if (!existingProduct) res.redirect('/admin/products');


    const galleryDir = `public/product_images/${existingProduct._id}/gallery`
    let galleryImages = null;

    galleryImages = await fs.readdir(galleryDir)
    if (!galleryImages) console.log("error")

    res.render('admin/edit_product.ejs', {
        title: existingProduct.title,
        id: existingProduct._id,
        error: errors,
        ytLink: existingProduct.ytLink,
        desc: existingProduct.desc,
        categories: existingCategories,
        category: existingProduct.category.replace(/\s+/g, '-').toLowerCase(),
        price: existingProduct.price,
        image: existingProduct.image,
        galleryImages: galleryImages
    })

    // const error = req.flash('success')
    // res.render('admin/edit_product.ejs', { title: page.title, slug: page.slug, content: page.content, id: page._id, error: error });

})


router.post('/add-product', async (req, res) => { //if no image is uploaded "req.files" will be null, but the product will still be save with an default image

    let { error } = validateCategory(req.body)
    const imageFile = req.files !== null ? req.files.image.name : ""; //IF the image file has no name its name will be set to an empty string

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase(); // If there aint no slug, turn the title into one
    let price = req.body.price;
    let category = req.body.category;
    let desc = req.body.desc;

    if (typeof req.body.ytLink != "undefined") {
        console.log(ytLink)
         let ytLink = ytUrlExtractor(req.body.ytLink)
    } else {
        ytLink = null;
    }




    const isImage = await validateImage(req.files); //returns "false" if anything other than an image is uploaded, It will return "true" if an image is uploaded or no image is uploaded

    if (!isImage) {
        const existingCategories = await Category.find({});
        const errors = 'Upload an Image please';
        res.render('admin/add_product.ejs', { title: title, desc: desc, price: price, categories: existingCategories, error: errors })
        return;
    }
    if (error) {
        const existingCategories = await Category.find({});
        res.render('admin/add_product.ejs', { title: title, desc: desc, price: price, categories: existingCategories, error: error })
    } else {
        Product.findOne({ slug: slug }, async (err, product) => {
            if (product) {
                const existingCategories = await Category.find({});
                req.flash('danger', 'Products exist choose another');
                const errors = `Products "${title}" exist choose another`
                res.render('admin/add_product.ejs', { title: title, desc: desc, price: price, categories: existingCategories, error: errors })
            } else {
                const price2 = parseFloat(price).toFixed(2);

                let newProduct = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    category: category,
                    price: price2,
                    image: imageFile,
                    ytLink:ytLink
                })

                newProduct.save((err) => {
                    if (err) { console.log(err) };
                    console.log(newProduct)

                    mkdirp('public/product_images/' + newProduct._id).then((err) => {
                        return console.log(err)
                    })

                    mkdirp(`public/product_images/${newProduct._id}/gallery`).then((err) => {
                        return console.log(err)
                    })

                    mkdirp(`public/product_images/${newProduct._id}/gallery/thumbs`).then((err) => {
                        return console.log(err)
                    })

                    if (imageFile != "") {
                        const productImage = req.files.image;
                        const path = `public/product_images/${newProduct._id}/${imageFile}`;
                        console.log(path)
                        productImage.mv(path, (err) => {
                            console.log(err)
                        })
                    }

                    req.flash('success', "product added");
                    res.redirect('/admin/products')
                })
            }
        })
    }
})






router.post('/edit-product/:id', async (req, res) => {

    let { error } = validateCategory(req.body)
    const imageFile = req.files !== null ? req.files.image.name : ""; //IF the image file has no name its name will be set to an empty string

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase(); // If there aint no slug, turn the title into one
    let price = req.body.price;
    let category = req.body.category;
    let desc = req.body.desc;
    let pimage = req.params.id
    let id = req.params.id;req

    // if (typeof ytLink != "undefined") {
    //      let ytLink = ytUrlExtractor(req.body.ytLink)
    // } else {
    //     ytLink = null;
    // }
    // console.log("typeof is")
    // console.log(typeof req.body.ytLink)
    if (req.body.ytLink.includes("youtube.com")) {        //here ytLink can be an empty string or a ytlink but no undefined
         ytLink = ytUrlExtractor(req.body.ytLink);
    } else {
         ytLink = req.body.ytLink;
        // console.log(ytLink)
    }
    

    const isImage = await validateImage(req.files); //returns "false" if anything other than an image is uploaded, It will return "true" if an image is uploaded or no image is uploaded
    if (!isImage) {
        const existingCategories = await Category.find({});
        const errors = 'Upload an Image please';
        res.render('admin/edit_product.ejs', { title: title, desc: desc, price: price, categories: existingCategories, ytLink: ytLink, error: errors })
        return;
    }

    if (error) {
        req.session.errors = error;
        res.redirect(`/admin/products/edit-product/${id}`)
    } else {
        const productExist = await Product.findOne({ slug: slug, _id: { $ne: id } });
        if (productExist) {
            req.flash('success', "Product Exists, choose another")
            res.redirect(`/admin/products/edit-product/${id}`);
        } else {
            console.log(ytLink);
            let p = await Product.findById(id)
            p.title = title;
            p.slug = slug;
            p.price = price;
            p.desc = desc;
            p.category = category;
            p.ytLink = ytLink;
            if (imageFile != "") p.image = imageFile;
            try {
                p = await p.save().catch((err) => console.log(err));
            } catch (e) {
                console.log("no success" + e);
                req.flash('error', "An error occured")
                res.redirect('/admin/products')
            }

            if (imageFile != '') {
                if (pimage != "") {
                    fs.remove(`public/product_images/${p._id}/pimage`).catch(err => console.log(err))
                }

                const productImage = req.files.image;
                const path = `public/product_images/${id}/${imageFile}`;

                productImage.mv(path, (err) => console.log(err))
            }


            req.flash('success', "Product Edited Successfully");
            res.redirect('/admin/products')

        }
    }

})


router.post('/upload-gallery/:id', async (req, res) => {

    // const isImage = await validateImage(req);        //returns "false" if anything other than an image is uploaded, It will return "true" if an image is uploaded or no image is uploaded
    // if (!isImage) {
    //     req.flash('success', "Upload an Image please")
    //     res.redirect(`/admin/edit-product/${req.params.id}`)
    // }
    const productImage = req.files.file;
    const id = req.params.id;

    const path = `public/product_images/${id}/gallery/${productImage.name}`
    const thumbsPath = `public/product_images/${id}/gallery/thumbs/${productImage.name}`
    
    productImage.mv(path, (err) => {
        console.log(err)

        resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then((buf) => {
            fs.writeFileSync(thumbsPath, buf)
        })

    })

    res.sendStatus(200)
})

// DELETE THE WHOLE PRODUCT WITH ALL ITS IMAGES
router.get('/delete-product/:id', isAdmin, async (req, res) => {

    const imageToBeDeleted = `public/product_images/${req.params.id}`

    fs.remove(imageToBeDeleted, (err) => { ///does nothing if the given path doesn't exist
        if (err) console.log(err);
    })

    const deletedProduct = await Product.findByIdAndRemove(req.params.id).catch((err) => console.log(err))
    req.flash("success", `Product "${deletedProduct.title}" was deleted`)
    res.redirect('/admin/products')
})


router.get('/delete-image/:image', (req, res) => {

    const originalImage = `public/product_images/${req.query.id}/gallery/${req.params.image}`;
    const thumbsImage = `public/product_images/${req.query.id}/gallery/thumbs/${req.params.image}`;

    fs.remove(originalImage, (err) => {
        if (err) {
            console.log(err);
        } else {
            fs.remove(thumbsImage, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    req.flash("error", "Image deleted");
                    res.redirect(`/admin/products/edit-product/${req.query.id}`)
                }
            })
        }
    })
})

async function validateImage(file) {
    // console.log(file.mimetype)
    if (file === null || file.name === "") {
        console.log("THe file name is empty")
        return true
    }

    if (!file.image.mimetype.startsWith('image/')) {
        console.log("called")
        return false;
    } else
        return true;
}

function ytUrlExtractor(currentUrl) {
    const current_url = new URL(currentUrl);        //Extracting the youtubeLink 
    const search_params = current_url.searchParams;
    return ytLink = search_params.get('v')
}

module.exports = router;


// router.post('/add-product', async (req, res) => {

//     if (!req.files) {
//         imageName = "";
//         saveProduct(req.body, imageName);
//     } else {
//         const isImage = validateImage(req.files.image);

//     }

// })


// async function ()