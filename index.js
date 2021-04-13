const express = require('express');
const app = express();
const connection = require('./database/database');

const categoriesController = require('./app/categories/CategoriesController');
const articlesController = require('./app/articles/ArticlesController');

const Article = require('./app/articles/Article');
const Category = require('./app/categories/Category');

app.set('view engine', 'ejs'); // View Engine

app.use(express.static('public')); // Public Folder
app.use(express.urlencoded({ extended: true })); // Body parser
app.use(express.json()); // JSON reader

//Database
connection
	.authenticate()
	.then(() => {
		console.log('Database connected');
	})
	.catch((error) => {
		console.log(`Database error: ${error}`)
	});

app.use('/', categoriesController);
app.use('/', articlesController);

//Routes
app.get('/', (req, res) => {
	Article.findAll({
		order: [['id', 'desc']]
	}).then((articles) => {
		Category.findAll().then((categories) => {
			res.render('index', { articles, categories })
		});
	});
});

app.get('/:slug', (req, res) => {
	let slug = req.params.slug;
	Article.findOne({
		where: { slug }
	}).then(article => {
		if (article != undefined) {
			Category.findAll().then((categories) => {
				res.render('article', { article, categories })
			});
		} else {
			res.redirect('/');
		}
	}).catch(error => {
		res.redirect('/');
	});
});

app.get('/category/:slug', (req, res) => {
	let slug = req.params.slug;
	Category.findOne({
		where: { slug },
		include: [{ model: Article }]
	}).then((category) => {
		if (category !== undefined) {
			Category.findAll().then(categories => {
				res.render('index', { articles: category.articles, categories });
			})
		} else {
			res.redirect('/');
		}
	}).catch(err => {
		res.redirect('/');
	});
});

app.listen(8080, () => {
	console.log('Servidor iniciado');
});