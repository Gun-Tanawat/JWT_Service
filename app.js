require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

app.use(require('./routes'));

// Logic goes here

app.get("/" , (req,res) => {
    res.send("Hello World");
})

module.exports = app;
