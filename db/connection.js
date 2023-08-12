const mongoose = require("mongoose");

exports.connectionDB = () => {
    mongoose.connect("mongodb://0.0.0.0:27017/VMsystem");
    var db = mongoose.connection;
    db.on('open', () => {
        console.log('connection successfull');
    });
    db.on('err', (err) => {
        console.log(err);
    });
}