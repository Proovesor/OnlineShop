const express = require('express');

const shopContr = require('../controllers/shopProducts');
const isLogged = require('../midware/is-logged');

const router = express.Router();

router.get('/', shopContr.getIndex)

router.get('/products', shopContr.getProducts);

router.get('/products/:productId', shopContr.getProdById);

router.get('/cart', isLogged, shopContr.getCart);

router.post('/cart', isLogged, shopContr.postCart);

router.post('/delete-cart-product', isLogged, shopContr.postDeleteCartProd);

router.post('/create-order', isLogged, shopContr.postOrder);

router.get('/orders', isLogged, shopContr.getOrders);


module.exports = router;