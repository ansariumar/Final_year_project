const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const Pages = require('./routes/pages.js');
const Products = require('./routes/products.js');
const users = require('./routes/users.js') ;
const adminPages = require('./routes/admin_pages.js'); 
const adminCategory = require('./routes/admin_category.js') ;
const adminProducts = require('./routes/admin_products.js');
const session = require('express-session');
const path = require('path');
const { Page } = require('./models/pagesM.js');
const { Category } = require('./models/CategoryM.js');


const app = express()
// Aishah@07
app.set("view-engine", "ejs")


//THE MIDDLEWARES
app.use(express.json()) 							//i.e every express request passes through this function and if the request is in json format, it will return req.body 
app.use(express.urlencoded({ extended: true })) 	//Inbilt middleware that identifies incoming request Objects as strings or arrays only if the "extended is set to true"
app.use(methodOverride('_method'));             //if tis line moves below, the delete button won't work

app.use(fileUpload({ createParentPath: true}))
app.use(cookieParser("SomeSecret"))
app.use(session({
	secret: 'SecretSessionShits',
	resave: true,
	saveUninitialized: true
}))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

//THE LOCAL VARIABLES 
app.locals.error = null;
Page.find({}).sort({sorting: 1}).exec((err, pages) => {
	 if (err) console.log(err);
	 else app.locals.pages = pages
})

Category.find({}, (err, categories) => {
	console.log(categories)
	 if (err) console.log(err);
	 else app.locals.categories = categories
})

//THE PATHS MIDDLEWARE
app.use('/auth', users)

app.use('/products', Products)
app.use('/admin/pages', adminPages)
app.use('/admin/categories', adminCategory)
app.use('/admin/products', adminProducts)
app.use('/', Pages)

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0') 
	.then(() => console.log("Connected to Mongodb server..."))
	.catch(err => console.log(err))

function isAuthenticated(req, res, next) {

	if (req.session.loggedIn) {
		return next()
	} 
	res.redirect('/auth/login')
}


//  app.get('/', (req, res) => {
//  	console.log(req.body)
//  	res.render("index.ejs", {name: "umar"})
//  })



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started successfully on port ${port}`);
});