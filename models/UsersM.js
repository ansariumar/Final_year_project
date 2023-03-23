const Joi = require('joi')
const mongoose = require('mongoose')
const passwordComplexity = require("joi-password-complexity");

const User = mongoose.model('User', new mongoose.Schema({
	name:{
		type: String,
		required: true,
		minlenght: 5,
		maxlength: 50	
	},
	email:{
		type: String,
		required: true,
		minlenght: 5,
		maxlength: 255,
		unique: true	
	},
	password:{
		type: String,
		required: true,
		minlenght: 5,
		maxlength: 1024	
	},
	admin: {
		type: Number
	}
	
}))


function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(225).email().required(),
		password: passwordComplexity()
		})

	return schema.validate(user);
}

function validateLogin(user) {
	const schema = Joi.object({
		email: Joi.string().min(5).max(225).email().required(),
		password: passwordComplexity()
	})

	return schema.validate(user);
}


exports.validateLogin = validateLogin;
exports.User = User;
exports.validate = validateUser;