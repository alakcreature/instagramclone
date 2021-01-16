const mongoose = require("mongoose");

const connectdb = async ()=>{
    await mongoose.connect(process.env.uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    console.log("db connected");
}
module.exports = connectdb;