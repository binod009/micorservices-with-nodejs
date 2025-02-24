// import Cart from "./cart.model";
// import Customer from "./customers.model";
// import Wishlist from "./wishlists.model";
// Cart.belongsTo(Customer, {
//     foreignKey: "user_id", // Linking customer_id to Customer model's id
//     as: "customer", // Optional: alias for the associated Customer object
// });


// Customer.hasMany(Wishlist, {
//     foreignKey:"customer_id",  // This links Wishlist to Customer
//     as: "wishlists",  // Alias for the relationship
// });

// Customer.hasMany(Cart, {
//     foreignKey:"customer_id",
//     as:"carts"
// })


// // Define the reverse relationship (Wishlist belongs to Customer)
// Wishlist.belongsTo(Customer, {
//     foreignKey: "customer_id", 
//     as: "customers",  // Alias for the relationship
//   });

  