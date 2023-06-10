const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");

const getProducts = async (req, res, next) => {
  try {
    //Query logic
    let query;
    let queryConditions = []; //set initial state of query to don't have any queries

    //***** Search bar section START***** //
    //category selection
    const categoryName = req.params.categoryName;
    if (categoryName) {
      let formatedCategoryData = categoryName.replaceAll(",", "/"); //just in case category started with /pc/dell
      let regEx = new RegExp("^" + formatedCategoryData);
      queryConditions.push({ category: regEx }); //push category for query
    }
    // search product by text
    const searchTextQuery = req.params.searchTextQuery;
    let searchTextQueryCondition = {};
    let select = {};
    if(searchTextQuery) {
      searchTextQueryCondition = { $text: { $search: searchTextQuery}};  //search by $text index which we already assign in the product model
      select = {score: { $meta: "textscore" }}; // {score: { $meta: "textscore" }}; fixed term for get the search score based on user input
      sort = { score: { $meta: "textScore" } };// sort by score
      queryConditions.push(searchTextQueryCondition);
    }  
    //***** Search bar section END***** //


    //***** Filter section START***** //
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

    //sort by price less than xxx
    if (req.query.price) {
      queryConditions.push({ price: { $lte: Number(req.query.price) } }); //show products less than xxx dollars
    }
    //sort by rating
    if (req.query.rating) {
      queryConditions.push({ rating: { $in: req.query.rating.split(",") } }); //req will be like 1,2,3,4
    }
    //sort by category
    if (req.query.category) {
      let categories = req.query.category.split(",").map((item) => {
        if (item) {
          return new RegExp("^" + item); //cuz I use map here so it will stack up in the array of req.query.category.split(",")
        } //The resulting array will contain the three regular expression objects: [new RegExp("^electronics"), new RegExp("^laptops"), new RegExp("^phones")].
      });
      queryConditions.push({ category: { $in: categories } });
    }

    //sort by attribute
    if (req.query.attrs) {
      // data format that will send from front-end --> attrs=RAM-1TB-2TB-4TB,color-blue-red 
      let attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
          if (item) {
            let attrArray = item.split("-");
            let copyAttrArray = [...attrArray];
            copyAttrArray.shift(); // removes first item
            let attributeForQuery = {
              attrs: {$elemMatch: {key: attrArray[0],value: { $in: copyAttrArray }}} // $elemMatch for find match exact doc with key and value, // use $in for make mongoDB look data in values separately
            };
            acc.push(attributeForQuery);
            return acc;
          } else {
            return acc;
          }
        }, []);
      //   console.dir(attrsQueryCondition, { depth: null });
      queryConditions.push(...attrsQueryCondition);
    }

    //***** Filter section END***** //

    //join query when there is an query
    if (queryConditions.length > 0) {
      query = {
        $and: queryConditions //$and operator expects an array of conditions as its value.
      };
    }

    //overwrite sorting by meta score if user search via search box
    if(searchTextQuery){
      sort = { score: { $meta: "textScore" } };  
    }

    //get the total number of products based on query
    const totalProducts = await Product.countDocuments(query); 

    //get products sorted by name
    const products = await Product.find(query)
      .select(select)// select = show this field in DB
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort) // format like {name: 1 or -1}
      .limit(recordsPerPage);

    //send the product details, page number and total number of pages
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage) //always round up decimal results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts: getProducts
};
