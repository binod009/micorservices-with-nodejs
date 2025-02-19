import { asyncHandler } from "../utils/asyncHandler";
import EditCustomerServices from "../services/editcustomer.services";
const customer_svc = new EditCustomerServices();

export const createwishList = asyncHandler(async (req, res) => {
  const body = req.body;
  const result = await customer_svc.addWhishList(body);
  res.status(200).json({
    msg: "success",
    result: result,
  });
});


export const getWishList = asyncHandler(async (req, res) => {
  const customerid = req.body;
  const result = await customer_svc.getWishList(customerid);
  res.status(200).json({
    msg: "success",
    result: result,
  });
});
