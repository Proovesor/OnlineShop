const express = require('express');

const shopContr = require('../controllers/shopProducts');

const router = express.Router();

router.get('/', shopContr.getIndex)

router.get('/products', shopContr.getProducts);

router.get('/products/:productId', shopContr.getProdById);

router.get('/cart', shopContr.getCart);

router.post('/cart', shopContr.postCart);

router.post('/delete-cart-product', shopContr.postDeleteCartProd);

router.post('/create-order', shopContr.postOrder);

router.get('/orders', shopContr.getOrders);


module.exports = router;