const router = require("express").Router();
const _ = require("lodash");

const Quotes = require("../models/Quote");

router.get("/", async (req, res) => {
  try {
    const quotes = await Quotes.find();
    res.status(200).json(quotes);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
