const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProdById = (req, res, next) => {
    const productId = req.params.productId;
    Product.fetchWithId(productId, product => {
        res.render('shop/details', {
            pageName: 'Product details',
            properties: product,
            path: '/products'
        })
    })
}

exports.getCart = (req, res, next) => {
    Cart.getProducts(products => {
        res.render('shop/cart', {
            pageName: 'Cart',
            path: '/cart',
            prodArray: products.products,
            price: products.totalPrice
        })
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.fetchWithId(prodId, products => {
        Cart.addProduct(prodId, products.price, products.title);
    })
    res.redirect('/cart');
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageName: 'Checkout',
        path: '/checkout'
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageName: 'Orders',
        path: "/orders"
    })
}