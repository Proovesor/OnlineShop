const fs = require('fs');
const path = require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);


const fetchDataFromFile = callback => {
    fs.readFile(p, (err, data) => {
        if(err) {
            return callback([]);
        }
        callback(JSON.parse(data));
    })
}

module.exports = class Products {
    constructor(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
       fetchDataFromFile(products => {
            products.push(this);
            //it's important to use arrow function
            //otherwise 'this' would lose its context in this example
            //now 'this' reffers to the class
            fs.writeFile(p, JSON.stringify(products), err => { //stringify takes JS object, array etc., and converts it ino JSON
                console.log(err);
            })
        })
    }
    
    static getProducts(callback) {
        fetchDataFromFile(callback);
    }
}