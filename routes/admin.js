const express = require('express');

const adminContr = require('../controllers/product');

const router = express.Router();


router.get('/add-product', adminContr.getAddProd)

router.post('/add-product', adminContr.postAddProd)

router.get('/edit-product/:productId', adminContr.getEditProd)

router.post('/edit-product', adminContr.postEditProd)

router.post('/delete-product', adminContr.postDeleteProd);

router.get('/products', adminContr.getProducts)

module.exports = router;