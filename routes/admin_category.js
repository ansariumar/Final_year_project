

const flash = require('connect-flash');
const express = require('express');
const { Category, validateCategory } = require('./../models/CategoryM.js')

const router = express.Router();


router.get('/', async (req, res) => {
	const DBcategory = await Category.find({})
	let error = req.flash("success")

	if (error.length === 0) error = null
	res.render('admin/categories.ejs', { title: "All products", categories: DBcategory, error: error })
})


router.get('/add-category', (req, res) => {
	const title = "";
	let error = req.flash("success")
	if (error.length === 0) error = null
	res.render('admin/add_category.ejs', { title: title, error: error })
})

router.get('/edit-category/:id', async (req, res) => {
	// console.log("niggaaaaaaa")
	// console.log(req.body)
	const editCategory = await Category.findById({ _id: req.params.id });

	if (!editCategory) res.redirect('/admin/category');

	const error = req.flash('success')
	// res.render('admin/edit_page', {title: page.title,slug: page.slug, content: page.content,id: page._id});
	res.render('admin/edit_category.ejs', { title: editCategory.title, id: editCategory._id, error: error });

})


router.post('/add-category', (req, res) => {
	console.log(req.body)
	const { error } = validateCategory(req.body)

	let title = req.body.title;
	let slug = title.replace(/\s+/g, '-').toLowerCase();


	if (error) {
		console.log("errors")
		res.render('admin/add_category.ejs', { title: title, error: error })
	} else {
		Category.findOne({ slug: slug }, async (err, category) => {		//checks if the category exists
			if (category) {
				req.flash('success', `Category '${title}' exist, choose another`);
				// res.render('admin/add_category.ejs', {title: title});
				res.redirect('/admin/categories/add-category');
			} else {
				let newCategory = new Category({
					title: title,
					slug: slug
				})

				try {
					newCategory = await newCategory.save().catch((err) => console.log(err));

					Category.find({}, (err, categories) => {			//As we are using the categories in the header so everytime we create a new category we update the global variable
						console.log(categories)
						 if (err) console.log(err);
						 else req.app.locals.categories = categories
					})

					console.log(newCategory)
					req.flash('success', "Category Added!")
					res.redirect('/admin/categories')
				} catch {
					console.log("success")

					req.flash('error', "An error occured")
					res.redirect('/admin/categories')
				}
			}
		})
	}
})



router.post('/edit-category/:id', (req, res) => {

	// const pageWithoutId = {title: req.body.title, slug: req.body.slug, content: req.body.content}
	const { error } = validateCategory(req.body)		//bascially checks if the fields are empty and more than 5 letters are written or not

	let title = req.body.title;
	let slug = title.replace(/\s+/g, '-').toLowerCase();
	let id = req.params.id;
	// console.log(req.body.id)

	// const page = {title: title, slug: slug, content: content, error: error, id: id}

	if (error) {
		res.render('admin/edit_category.ejs', { title: title, id: id, error: error })
	} else {
		// console.log("nigga")
		// the below line means "find  a document whose slug is slug and id is not equal to the current id"
		Category.findOne({ slug: slug, _id: { $ne: id } }, async function (err, category) {

			if (category) {
				console.log("inside");
				const e = req.flash('danger', 'Category Already Exist Choose new');
				console.log("the fuck is this: " + e)
				res.render('admin/edit_category.ejs', { title: title, id: id });
			} else {

				let category = await Category.findById(id);
				category.title = title;		//updating the title
				category.slug = slug

				try {
					console.log("success")
					category = await category.save().catch((err) => console.log(err));
					console.log(category + " was added ");

					Category.find({}, (err, categories) => {		//As we are using the categories in the header so everytime we update a existing category we update the global variable
						console.log(categories)
						 if (err) console.log(err);
						 else req.app.locals.categories = categories
					})

					req.flash('success', "Category Updated!")
					res.redirect(`/admin/categories/edit-category/${id}`)
				} catch {
					console.log("no success")

					req.flash('error', "An error occured")
					res.redirect('/admin/categories')
				}
			}
		})
	}
})



router.post("/reorder-pages", async (req, res) => {
	// console.log(req.body.id)
	const ids = req.body.id;
	let count = 0;

	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		count++;

		let page = await Page.findById(id);
		page.sorting = count;
		page = await page.save().catch((err) => console.log(err))
	}
})

router.get('/delete-category/:id', async (req, res) => {

	try {
		const deletedCategory = await Category.findByIdAndRemove(req.params.id).catch((err) => console.log(err))

		Category.find({}, (err, categories) => {		//As we are using the categories in the header so everytime we delete a existing category we update the global variable
			console.log(categories)
			 if (err) console.log(err);
			 else req.app.locals.categories = categories
		})
		req.flash("success", `The Category "${deletedCategory.title}" was deleted`)
		res.redirect('/admin/categories')
	} catch {
		req.flash("success", "An error occured")
		res.redirect('/admin/categories')
	}
	
})


module.exports = router;

