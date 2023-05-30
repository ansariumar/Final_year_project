const mongoose = require('mongoose');
const Joi = require('joi');
const slugify = require('slugify');


const PagesSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		unique: true
	},
	content: {
		type: String,
		required: true
	},
	sorting: {
		type: Number,
	},
	date: {
		type: Date,
		default: Date.now
	}
})

const Pages = mongoose.model('page', PagesSchema);

function validatePage(page) {
	if (!page.slug) slugify(page.title, {lower: true, strict: true})

	const schema = Joi.object({
		title: Joi.string().max(225).required(),
		slug: Joi.string(),
		content: Joi.string().min(5).required(),
		sorting: Joi.number(),
	}).options({allowUnknown: true})

	return schema.validate(page);
}

exports.Page = Pages;
exports.validatePage = validatePage;