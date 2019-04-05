const Product = require('../models/product');

exports.getAddProd = (req, res, next) => {
    res.render('admin/add-product', {
        pageName: 'Add product',
        path: '/admin/add-product',
        add_productCSS: true,
        activeAddProduct: true
    });
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

exports.postAddProd = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    product = new Product(title, imageURL, description, price);
    product.save();
    res.redirect('/products');
}

