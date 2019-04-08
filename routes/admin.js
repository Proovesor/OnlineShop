const express = require('express');
const path = require('path');

const adminContr = require('../controllers/product');

const router = express.Router();
//it's like a mini express app


// /admin/add-product => GET
router.get('/add-product', adminContr.getAddProd)

// /admin/add-product => POST
router.post('/add-product', adminContr.postAddProd)

router.get('/edit-product/:productId', adminContr.getEditProd)

router.get('/products', adminContr.getProducts)

module.exports = router;