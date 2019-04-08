const express = require('express');

const shopContr = require('../controllers/shopProducts');

const router = express.Router();

router.get('/', shopContr.getIndex)

router.get('/products', shopContr.getProducts);

router.get('/products/:productId', shopContr.getProdById);

router.get('/cart', shopContr.getCart);

router.post('/cart', shopContr.postCart);

router.get('/orders', shopContr.getOrders);

router.get('/checkout', shopContr.getCheckout);

module.exports = router;