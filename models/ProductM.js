const mongoose = require('mongoose');
const Joi = require('joi');
const slugify = require('slugify');


const ProductSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		unique: true
	},
	desc: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	ytLink: {
		type: String
	},
	price: {
		type: Number,
	},
	image: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
})

const Product = mongoose.model('product', ProductSchema);

function validateProduct(product) {
	if (!product.slug) slugify(product.title, {lower: true, strict: true})

	const schema = Joi.object({
		title: Joi.string().max(225).required(),
		slug: Joi.string(),
		desc: Joi.string().min(5).max(225).required(),
		price: Joi.number(),
	}).options({allowUnknown: true})

	return schema.validate(product);
}

exports.Product = Product;
exports.validateProduct = validateProduct;