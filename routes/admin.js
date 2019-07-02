const express = require('express');

const adminContr = require('../controllers/product');
const isLogged = require('../midware/is-logged');

const router = express.Router();


router.get('/add-product', isLogged, adminContr.getAddProd)

router.post('/add-product', isLogged, adminContr.postAddProd)

router.get('/edit-product/:productId', isLogged, adminContr.getEditProd)

router.post('/edit-product', isLogged, adminContr.postEditProd)

router.post('/delete-product', isLogged, adminContr.postDeleteProd);

router.get('/products', isLogged, adminContr.getProducts)

module.exports = router;