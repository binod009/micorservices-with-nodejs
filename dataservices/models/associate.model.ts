import { Customer } from "./customer.model";
import { Login } from "./login.model";
import { Cart } from "./cart.model";
import { Product } from "./product.model";
import { Wish } from "./wish.model";


export const defineAssociations = () => {
  // Define the one-to-one relationship
  // customer realtionship to login
  Login.hasOne(Customer, {
    foreignKey: "user_id",
  });

  Customer.belongsTo(Login, {
    foreignKey: "user_id",
  });

  // // cart relationship to customer
  // Customer.hasMany(Cart, {
  //   foreignKey: "customer_id",
  // });

  // Cart.belongsTo(Customer, {
  //   foreignKey: "customer_id",
  // });

// Wishlist relationship to Customer
// Customer.hasMany(Wish, {
//   foreignKey: 'customer_id',
//   as: 'wishlists'  // Explicit alias for the associated wishlists
// });

// // wishlist.model.js
// Wish.belongsTo(Customer, {
//   foreignKey: "customer_id",
//   as: "customer" // A wishlist belongs to a single customer
// });
  
//   Product.hasMany(Wishlist, { foreignKey: "product_id" });
//   Wishlist.belongsTo(Product, { foreignKey: "product_id" });
};
