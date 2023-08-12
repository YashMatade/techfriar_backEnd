const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetToken: {
        type: String,
        default: null
    },
});
module.exports = mongoose.model("users", userSchema);