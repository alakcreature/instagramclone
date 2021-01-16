const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const connectdb = require("./connection/config");
connectdb();

app.use(cors());
app.use(logger('dev'));

require("./models/user");
require("./models/post");

app.use(express.json());
// app.get("/test",(req,res)=>{
//     res.json({message:"hi"});
// })
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if(process.env.NODE_ENV==="production"){
    const path = require("path");
    app.use(express.static(path.join(__dirname,"public")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"public","index.html"));
    })
}

const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`Server started at ${port}`));