import express from "express";
import { createwishList, getWishList } from "../controller/wishlist.controller";
const wishlist_route = express.Router();

wishlist_route.post("/wishlist", createwishList).get("/wishlist", getWishList).put("/binod/call", (req, res, next) => {
    res.status(200).json({
        msg:'success'
    })
});

export default wishlist_route;
