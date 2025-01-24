const express = require("express");
const app_routes = express.Router();
const auth_routes = require("./auth_route");
const post_routes = require("./post_route");

app_routes.use("/api/v1", auth_routes);
app_routes.use("/api/v1", post_routes);

module.exports = app_routes;
