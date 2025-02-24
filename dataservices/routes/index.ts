import express from "express";

const app_routes = express();

import model_routes from "./model.routes";

app_routes.use("/",model_routes);


export default app_routes;

