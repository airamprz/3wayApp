require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const flash = require('connect-flash');

require('./config/db.config');
require('./config/hbs.config.js');

const app = express();
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

const sessionConfig = require('./config/session.config');
app.use(sessionConfig.session);
app.use(sessionConfig.loadSessionUser);
app.use(flash());

app.use((req, res, next) => {
    res.locals.navigationPath = req.path;
    next();
})

const routes = require('./config/routes.config');
app.use('/', routes);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/messages', (req, res) => {
    res.render('messages/messages');
});

app.get('/product', (req, res) => {
    res.render('products/product');
});


app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Aplication is running in port ${PORT}`));