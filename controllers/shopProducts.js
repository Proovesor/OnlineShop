const Product = require("../models/product");
const Cart = require("../models/cart");

const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
  let currentPage = Number(req.query.page);
  if (!currentPage || currentPage < 1) {
    currentPage = 1;
  }
  let totalItems;

  Product.findAndCountAll({
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE
  })
    .then(result => {
      totalItems = result.count;
      res.render("shop/index", {
        pageName: "Shop",
        prods: result.rows,
        path: "/",
        hasProds: result.rows.length > 0,
        notFirst: currentPage > 1,
        notLast: currentPage < totalItems / ITEMS_PER_PAGE,
        page: currentPage
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  let currentPage = Number(req.query.page);
  if (!currentPage || currentPage < 1) {
    currentPage = 1;
  }
  let totalItems;

  Product.findAndCountAll({
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE
  })
    .then(result => {
      totalItems = result.count;
      res.render("shop/list", {
        pageName: "Products",
        prods: result.rows,
        path: "/products",
        hasProds: result.rows.length > 0,
        notFirst: currentPage > 1,
        notLast: currentPage < totalItems / ITEMS_PER_PAGE,
        page: currentPage
      });
    })
    .catch(err => console.log(err));
};

exports.getProdById = (req, res, next) => {
  const productId = req.params.productId;
  Product.findAll({ where: { id: productId } })
    .then(products => {
      res.render("shop/details", {
        pageName: "Product details",
        properties: products[0],
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      if (!cart) {
        return req.user.createCart();
      } else {
        return Promise.resolve(cart);
      }
    })
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render("shop/cart", {
            pageName: "Cart",
            path: "/cart",
            prodArray: products,
            isNull: products.length,
            isAuthenticated: req.session.isLoggedIn
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let currentCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      if (!cart) {
        req.user.createCart();
      }
      currentCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
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
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postDeleteCartProd = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let currentCart;
  let cartProds;
  req.user
    .getCart()
    .then(cart => {
      currentCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      cartProds = products;
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      currentCart.removeProducts(cartProds);
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then(orders => {
      res.render("shop/orders", {
        pageName: "Orders",
        path: "/orders",
        hasOrders: orders.length > 0,
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};
