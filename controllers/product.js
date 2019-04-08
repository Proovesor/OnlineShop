const Product = require('../models/product');

exports.getAddProd = (req, res, next) => {
    res.render('admin/edit-product', {
        pageName: 'Add product',
        path: '/admin/add-product',
        editing: false
    });
    //RENDER method will always look for registered ENGINE
    //it is defined in app.js
}

exports.postAddProd = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    product = new Product(title, imageURL, description, price);
    product.save();
    res.redirect('/products');
}

exports.getEditProd = (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    Product.fetchWithId(productId, product => {
        if(!product) {
            return res.redirect('/admin/products');
        }
        res.render('admin/edit-product', {
            pageName: 'Edit product',
            path: '/admin/edit-product',
            editing: editMode,
            prod: product
        });
    })
    
    //RENDER method will always look for registered ENGINE
    //it is defined in app.js
}

exports.getProducts = (req, res, next) => {
    Product.getProducts(products => {
        res.render('admin/product-list', {
            pageName: 'Admin prods',
            prods: products,
            path: '/admin/products',
            hasProds: products.length > 0,
        });
    }); 
}



