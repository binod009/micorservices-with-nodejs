import { asyncHandler } from "../utils/asyncHandler";
import EditCustomerServices from "../services/editcustomer.services";

export const createwishList = asyncHandler(async (req, res) => {
  const body = req.body;
  const result = await EditCustomerServices.addWhishList(body);
  res.status(200).json({
    msg: "added to wishlists",
    result: result,
  });
});


export const getWishList = asyncHandler(async (req, res) => {
  const customerid = req.body;
  const result = await EditCustomerServices.getWishList(customerid);
  res.status(200).json({
    msg: "success",
    result: result,
  });
});
