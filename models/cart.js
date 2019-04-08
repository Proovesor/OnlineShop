const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

const fetchDataFromFile = callback => {
    fs.readFile(p, (err, data) => {
        if(err) {
            return callback([]);
        }
        callback(JSON.parse(data));
    })
}

module.exports = class Cart {
    static addProduct(id, price, title) {
        fs.readFile(p, (err, data) => {
            let cart = {products: [], totalPrice: 0};
            if(!err) {
                cart = JSON.parse(data);
            }
            
            const existingProductIndex = cart.products.findIndex(e => e.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }

            else {
                updatedProduct = {title: title, id: id, quantity: 1};
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice += Number(price);

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }

    static getProducts(callback) {
        fetchDataFromFile(callback);
    }
}