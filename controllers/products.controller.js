const Product = require('../models/product.model');
const Message = require('../models/message.model');
const mongoose = require('mongoose');
const moment = require('moment/moment');

module.exports.createPage = (req, res, next) => {
    res.render('products/create');
}

module.exports.doCreate = (req, res, next) => {
    Product.create({
        title: req.body.title,
        description: req.body.description,
        user: req.user.id,
        price: req.body.price,
        category: req.body.category,
        image: req.file.path
    })
        .then(() => res.redirect('/'))
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('tweets/create', {
                    tweet: req.body,
                    errors: error.errors
                })
            } else {
                next(error);
            }
        })
}

module.exports.create = (req, res, next) => {
    Product.find()
        .populate({
            path: 'user',
            select: 'username'
        })
        .sort({ createdAt: -1 })
        .then((products) => res.render('products/create', { products }))
        .catch((error) => next(error));
}

module.exports.detail = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        // Recupera el producto con el ID especificado
        const product = await Product.findById(productId).populate('user', 'username');
        const messages = await Message.find({ product: productId });

        if (!product) {
            // Si no se encuentra el producto, puedes redirigir a una página de error o hacer algo más.
            return res.status(404).send('Producto no encontrado');
        }

        const formattedDate = moment(product.createdAt).format('DD/MM/YYYY');

        // Renderiza la vista de la página de producto con los datos del producto
        res.render('products/productPage', { product, messages, formattedDate });
    } catch (error) {
        console.error(error);
        // Maneja los errores apropiadamente
        res.status(500).send('Error interno del servidor');
    }
}

module.exports.deleteProduct = (req, res, next) => {
    Product.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/profile'))
        .catch((error) => next(error));
}

module.exports.search = async (req, res, next) => {
    const category = req.query.category;
    const query = req.query.query;

    try {
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (query) {
            filter.$text = { $search: query };
        }

        const products = await Product.find(filter)
            .populate({
                path: 'user',
                select: 'username'
            })
            .sort({ createdAt: -1 });

        res.render('products/searchResults', { products });
    } catch (error) {
        console.error(error);
        // Maneja los errores apropiadamente
        res.status(500).send('Error interno del servidor');
    }
};

module.exports.getLatestProduct = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate({
                path: 'user',
                select: 'username'
            })
            .sort({ createdAt: -1 })
            .limit(10);

        res.render('home', { products });
    } catch (error) {
        console.error(error);
        // Maneja los errores apropiadamente
        res.status(500).send('Error interno del servidor');
    }
}


