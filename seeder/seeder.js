const connectDB = require("../Db/db")
connectDB()

const categoryData = require("./categories")
const Category = require("../models/CategoryModel")
const productData = require("./products");
const Product = require("../models/ProductModel");
const reviewData = require("./reviews");
const Review = require("../models/ReviewModel")
const userData = require("./users.js")
const User = require("../models/UserModel");
const orderData = require("./orders.js");
const Order = require("../models/OrderModel.js")


const importData = async () => {
    try {
        await Category.collection.dropIndexes()
        await Product.collection.dropIndexes()
        await Category.collection.deleteMany({})
        await Product.collection.deleteMany({})
        await Review.collection.deleteMany({})
        await User.collection.deleteMany({})
        await Order.collection.deleteMany({})
        if (process.argv[2] === '-d') {
            await Category.insertMany(categoryData)
            const reviews = await Review.insertMany(reviewData);
            const sampleProducts = productData.map((product) => {
                reviews.map((review) => {
                    product.reviews.push(review._id)
                })
                return { ...product }
            })
            await Product.insertMany(sampleProducts);
            await User.insertMany(userData);
            await Order.insertMany(orderData)
            console.log("Seeder data imported successfully")
            process.exit()
        }
        console.log("Seeder data deleted successfully")
        process.exit()

    } catch (error) {
        console.error("Error while proccessing seeder data", error)
        process.exit(1);
    }
}
importData()

