const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const users = require('./routes/users.js') 
const adminPages = require('./routes/admin_pages.js') 
const session = require('express-session')
const path = require('path')

const app = express()
// Aishah@07
app.set("view-engine", "ejs")

app.use(express.json()) 							//i.e every express request passes through this function and if the request is in json format, it will return req.body 
app.use(express.urlencoded({ extended: true })) 	//Inbilt middleware that identifies incoming request Objects as strings or arrays only if the "extended is set to true"
app.use(express.json())
app.use(cookieParser("SomeSecret"))
app.use(session({
	secret: 'SecretSessionShits',
	resave: false,
	saveUninitialized: false
}))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))
app.locals.error = null;



app.use('/auth', users)
app.use('/admin/pages', adminPages)

mongoose.connect('mongodb://localhost/playground') 
	.then(() => console.log("Connected to Mongodb server..."))
	.catch(err => console.log(err))

function isAuthenticated(req, res, next) {

	if (req.session.loggedIn) {
		return next()
	} 
	res.redirect('/auth/login')
}


 app.get('/', (req, res) => {
 	console.log(req.body)
 	res.render("index.ejs", {name: "umar"})
 })



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started successfully on port ${port}`);
});