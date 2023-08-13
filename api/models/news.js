const mongoose = require("mongoose");

const newsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  subtitle: String,
  paragraphs: [String],
  images: [String],
  category: String,
});

module.exports = mongoose.model("News", newsSchema);
