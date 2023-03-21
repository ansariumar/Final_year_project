

const flash = require('connect-flash');
const express = require('express');
const { Category } = require('../models/CategoryM.js');
const { Page, validatePage } = require('./../models/pagesM.js')

const router = express.Router();


router.get('/', async (req, res) => {
	const DBpages = await Page.find()
		.sort({sorting: 'asc'})
	const error = req.flash("success")
	res.render('admin/pages.ejs', {title: "All Pages", pages: DBpages, error: error})
})

router.get('/add-page', (req, res) => {
	const title = "";
	const slug = "";
	const content = "";

	res.render('admin/add_page.ejs', { title: title, slug: slug, content: content })
})

router.get('/edit-page/:id', async (req,res) => {

	const page = await Page.findOne({_id: req.params.id});

	if (!page) res.redirect('/');
	const error = req.flash('success')
	// res.render('admin/edit_page', {title: page.title,slug: page.slug, content: page.content,id: page._id});
	res.render('admin/edit_page.ejs', {title: page.title, slug: page.slug, content: page.content, id: page._id, error: error});
	
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
				const errors = `The Page Title "${page.title}" exist choose another`;
				res.render('admin/add_page.ejs', {title: title, slug: slug, content: content, error: errors});
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



router.post('/edit-page/:id', (req, res) => {

	const pageWithoutId = {title: req.body.title, slug: req.body.slug, content: req.body.content}
	const { error } = validatePage(pageWithoutId)		//bascially checks if the fields are empty and more than 5 letters are written or not

	let title = req.body.title;
	let  slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
	if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase(); // If there aint no slug, turn the title into one
	let content = req.body.content;
	let id = req.params.id;
	console.log(req.body.id)

	const page = {title: title, slug: slug, content: content, error: error, id: id}

	if (error) {
		res.render('admin/edit_page.ejs', {title: title, slug: slug, content: content, error: error, id: id})
	} else {
		console.log("nigga")
		// the below line means "find  a document whose slug is slug and id is not equal to the current id"
		Page.findOne({slug: slug, _id: {$ne: id}},async  function(err,page){
			console.log(page)
                if(page){
                    console.log("inside");
                    req.flash('danger','Page Already Exist Choose new');
                    res.render('admin/edit_page.ejs',{
                        title:title,
                        slug:slug,
                        content:content,
                        id:id
                    });
			} else {
				
		console.log("nigga2")
				let page = await Page.findById(id);
				console.log(page)
				page.title = title;
				page.slug = slug;
				page.content = content;

				try {
					console.log("success")
					page = await page.save().catch((err) => console.log(err));
					req.flash('success', "Page Added!")
					res.redirect(`/admin/pages/edit-page/${page._id}`)
				} catch {
					console.log("no success")

					req.flash('error', "An error occured")
					res.redirect('admin/pages.ejs')
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


router.get('/delete-page/:id', async (req, res) => {
	const dletedpage = await Page.findByIdAndRemove(req.params.id).catch((err) => console.log(err))
	req.flash("success", "page deleted")
	res.redirect('/admin/pages')
})

module.exports = router;   

