const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const flash = require('connect-flash');
const { validate, User, validateLogin } = require('./../models/UsersM.js')


router.get('/register',isNotAuthenticated , (req, res) => {
	const error = req.flash('registerError')
	res.render("registerTest.ejs", { error: error })	// <--
})

router.get('/login', isNotAuthenticated, (req, res) => {
	const error = req.flash('loginError')
	res.render("loginTest.ejs", { error: error })
})

router.get('/logout',  function (req, res, next)  {
    // If the user is loggedIn
    if (req.session.user) {
         req.session.user = false;
        res.redirect('/auth/login');
    }else{
        // Not logged in
        res.redirect('/auth/login');
    }
});

router.post('/login',isNotAuthenticated ,async (req, res) => {
	
	const { error } = validateLogin(req.body)
	if (error) {
		req.flash('loginError', "email or password incorrect");
		return res.status(400).redirect('/auth/login')
	}

	let user = await User.findOne({email: req.body.email});			//the findOne returns the whole document with that matches the email 
	if (!user) {
		req.flash('loginError', "email or password incorrect");
		return res.status(400).redirect('/auth/login')
	}	

	const validatePassword = await bcrypt.compare(req.body.password, user.password);
	if (!validatePassword) {
		req.flash('loginError', "email or password incorrect");
		return res.status(400).redirect('/auth/login')
	}
	
	req.session.user = user
	res.redirect('/')
})

router.post('/register',isNotAuthenticated , async (req, res) => {

	// let newUser = new User()
	// newUser.name = req.body.name
	// newUser.email = req.body.email
	// newUser.password = req.body.password 

	const { error } = validate(req.body);	//joi validation
	if (error) {
		req.flash('registerError', error.details[0].message)
		return res.status(400).redirect('/auth/register')
	}

	let user = await User.findOne({email: req.body.email});
	if (user) {
		req.flash('registerError', 'User already Exist');
		return res.status(400).redirect('/auth/register')
	}

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);  //encrypting the password before storing it in DB

		user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword

		})
	
		const result = await user.save()

		res.redirect('/auth/login')
	} catch {
		res.redirect('/auth/register')
	}
	
})


function isNotAuthenticated(req, res, next) {
	if (req.session.user) {
		return res.redirect('/')
	} 
	 next()
}



module.exports = router;   