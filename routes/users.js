const express = require('express');
const router = express.Router();
const { validate, User, validateLogin } = require('./../model/UsersM.js')
const bcrypt = require('bcrypt')


router.get('/register', (req, res) => {
	res.render("register.ejs")
})

router.get('/login', (req, res) => {
	res.render("login.ejs")
})

router.post('/login', async (req, res) => {
	console.log(req.body)
	const { error } = validateLogin(req.body)
	if (error) {return res.status(400).send(error.details[0].message)}

	let user = await User.findOne({email: req.body.email});			//the findOne returns the whole document with that matches the email 
	
	if (!user) {return res.status(400).send("email or password incorrect")}

	const validatePassword = await bcrypt.compare(req.body.password, user.password);
	if (!validatePassword) {return res.status(400).send("email or password incorrect")}
	
	res.render("index.ejs", {name: user.name})
})

router.post('/register', async (req, res) => {

	const { error } = validate(req.body);	//joi validation
	if (error) {return res.status(400).send(error.details[0].message)} 

	let user = await User.findOne({email: req.body.email});
	if (user) {return res.status(400).send("User already Exist")}


	user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
		})
	
	user.password = await bcrypt.hash(req.body.password, 10);	//encrypting the password before storing it in DB
	const result = await user.save()

	// res.send({name: user.name} )
	res.render("index.ejs", {name: user.name})
})


module.exports = router;