import ApiError from "../utils/ApiError";

import { asyncHandler } from "../utils/asyncHandler";

import cart_svc from "../services/cartservices";

export const addtoCart = asyncHandler(async (req, res) => {
  // Describing the structure of the 'data' object in comments
  // data: {
  //   product_id: string;   // The ID of the product being added to the cart
  //   quantity: number;    // The quantity of the product to add
  //   customer_id: string;  // The ID of the customer adding the product
  //   price: number;       // The price of the product being added
  // }
  let data = req.body;
  const token = req.cookies.Acs_tkn;
  if (!token) {
    throw new ApiError("token not provided", 404);
  }

  if (!data.product_id || !data.quantity || !data.customer_id || !data.price) {
    throw new ApiError("Product_id, quantity, and user_id are required", 401);
  }

  const result = await cart_svc.addtocartService(data, token);

  res.status(result.status).json(result);
});

export const getallCarts = asyncHandler(async (req, res) => {
  const result = await cart_svc.getallCartData();
  res.status(result.status).json(result);
});
