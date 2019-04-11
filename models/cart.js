const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

const pProds = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const fetchDataFromFile = callback => {
    fs.readFile(pProds, (err, data) => {
        if(err) {
            return callback([]);
        }
        callback(JSON.parse(data));
    })
}

const fetchDataFromCart = callback => {
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

            let existingProductIndex, existingProduct = false, updatedProduct;
            if(cart.products != undefined) {
                existingProductIndex = cart.products.findIndex(e => e.id === id);
                existingProduct = cart.products[existingProductIndex];
            }
            
            
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
        fetchDataFromCart(callback);
    }

    static deleteProduct(id) {

        fetchDataFromFile(products => {
            const item = products.filter(e => e.id == id);
            const itemPrice = item[0].price;

            fetchDataFromCart(object => {
                const newCartProds = { ...object };
                const deletedProduct = newCartProds.products.filter(e => e.id === id);
    
                const decreasedPrice = deletedProduct[0].quantity * itemPrice;
                newCartProds.totalPrice -= decreasedPrice;
            
                let newProdsArr = newCartProds.products.filter(e => e.id !== id);
                
                newCartProds.products = newProdsArr;
    
                console.log(itemPrice);
                
                fs.writeFile(p, JSON.stringify(newCartProds), err =>
                    console.log(err));
            })
        }) 
    }
}
