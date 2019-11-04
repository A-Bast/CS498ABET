var express = require('express');
var mustache = require('../common/mustache')
var router = express.Router();
//This imports the user library file
var user_lib = require('../lib/user')

/* GET login page */
router.get('/', function (req, res, next) {
	res.render('base_template', {
		title: 'Login',
		body: mustache.render('login')
	})
})

/* POST login page */
router.post('/', (req, res, next) => {
	// hard coded username and password AND checks if the username is in the user library
	if (req.body.username === 'user' && req.body.password === 'password' && user_lib.is_whitelisted(req.body.username)) {
		res.redirect(302, '/course/')
	} else {
		res.redirect(302, '/login/')
	}
})

/* TEACHER login page */


module.exports = router;

  //TASK: Check if the username matches the ones in the whitelist
  //Edited by: Jeremy Farmer
  //Viewed by: 
