import { asyncHandler } from "../utils/asyncHandler";
import Editcustomerservices from "../services/editcustomer.services";
const customer_svc = new Editcustomerservices();

// export const EditCustomerDetails = asyncHandler(async (req, res) => {
//   const body = req.body;
//   const result = await customer_svc.updateCustomer(body);
//   res.status(200).json({
//     msg: "success",
//     result: result,
//   });
// });

export const createCustomer = asyncHandler(async (req, res) => {
    const body = req.body;
    
    const result = await customer_svc.createCustomer(body);
    res.status(201).json({
        msg: 'success',
        data: result
    })
})