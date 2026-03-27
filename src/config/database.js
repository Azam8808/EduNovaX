const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};