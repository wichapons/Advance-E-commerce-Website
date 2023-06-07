const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");

const getProducts = async (req, res, next) => {
  try {
    let pageNum = Number(req.query.pageNum); //get value after ? sign
    const totalProducts = await Product.countDocuments({});
    if (!pageNum) {
      //if no page num requested set to 1 instead
      pageNum = 1;
    }

    const products = await Product.find({})
      .skip(recordsPerPage * (pageNum - 1))
      .sort({ name: 1 })
      .limit(recordsPerPage);
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts: getProducts,
};
