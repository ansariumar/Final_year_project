

const flash = require('connect-flash');
const express = require('express');
const { Page, validatePage } = require('./../models/pagesM.js')

const router = express.Router();


router.get('/', async (req, res) => 
{
	const DBpages = await Page.find()
		.sort({sorting: 'asc'})
	
	res.render('admin/pages.ejs', {pages: DBpages})
})

router.get('/add-page', (req, res) => {
	const title = "";
	const slug = "";
	const content = "";

	res.render('admin/add_page.ejs', { title: title, slug: slug, content: content })
})

router.get('/edit-page/:slug', async (req,res) => {

	const page = await Page.findOne({slug: req.params.slug});

	if (!page) res.redirect('/');
	
	// res.render('admin/edit_page', {title: page.title,slug: page.slug, content: page.content,id: page._id});
	res.render('admin/edit_page.ejs', {page: page});
	
})


router.post('/add-page', (req, res) => {

	const { error } = validatePage(req.body)

	let title = req.body.title;
	let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
	if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase(); // If there aint no slug, turn the title into one
	let content = req.body.content;

	if (error) {
		res.render('admin/add_page.ejs', {title: title, slug: slug, content: content, error: error})
	} else {
		Page.findOne({slug: slug}, async (err, page) => {
			if (page) {
				req.flash('danger', 'Page slug exist choose another');
				res.render('admin/add_page.ejs', {title: title, slug: slug, content: content});
			} else {
				let page = new Page({
					title: title,
					slug: slug,
					content: content,
					sorting: 0,
				})

				try {
					page = await page.save().catch((err) => console.log(err));
					req.flash('success', "Page Added!")
					res.redirect('/admin/pages')
				} catch {
					req.flash('error', "An error occured")
					res.redirect('/admin/pages')
				}
			}
		})
	}
})

router.post("/reorder-pages", async(req, res) => {
	// console.log(req.body.id)
	const ids = req.body.id;
	let count = 0;

	for(let i = 0; i < ids.length; i++) {
		const id = ids[i];
		count++;

		let page = await Page.findById(id);
		page.sorting = count;
		page = await page.save().catch((err) => console.log(err))
	}
})

module.exports = router;   

