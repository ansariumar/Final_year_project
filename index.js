const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const users = require('./routes/users.js')
const session = require('express-session')

const app = express()

app.set("view-engine", "ejs")

app.use(express.json()) 							//i.e every express request passes through this function and if the request is in json format, it will return req.body 
app.use(express.urlencoded({ extended: true })) 	//Inbilt middleware that identifies incoming request Objects as strings or arrays only if the "extended is set to true"
app.use(express.json())
app.use(cookieParser("SomeSecret"))
app.use(session({
	secret: 'SecretSessionShits',
	cookie: { maxAge: 60000 },
	resave: true,
	saveUninitialized: true
}))
app.use(flash())

app.use('/auth', users)

mongoose.connect('mongodb://localhost/playground') 
	.then(() => console.log("Connected to Mongodb server..."))
	.catch(err => console.log(err))

 app.get('/', (req, res) => {
 	res.render("index.ejs", {name: "you are Not Logged in"})
 })

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started successfully on port ${port}`);
});