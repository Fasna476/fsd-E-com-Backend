const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    userType: String,
} )

const userModel = mongoose.model("user",usersSchema)

module.exports = userModel
