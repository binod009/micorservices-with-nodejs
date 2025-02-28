import { Model,Sequelize, DataTypes } from "sequelize";
import { Customer } from "./customer.model";
import { Product } from "./product.model";


export class Cart extends Model{
    public cart_id!: number;
    public customer_id!: number;
    public product_id!: number;
    public quantity!: number;
    public price!: number;
    public createdAt!: Date;
    public updateAt!:Date
}

export const cartModel = (sequelize: Sequelize) => {
    Cart.init(
      {
        cart_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
            },
        customer_id: {
          type: DataTypes.INTEGER,
          references: {
            model: Customer,
            key: "id",
          },
          onDelete: "CASCADE",  // optional, ensures deletion of Cart when Customer is deleted
       
        },
        product_id: {
          type: DataTypes.INTEGER,
          references: {
            model: Product,
            key: "id",
          },
        
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, // Automatically adds `createdAt` and `updatedAt`
      }
    );
  
    return Cart;
  };
  