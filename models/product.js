const fs = require('fs');
const path = require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const pCart = path.join(
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

const fetchDataFromCart = callback => {
    fs.readFile(pCart, (err, data) => {
        if(err) {
            return callback([]);
        }
        callback(JSON.parse(data));
    })
}

module.exports = class Products {
    constructor(id, title, imageURL, description, price) {
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
        fetchDataFromFile(products => {
            if(this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id == this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;

                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                })

                if(products[existingProductIndex].price != this.price) {
                    fetchDataFromCart(object => {
                        if(object.products.find(prod => prod.id == this.id)) {
                            const existProdIndex = object.products.findIndex(prod => prod.id == this.id);
                            const newCartProds = { ...object };
                            let currentQuantity = newCartProds.products[existProdIndex].quantity;
                            let oldPrice = products[existingProductIndex].price;
                            newCartProds.totalPrice = newCartProds.totalPrice - (currentQuantity * oldPrice) + (currentQuantity * this.price);

                            fs.writeFile(pCart, JSON.stringify(newCartProds), err => {
                                console.log(err);
                            })
                        }
                       
                    })
                }
                

            } else {
                this.id = Math.random();
                products.push(this);
        
                fs.writeFile(p, JSON.stringify(products), err => { 
                    console.log(err);
                })
            }
            
        })
    }
    
    static getProducts(callback) {
        fetchDataFromFile(callback);
    }

    static fetchWithId(id, callback) {
        fetchDataFromFile(products => {
            const product = products.find(e => e.id == id);
            callback(product);
        })
    }

    static deleteProduct(id, itemPrice) {
        fetchDataFromFile(products => {
            const deleteId = products.findIndex(e => e.id == id);
            let updatedProducts = [...products];
            updatedProducts.splice(deleteId, 1);

            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if(!err) {
                    fetchDataFromCart(object => {
                        const newCartProds = { ...object };
                        if(newCartProds.products) {
                            const deletedProduct = newCartProds.products.filter(e => e.id === id);

                            if(deletedProduct[0]) {
                                const decreasedPrice = deletedProduct[0].quantity * itemPrice;
                                newCartProds.totalPrice -= decreasedPrice;
                            }
                        
                            let newProdsArr = newCartProds.products.filter(e => e.id !== id);
                            
                            newCartProds.products = newProdsArr;
                            
                            fs.writeFile(pCart, JSON.stringify(newCartProds), err =>
                                console.log(err));
                        }    
                    })
                }
                else {
                    console.log(err);
                }
            })
        })
    }
}