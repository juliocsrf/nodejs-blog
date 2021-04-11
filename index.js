const express = require('express');
const app = express();
const connection = require('./database/database');

const categoriesController = require('./app/categories/CategoriesController');
const articlesController = require('./app/articles/ArticlesController');

app.set('view engine', 'ejs'); // View Engine

app.use(express.static('public')); // Public Folder
app.use(express.urlencoded({ extended: true })); // Body parser
app.use(express.json()); // JSON reader

//Database
connection
	.authenticate()
	.then(()=>{
		console.log('Database connected');
	})
	.catch((error)=>{
		console.log(`Database error: ${error}`)
	});

app.use('/', categoriesController);
app.use('/', articlesController);

//Routes
app.get('/', (req, res) => {
	res.render('index');
});

app.listen(8080, () => {
	console.log('Servidor iniciado');
});