const express = require("express");
const app = express();
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");
const verifyAccessToken = require("../utils/verifyAccessToken")

app.get("/get-token", (req, res) => {
  verifyAccessToken(req, res);
});

app.get("/logout", (req, res) => {
  return res.clearCookie("access_token").send("access token cleared");
});

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

module.exports = app;
