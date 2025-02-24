import { Customer } from "./customer.model";
import { Login } from "./login.model";


export const defineAssociations = () => {
  // Define the one-to-one relationship
  Login.hasOne(Customer, {
    foreignKey: "user_id",

  });
    
  Customer.belongsTo(Login, {
    foreignKey: "user_id",
  
  });

};