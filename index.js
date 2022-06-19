const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { userRoutes } = require("./routes/User");
const { productRoutes } = require("./routes/Product");
const cors = require('cors')
const app = express();

mongoose
  .connect("mongodb://localhost/ECommerce")
  .then(() => console.log(`Connected`))
  .catch((err) => console.log(err));

//middleware
app.use(bodyParser.json());
app.use(cors({
  origin:"http://localhost:3000"
}))
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.send(`hello! home page`);
});

app.listen(5000, () => console.log("Server running"));
