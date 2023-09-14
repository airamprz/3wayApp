const express = require('express');
const router = express.Router();



const users = require('../controllers/users.controller');
const products = require('../controllers/products.controller');
const messageController = require('../controllers/messages.controller');
const secure = require('../middlewares/secure.mid');
const upload = require('../config/multer.config');


router.get('/register', users.register);
router.post('/register', users.doRegister);
router.get('/login', users.login);
router.post('/login', users.doLogin);
router.get('/logout', secure.isAutenticated, users.logout);
router.get('/profile/:userId', secure.isAutenticated, users.profile);



//router.get('/products', products.create);
router.get('/products/create', secure.isAutenticated, products.createPage);
router.post('/products', upload.single("image"), secure.isAutenticated, products.doCreate);
router.get('/products/:productId', products.detail);


router.get('/search', products.search); // Sirve para buscar productos por categoría o por texto
router.get('/', products.getLatestProduct); // Sirve para obtener lista de productos más recientes
router.post('/products/:id/delete', products.deleteProduct); // Sirve para eliminar un producto



router.post('/products/:id/messages', secure.isAutenticated, messageController.doMessage);

module.exports = router;
