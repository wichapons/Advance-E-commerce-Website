const Category = require("../models/CategoryModel")

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({name: "asc"}).orFail() //use orFail for genarating an error when not found
        res.json(categories)
    } catch(error) {
        next(error)
    }
}

const newCategory = async (req, res, next) => {
    try {
        const {category} = req.body
        //console.log('create category data frontend',req.body);
        if(!category) { //only body that contains "category" will being process
            res.status(400).send("Category input is required")
        }else{
            const isCategoryExisted = await Category.findOne({name:category})
            if(isCategoryExisted){
                res.status(400).send('This category already existed') 
            }else{
                const categoryCreated = await Category.create({name: category})
                res.status(201).send({categoryCreated: categoryCreated})
            }
        }
    } catch (err) {
        next(err)
    }
}

const deleteCategory = async(req,res,next)=>{
    //return res.send(req.params.category)
    try {
        if(req.params.category !== "Choose category") {
            const targetedCategory = await Category.findOne({
                name: decodeURIComponent(req.params.category)
            }).orFail()
            await targetedCategory.deleteOne()
            res.status(200).json({categoryDeleted: true})
        }else{
            res.status(400).send('Invalid input on category selection')
            return;
        }
    } catch (error) {
        next(error)
    }
}

const saveAttr = async (req, res, next) => {
    const {key, val, categoryChoosen} = req.body
    if(!key || !val || !categoryChoosen) {
        return res.status(400).send("All inputs are required")
    }
    try {
        const category = categoryChoosen.split("/")[0];
        const categoryExists = await Category.findOne({name: category}).orFail();
        if(categoryExists.attrs.length > 0) {
            // if key exists in the database then add a value to the key
            let keyDoesNotExistsInDatabase = true;
            categoryExists.attrs.map((item, idx) => {
                if(item.key === key) {
                    keyDoesNotExistsInDatabase = false //prevent if below execute
                    let copyAttributeValues = [...categoryExists.attrs[idx].value] //copy attrs to new variable
                    copyAttributeValues.push(val); //add new attr 
                    let newAttributeValues = [...new Set(copyAttributeValues)]; // use Set command to prevent duplicates
                    categoryExists.attrs[idx].value = newAttributeValues; //assign new value to main category
                }
                //console.log("categoryExists = ",categoryExists.attrs[1]);
                return;
            })

            if(keyDoesNotExistsInDatabase) {
                categoryExists.attrs.push({key: key, value: [val]})
            }
        } else {
            // push to the array
            categoryExists.attrs.push({key: key, value: [val]})
        }

        await categoryExists.save()
        let cat = await Category.find({}).sort({name: "asc"})
        return res.status(201).json({categoryUpdated: cat})
    } catch(err) {
        next(err)
    }
}


module.exports = {getCategories, newCategory,deleteCategory,saveAttr}
