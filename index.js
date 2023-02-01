const express = require('express');
const app = express()
const mongoose = require('mongoose');
const users = require('./routes/users.js')

app.set("view-engine", "ejs")
app.use(express.json()) //i.e every express request passes through this function and if the request is in json format, it will return req.body 
app.use(express.urlencoded({ extended: true })) //Inbilt middleware that identifies incoming request Objects as strings or arrays only if the "extended is set to true"
app.use(express.json())
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