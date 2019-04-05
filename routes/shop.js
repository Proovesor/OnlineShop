const express = require('express');

const shopContr = require('../controllers/shopProducts');

const router = express.Router();

router.get('/', shopContr.getIndex)

router.get('/products', shopContr.getProducts);

router.get('/cart', shopContr.getCart);

router.get('/checkout', shopContr.getCheckout);

module.exports = router;