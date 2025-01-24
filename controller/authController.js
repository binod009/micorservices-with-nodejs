const ApiError = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

exports.generateAccessToken = asyncHandler(async (req, res) => {
  const reftoken = req.cookies.reftok;
  if (!reftoken) {
    throw new ApiError("refreshToken is not provided", 401);
  }
  try {
    const payload = jwt.verify(reftoken, process.env.REFRESH_SECRET_KEY);
  } catch (err) {
    if (err.message === "jwt expired") {
      throw new ApiError("refreshToken expired, please login again", 401);
    }
  }
  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  res.cookie("reftok", reftoken, { httpOnly: true });
  res.status(200).json({
    msg: "success",
    accessToken: newAccessToken,
    refreshToken: reftoken,
  });
});
