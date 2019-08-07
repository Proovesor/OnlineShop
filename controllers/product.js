const Product = require("../models/product");

const { validationResult } = require("express-validator/check");

const ITEMS_PER_PAGE = 2;

exports.getAddProd = (req, res, next) => {
  res.render("admin/edit-product", {
    pageName: "Add product",
    path: "/admin/add-product",
    editing: false,
    addError: null,
    errorField: null,
    userInput: { title: "", description: "", imageURL: "", price: "" }
  });
};

exports.postAddProd = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageURL = req.body.imageURL;
  const price = req.body.price;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      pageName: "Add product",
      path: "/admin/add-product",
      editing: false,
      addError: errors.array()[0].msg,
      errorField: errors.array()[0].param,
      userInput: {
        title: title,
        description: description,
        imageURL: imageURL,
        price: price
      }
    });
  }

  req.user
    .createProduct({
      title: title,
      price: price,
      imageURL: imageURL,
      description: description,
      userId: req.session.user.id
    })
    .then(result => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProd = (req, res, next) => {
  const productId = req.params.productId;
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  Product.findOne({
    where: {
      id: productId
    }
  })
    .then(products => {
      if (!products) {
        return res.redirect("/admin/products");
      }
      res.render("admin/edit-product", {
        pageName: "Edit product",
        path: "/admin/edit-product",
        editing: editMode,
        prod: products,
        addError: null,
        errorField: null
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProd = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const prodId = req.body.productId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      pageName: "Edit product",
      path: "/admin/edit-product",
      editing: true,
      prod: {
        id: prodId,
        title: title,
        description: description,
        imageURL: imageURL,
        price: price
      },
      addError: errors.array()[0].msg,
      errorField: errors.array()[0].param
    });
  }

  Product.findOne({ where: { id: prodId } })
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = title;
      product.price = price;
      product.imageURL = imageURL;
      product.description = description;
      return product.save().then(result => {
        res.redirect("/products");
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
    where: { userId: req.user._id },
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE
  })
    .then(result => {
      totalItems = result.count;
      res.render("admin/product-list", {
        pageName: "Admin prods",
        prods: result.rows,
        path: "/admin/products",
        hasProds: result.rows.length > 0,
        notFirst: currentPage > 1,
        notLast: currentPage < totalItems / ITEMS_PER_PAGE,
        page: currentPage
      });
    })
    .catch(err => console.log(err));
};

exports.deleteProd = (req, res, next) => {
  const prodId = req.params.productId;
  Product.destroy({
    where: {
      id: prodId,
      userId: req.user._id
    }
  })
    .then(result => {
      res.status(200).json({ message: "Successfully deleted product." });
    })
    .catch(err => {
      res.status(500).json({ message: "Deleting product failed." });
    });
};
