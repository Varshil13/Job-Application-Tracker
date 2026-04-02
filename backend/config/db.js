const mongoose = require ("mongoose");
const dotenv = require("dotenv")
dotenv.config();

async function connectDB() {

    try
    {
        await mongoose.connect(process.env.MONGOOSE_URI)
        console.log("Mongo DB connected successfully")

    }
    catch(err) {
        console.error(err)
        process.exit(1)
    }
    
}

module.exports = connectDB; 