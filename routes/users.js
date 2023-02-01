const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const flash = require('connect-flash');
const { validate, User, validateLogin } = require('./../models/UsersM.js')


router.get('/register', (req, res) => {
	const error = req.flash('registerError')
	res.render("register.ejs", { error: error })
})

router.get('/login', (req, res) => {
	const error = req.flash('loginError')
	res.render("login.ejs", { error: error })
})

router.post('/login', async (req, res) => {
	console.log(req.body)
	const { error } = validateLogin(req.body)
	// if (error) {return res.status(400).send(error.details[0].message)}
	if (error) {
		req.flash('loginError', error.details[0].message);
		return res.redirect('/auth/login')
	}

	let user = await User.findOne({email: req.body.email});			//the findOne returns the whole document with that matches the email 
	// if (!user) {return res.status(400).send("email or password incorrect")}
	if (!user) {
		req.flash('loginError', "email or password incorrect");
		return res.redirect('/auth/login')
	}	

	const validatePassword = await bcrypt.compare(req.body.password, user.password);
	if (!validatePassword) {return res.status(400).send("email or password incorrect")}
	
	res.render("index.ejs", {name: user.name})
})

router.post('/register', async (req, res) => {

	const { error } = validate(req.body);	//joi validation
	if (error) {
		req.flash('registerError', error.details[0].message)
		return res.redirect('/auth/register')
	}

	let user = await User.findOne({email: req.body.email});
	if (user) {
		req.flash('registerError', 'User already Exist');
		return res.redirect('/auth/register')
	}

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);  //encrypting the password before storing it in DB

		user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		})
	
		// user.password = await bcrypt.hash(req.body.password, 10);	
		const result = await user.save()

		res.redirect('/auth/login')
	} catch {
		res.redirect('/auth/register')
	}
	
})


module.exports = router;