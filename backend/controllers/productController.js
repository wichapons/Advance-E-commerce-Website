const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");

const getProducts = async (req, res, next) => {
  try {
    //Page number logic
    let pageNum = Number(req.query.pageNum); //get value after ? sign
    if (!pageNum) {
      pageNum = 1; //if no page num requested set to 1 instead
    }

    // Sort logic (by name, price etc.)
    let sort;
    const sortOption = req.query.sort;
    if (sortOption) {
      let sortOpt = sortOption.split("_"); //frontend will send format like  value="price_1"
      sort = { [sortOpt[0]]: Number(sortOpt[1]) }; //warp [] with key proptery that is variable
    }

    //Query logic
    let query;
    let queryConditions = []; //set initial state of query to don't have any queries

    //sort by price less than xxx
    if (req.query.price) {
      queryConditions.push({ price: { $lte: Number(req.query.price) } }); //show products less than xxx dollars
    }
    //sort by rating
    if (req.query.rating) {
      queryConditions.push({ rating: { $in: req.query.rating.split(",") } }); //req will be like 1,2,3,4
    }
    //join query when there is an query
    if (queryConditions.length > 0) {
      query = {
        $and: [queryConditions], //$and operator expects an array of conditions as its value.
      };
    }

    const totalProducts = await Product.countDocuments(query); //get the total number of products based on query

    //get products sorted by name
    const products = await Product.find(query)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort) // format like {name: 1 or -1}
      .limit(recordsPerPage);

    //send the product details, page number and total number of pages
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage), //always round up decimal results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts: getProducts,
};
