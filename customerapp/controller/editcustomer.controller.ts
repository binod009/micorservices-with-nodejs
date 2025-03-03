import { asyncHandler } from "../utils/asyncHandler";
import Editcustomerservices from "../services/editcustomer.services";


export const EditCustomerDetails = asyncHandler(async (req, res) => {
  const body = req.body;

  const result = await Editcustomerservices.updateCustomer(body);
  res.status(result.status).json(result);
});

export const createCustomer = asyncHandler(async (req, res) => {
  const body = req.body;
  const result = await Editcustomerservices.createCustomer(body);
  res
    .status(result?.status)
    .json({ status: 200, msg: "success", result: result });
});
