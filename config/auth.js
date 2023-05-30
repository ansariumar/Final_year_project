



exports.isAdmin = (req, res, next) => {
	if (req.session.user && req.session.user.admin === 1) {
		next()
	} else {
		req.flash('loginError', "Please login as ADMIN");
		res.redirect('/auth/login');
	}
}