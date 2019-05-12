const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');


exports.getIndex = (req, res, next) => {
    Product
        .findAll()
        .then(products => {
            res.render('shop/index', {
                pageName: 'Shop',
                prods: products,
                path: '/',
                hasProds: products.length > 0,
            });
        })
        .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
    Product
        .findAll()
        .then(products => {
            res.render('shop/list', {
                pageName: 'Products',
                prods: products,
                path: '/products',
                hasProds: products.length > 0,
            });
        })
        .catch(err => console.log(err)); 
}

exports.getProdById = (req, res, next) => {
    const productId = req.params.productId;
    Product
        .findAll({where: {id: productId}})
        .then(products => {
            res.render('shop/details', {
                pageName: 'Product details',
                properties: products[0],
                path: '/products'
            })
        })
        .catch(err => console.log(err)); 
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        pageName: 'Cart',
                        path: '/cart',
                        prodArray: products,
                        isNull: products.length
                    })
                })
                .catch(err => console.log(err))
            // 
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let currentCart;
    let newQuantity = 1;
    req.user.getCart()
            .then(cart => {
                currentCart = cart;
                return cart.getProducts({ where: { id: prodId } })
            })
            .then(products => {
                let product;
                if(products.length > 0) {
                    product = products[0];
                }
                
                if(product) {
                    const oldQuantity = product.cartItem.quantity;
                    newQuantity = oldQuantity + 1;
                    return product;
                }
                return Product.findByPk(prodId);
            })
            .then(product => {
                return currentCart.addProduct(product, { 
                    through: { quantity: newQuantity }
                });
            })
            .then(() => {
                res.redirect('/cart')
            })
            .catch(err => console.log(err))
}

exports.postDeleteCartProd = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log)
}

exports.postOrder = (req, res, next) => {
    let currentCart;
    let cartProds;
    req.user.getCart()
        .then(cart => {
            currentCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            cartProds = products;
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        orderProds.push(product);
                        return product;
                    }))
                })
                .catch(err => console.log(err))
        })
        .then(result => {
            currentCart.removeProducts(cartProds);
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                pageName: 'Orders',
                path: "/orders",
                hasOrders: orders.length > 0,
                orders: orders
            })
        })
        .catch(err => console.log(err))
    
}