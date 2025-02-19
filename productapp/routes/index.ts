import express from "express";

const app_router = express.Router();

// register all the routes here
import product_route from "./product.routes";

import { apiEventController } from "../controller/api-events.controller";
import verifyToken from "../middleware/tokenverify";

import auth_route from "./auth.routes";

app_router.use("/api/v1", product_route);
app_router.use("/api/v1", auth_route);

export default app_router;
