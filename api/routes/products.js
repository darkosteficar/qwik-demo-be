const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            url: {
              type: "GET",
              url: "http://localhost:3000/products" + doc._id,
            },
          };
        }),
      };
      console.log(docs);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(first);
      res.status(201).json({
        message: "Handling POST request to /products",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  res.status(200).json({
    message: "Handling POST request to /products",
    createdProduct: product,
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          doc,
        });
      } else {
        res.status(404).json({
          message: "Not valid entry found for provided ID",
        });
      }
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
