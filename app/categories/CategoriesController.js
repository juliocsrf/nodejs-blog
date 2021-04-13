const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

router.get('/admin/categories/new', (req, res) => {
	res.render('admin/categories/new');
});

router.post('/categories/save', (req, res) => {
	let title = req.body.title;
	if (title != undefined && title != '') {
		Category.create({
			title,
			slug: slugify(title, {lower: true})
		}).then(() => {
			res.redirect('/admin/categories');
		});
	} else {
		res.redirect('/admin/categories/new');
	}
});

router.get('/admin/categories', (req, res) => {
	let categories = Category.findAll().then(categories => {
		res.render('admin/categories/index', { categories })
	});
});

router.post('/categories/delete', (req, res) => {
	let id = req.body.id;
	if (id != undefined) {
		if (!isNaN(id)) {
			Category.destroy({
				where: {
					id: id
				}
			}).then(() => {
				res.redirect('/admin/categories');
			})
		} else {
			res.redirect('/admin/categories');
		}
	} else {
		res.redirect('/admin/categories');
	}
});

router.get('/admin/categories/edit/:id', (req, res) => {
	let id = req.params.id;
	if (isNaN(id)) {
		res.redirect('/admin/categories');
	}
	Category.findByPk(id).then(category => {
		if (category != undefined) {
			res.render('admin/categories/edit', { category });
		} else {
			res.redirect('/admin/categories');
		}
	}).catch(error => {
		res.redirect('/admin/categories');
	})
});

router.post('/categories/update', (req, res) => {
	let id = req.body.id;
	let title = req.body.title;
	let slug = slugify(title, {lower: true});

	Category.update({
		title, slug
	}, {
		where: { id }
	}).then(()=>{
		res.redirect('/admin/categories');
	});
});

module.exports = router;