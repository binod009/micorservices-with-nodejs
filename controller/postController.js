const { asyncHandler } = require("../utils/asyncHandler");
const post_svc = require("../services/postServices");

exports.createPost = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const newPostArray = [title, description];
  const resultFromDatabase = await post_svc.createPostService(newPostArray);
  res.status(200).json({
    msg: "created",
    result: resultFromDatabase.rows,
  });
});

exports.getAllPost = asyncHandler(async (req, res) => {
  const postdata = await post_svc.getAllPostDataService();
  res.status(200).json({
    msg: "success",
    result: postdata,
  });
});
