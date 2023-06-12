const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");
const imageValidate = require("../utils/imageValidate");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const getProducts = async (req, res, next) => {
  try {
    //Query logic
    let queryConditions = []; //set initial state of query for using in db searching

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

    //***** Query section START***** //
    let query;
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

    //***** Query section END***** //

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
//get product by ID
const getProductById = async (req,res,next)=>{
  try{
    const products = await Product.findById(req.params.id).populate('reviews').orFail(); //join review table instead of showing only reviewID
    res.json(products);
  }catch(err){
    next(err);
  }
}
//get top 3 bestseller 
const getBestsellers = async (req,res,next)=>{
  try{
    const products = await Product.aggregate([
      {$sort:{category:1,sales:-1}}, //sort by category first then each catrgory sort by sales volumn
      {$group:{_id:"$category", max_sale_product:{$first:"$$ROOT"}}}, //$ will look at the each category and select only the first one $$ROOT will get all of the key value in that doc
      {$replaceWith:"$max_sale_product"}, //replace max_sale_product to be a original key-value
      {$project:{ _id: 1, name: 1, images: 1, category: 1, description: 1 }}, //select only field needed
      {$limit:3},
    ]);
    res.json(products);
  }catch(err){
    next(err);
  }
}
//get product on admin page
const adminGetProducts = async (req,res,next)=>{
  try{
    const products = await Product.find({})
    .sort({ category: 1 })
    .select({ name: 1, price: 1, category: 1 }); //show only specific field
    return res.json(products);
  }catch(err){
    next(err);
  }
}
//delete product on admin page
const adminDeleteProduct = async (req, res, next) => {
  try {
      const product = await Product.findById(req.params.id).orFail();
      await product.deleteOne();
      console.log(product);
      res.json({ message: `${product.name} has been removed successfully` });
  } catch(err) {
      next(err)
  }
}

const adminCreateProduct = async(req, res, next) => {
  try {
      const product = new Product(); //create new product
      const { name, description, count, price, category,attributesTable  } = req.body //get all input from frontend
      product.name = name
      product.description = description
      product.count = count
      product.price = price
      product.category = category
      if( attributesTable && attributesTable.length > 0 ) {
          attributesTable.map((item) => { // input will be in form of array so need to loop through first
              product.attrs.push(item)
          })
      }
      await product.save()

      res.json({
          message: "product created",
          productId: product._id,
          productName:product.name
      })
  } catch(err) {
      next(err)
  }
}

const adminUpdateProduct = async (req, res, next) => {
  try {
     const product = await Product.findById(req.params.id).orFail()
     const { name, description, count, price, category, attributesTable } = req.body
     product.name = name || product.name //in case that name does not exits from input will use same data in DB
     product.description = description || product.description 
     product.count = count || product.count
     product.price = price || product.price
     product.category = category || product.category
     if( attributesTable && attributesTable.length > 0 ) {
         product.attrs = []
         attributesTable.map((item) => {
             product.attrs.push(item)
         })
     } else {
         product.attrs = []
     }
     await product.save()
     res.json({
        message: "product updated" 
     })
  } catch(err) {
      next(err)
  }
}

const adminUpload = async (req, res, next) => {
  try {
      if(!req.files || !req.files.images) {  //if one file uploaded req.files.images will become object, >1 become array
        return res.status(400).send("No files were uploaded.")
  }
      //check file type and number of uploaded files not exceed the limitaion
      const validateResult = imageValidate(req.files.images)
      if(validateResult.error) {
          return res.status(400).send(validateResult.error)
      }
      //check if images(req.files.images) is array or not
      let imagesArray = []
      if(Array.isArray(req.files.images)) { 
          imagesArray = req.files.images
      } else {
          imagesArray.push(req.files.images)
      }
      
      //upload logic 
      const uploadDirectory = path.resolve(__dirname,"../../frontend","public","images","products")
      const productDoc = await Product.findById(req.query.productId).orFail(); //get product doc by id

      for(let image of imagesArray) {
        let fileName = uuidv4() + path.extname(image.name);
        let uploadPath = uploadDirectory + "/" + fileName;
            // Await the file move operation
            await image.mv(uploadPath, function(err) { 
                if(err) {
                    return res.status(500).send(err);
                }
            });
            //push path (object format) for each image
            productDoc.images.push({path:"/images/products/"+fileName}) 
        }
        await productDoc.save();
        return res.send("file uploaded").status(200);
  } catch(err) {
      next(err)
  }
}

const adminDeleteProductImage = async (req, res,next) => {
  try {
    const imagePath = decodeURIComponent(req.params.imagePath);
    const finalPath = path.resolve("../frontend/public") + imagePath; //join path with absolute format

    fs.unlink(finalPath, (err) => { //remove file
      if (err) {
        res.status(500).send(err);
      }
    });
    //update db
    await Product.findOneAndUpdate(
      { _id: req.params.productId }, //find product with specific id
      { $pull: { images: { path: imagePath } } } //remove path
    ).orFail();
    await Product.save();
    return res.status(200).send("delete successfully")
  } catch (err) {
    next(err);
  }
};



module.exports = {
  getProducts: getProducts,
  getProductById:getProductById,
  getBestsellers:getBestsellers,
  adminGetProducts:adminGetProducts,
  adminDeleteProduct:adminDeleteProduct,
  adminCreateProduct:adminCreateProduct,
  adminUpdateProduct:adminUpdateProduct,
  adminUpload:adminUpload,
  adminDeleteProductImage:adminDeleteProductImage,
};


