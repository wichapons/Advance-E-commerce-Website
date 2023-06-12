const mongoose = require("mongoose")
const Review = require("./ReviewModel")
const imagePathSchema = mongoose.Schema({
    path: {type: String, required: true}
})

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        //unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
    },
    reviewsNumber: {
        type: Number,
    },
    sales: {
        type: Number,
        default: 0
    },
    attrs: [
        {key: {type: String}, value: {type: String}}
       // example [{ key: "color", value: "red" }, { key: "size", value: "1 TB" }]
    ],
    images: [imagePathSchema],
    reviews: [
        {
            //populate review document to this schema
            type: mongoose.Schema.Types.ObjectId,
            ref: Review,
        }
    ]
    }, {timestamps: true,} //add timestamp after Product was saved in the DB
)

const Product = mongoose.model("Product", productSchema)
//create index for increase query performance when users search a product 
productSchema.index({name: "text", description: "text"}, {name: "TextIndex"}) 
productSchema.index({"attrs.key":1, "attrs.value":1}) // 1 mean Ascenden order
productSchema.index({name: -1})

module.exports = Product