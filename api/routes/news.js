const express = require("express");
const router = express.Router();
const News = require("../models/news");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  News.find()
    .select("title subtitle paragraphs images _id category")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        news: docs.map((doc) => {
          return {
            title: doc.title,
            subtitle: doc.subtitle,
            paragraphs: doc.paragraphs,
            images: doc.images,
            _id: doc._id,
            category: doc.category,
            url: {
              type: "GET",
              url: "/news/" + doc._id,
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
  const news = new News({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    subtitle: req.body.subtitle,
    paragraphs: req.body.paragraphs,
    images: req.body.images,
    category: req.body.category,
  });
  news
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST request to /news",
        createdNews: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:newsId", (req, res, next) => {
  const id = req.params.newsId;
  News.findById(id)
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

router.delete("/:newsId", (req, res, next) => {
  const id = req.params.newsId;
  News.deleteOne({ _id: id })
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

// router.patch("/:productId", (req, res, next) => {
//   const id = req.params.productId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Product.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then((result) => {
//       console.log(result);
//       res.status(200).json(result);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

module.exports = router;
