const mongoose = require('mongoose');
const Joi = require('joi');
const slugify = require('slugify');


const CategorySchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		unique: true
	}
})

const Category = mongoose.model('category', CategorySchema);

function validateCategory(page) {
	// if (!page.slug) slugify(page.title, {lower: true, strict: true})

	const schema = Joi.object({
		title: Joi.string().max(225).required()
	}).options({allowUnknown: true})

	return schema.validate(page);
}

exports.Category = Category;
exports.validateCategory = validateCategory;