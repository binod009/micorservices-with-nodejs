import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError";
dotenv.config();

// Generate new Accesstoken if expired;
// Should login again if RefreshToken expired;
export const refreshToken = asyncHandler(async (req, res, next) => {
  const reftoken = req.cookies.reftok;
  if (!reftoken) {
    throw new ApiError("refreshToken not provided", 401);
  }
        
  try {
    const payload = jwt.verify(reftoken, process.env.REFRESH_SECRET_KEY!);
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
    res.status(200).json({
      newAccessToken: newAccessToken,
    });
  } catch (err) {
    throw new ApiError("RefreshTokne expired please login again", 401);
  }
});
