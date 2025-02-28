import  asyncHandler  from "../utils/asyncHandler";
import { Request,Response } from "express";
import post_svc from "../services/postServices";

export const createPost = asyncHandler(async (req:Request, res:Response) => {
  const { title, description } = req.body;
  const newPostArray = [title, description];
  
  const resultFromDatabase = await post_svc.createPostService(newPostArray);
  res.status(200).json({
    msg: "created",
    result: resultFromDatabase.rows,
  });
});

export const getAllPost = asyncHandler(async (req, res) => {
  const postdata = await post_svc.getAllPostDataService();
  res.status(200).json({
    msg: "success",
    result: postdata,
  });
});
