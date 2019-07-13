const express = require('express');

const { body } = require('express-validator/check');

const adminContr = require('../controllers/product');
const isLogged = require('../midware/is-logged');

const router = express.Router();


router.get('/add-product', isLogged, adminContr.getAddProd)

router.post('/add-product', isLogged, [
    body('title', 'You used forbidden characters.').isString().isLength({ min: 3 }).withMessage('The title must the at least 5 characters long.'),
    body('imageURL', 'You entered invalid URL.').isURL(),
    body('price', 'You can only use numeric values.').isFloat(),
    body('description', 'The description must be between 10 and 300 characters.').isLength({ min: 10, max: 300 })
], adminContr.postAddProd)

router.get('/edit-product/:productId', isLogged, adminContr.getEditProd)

router.post('/edit-product', isLogged, [
    body('title', 'You used forbidden signs.').isString().isLength({ min: 3 }).withMessage('The title must the at least 5 characters long.'),
    body('imageURL', 'You entered invalid URL.').isURL(),
    body('price', 'You can only use numeric values.').isFloat(),
    body('description', 'The description must be between 10 and 300 characters.').isLength({ min: 10, max: 300 })
], adminContr.postEditProd)

router.post('/delete-product', isLogged, adminContr.postDeleteProd);

router.get('/products', isLogged, adminContr.getProducts)

module.exports = router;