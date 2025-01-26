const bcrypt = require("bcryptjs");
const { asyncHandler } = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const sendEmailVerification = require("../services/emailServices");
require("dotenv").config();
const user_svc = require("../services/userServices");
exports.signUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  // Insert user into the database
  const result = await user_svc.signUpUser([username, email, hashedPassword]);
  const token = jwt.sign(
    { id: result.rows[0].id },
    process.env.EMAIL_VERIFICATION_KEY,
    { expiresIn: "1h" }
  );

  // after successfull creating sending  user activation link to gmail;
  await sendEmailVerification(email, token);
  res.status(201).json({
    msg: "created successfully",
    result: result.rows[0],
  });
});

exports.signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await user_svc.getUserByEmail(email);
  if (rows.length > 0 && rows[0].status === "inactive") {
    throw new ApiError("Check you email to Activate your account", 400);
  }
  if (rows.length > 0 && rows[0].status === "active") {
    const comparePassword = bcrypt.compare(password, rows[0].password);
    if (comparePassword) {
      const payload = { id: rows[0].id, username: rows[0].username };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1m",
      });
      //refreshtoken for generating new accesstoken after accessToken expires
      const refreshToken = jwt.sign(
        { id: rows[0].id, username: rows[0].username },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: "7d" }
      );
      res.cookie("reftok", refreshToken, { httpOnly: true });
      res.status(200).json({
        msg: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } else {
    throw new ApiError("Email address didnot matched", 400);
  }
});
