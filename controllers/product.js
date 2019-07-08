const Product = require('../models/product');

exports.getAddProd = (req, res, next) => {
    res.render('admin/edit-product', {
        pageName: 'Add product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postAddProd = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    req.user
        .createProduct({
            title: title,
            price: price,
            imageURL: imageURL,
            description: description,
            userId: req.session.user.id
        })
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getEditProd = (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    Product.findOne({
        where: {
            id: productId
        }
    })
        .then(products => {
            if (!products) {
                return res.redirect('/admin/products');
            }
            res.render('admin/edit-product', {
                pageName: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                prod: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err))
}

exports.postEditProd = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const prodId = req.body.productId;

    Product.findOne({ where: { id: prodId } })
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }

            product.title = title;
            product.price = price;
            product.imageURL = imageURL;
            product.description = description;
            return product.save()
                .then(result => {
                    res.redirect('/products');
                })
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
    Product.findAll({ where: { userId: req.user._id } })
        .then(products => {
            res.render('admin/product-list', {
                pageName: 'Admin prods',
                prods: products,
                path: '/admin/products',
                hasProds: products.length > 0,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err))
}

exports.postDeleteProd = (req, res, next) => {
    const prodId = req.body.productId;
    Product.destroy({
        where: {
            id: prodId,
            userId: req.user._id
        }
    })
        .then(result => {
            res.redirect('/products');
        })
        .catch(err => console.log(err))
}



