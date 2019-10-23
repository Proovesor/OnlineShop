const Product = require("../models/product");
const Cart = require("../models/cart");

const ITEMS_PER_PAGE = 2;

exports.getIndex = async (req, res, next) => {
  let currentPage = Number(req.query.page);
  if (!currentPage || currentPage < 1) {
    currentPage = 1;
  }
  let totalItems;

  try {
    const products = await Product.findAndCountAll({
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE
    });

    totalItems = products.count;
    res.render("shop/index", {
      pageName: "Shop",
      prods: products.rows,
      path: "/",
      hasProds: products.rows.length > 0,
      notFirst: currentPage > 1,
      notLast: currentPage < totalItems / ITEMS_PER_PAGE,
      page: currentPage
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getProducts = async (req, res, next) => {
  let currentPage = Number(req.query.page);
  if (!currentPage || currentPage < 1) {
    currentPage = 1;
  }
  let totalItems;

  try {
    const products = await Product.findAndCountAll({
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE
    });

    totalItems = products.count;
    res.render("shop/list", {
      pageName: "Products",
      prods: products.rows,
      path: "/products",
      hasProds: products.rows.length > 0,
      notFirst: currentPage > 1,
      notLast: currentPage < totalItems / ITEMS_PER_PAGE,
      page: currentPage
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getProdById = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const products = await Product.findAll({ where: { id: productId } });
    return res.render("shop/details", {
      pageName: "Product details",
      properties: products[0],
      path: "/products",
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (e) {
    console.log(e);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    if (!cart) {
      await req.user.createCart();
    }

    const products = await cart.getProducts();

    return res.render("shop/cart", {
      pageName: "Cart",
      path: "/cart",
      prodArray: products,
      isNull: products.length,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (e) {
    console.log(e);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  let currentCart, product;
  let newQuantity = 1;

  try {
    const cart = await req.user.getCart();

    if (!cart) {
      await req.user.createCart();
    }
    currentCart = cart;

    const products = await cart.getProducts({ where: { id: prodId } });
    if (products.length > 0) {
      product = products[0];
    }

    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      product = await Product.findByPk(prodId);
    }

    await currentCart.addProduct(product, {
      through: { quantity: newQuantity }
    });

    return res.redirect("cart");
  } catch (e) {
    console.log(e);
  }
};

exports.postDeleteCartProd = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const cart = await req.user.getCart();

    const products = await cart.getProducts({ where: { id: prodId } });

    const product = products[0];

    await product.cartItem.destroy();

    return res.redirect("cart");
  } catch (e) {
    console.log(e);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();

    const products = await cart.getProducts();

    cartProds = products;

    const order = await req.user.createOrder();
    await order.addProducts(
      products.map(prod => {
        prod.orderItem = { quantity: prod.cartItem.quantity };
        return prod;
      })
    );

    await cart.removeProducts(products);
    return res.redirect("/orders");
  } catch (e) {
    console.log(e);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] });
    console.log(orders);
    return res.render("shop/orders", {
      pageName: "Orders",
      path: "/orders",
      hasOrders: orders.length > 0,
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    });
  } catch (e) {
    console.log(e);
  }
};
