const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.getProducts(products => {
        res.render('shop/index', {
            pageName: 'Shop',
            prods: products,
            path: '/',
            hasProds: products.length > 0,
        });
    }); 
}

exports.getProducts = (req, res, next) => {
    Product.getProducts(products => {
        res.render('shop/list', {
            pageName: 'Products',
            prods: products,
            path: '/products',
            hasProds: products.length > 0,
        });
    }); 
}


exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageName: 'Cart',
        path: '/cart'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageName: 'Checkout',
        path: '/checkout'
    })
}