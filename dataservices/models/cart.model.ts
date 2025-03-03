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
  public updateAt!: Date
  public static associate(models:any) {
    Cart.belongsTo(models.Customer,{foreignKey:'customer_id'})
  }
}
  
  export const cartModel = (sequelize: Sequelize) => {
    const Cart = sequelize.define(
      "carts",
      {
        cart_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
            },
        customer_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "customers",
            key: "id",
          },
          onDelete: "CASCADE",  // optional, ensures deletion of Cart when Customer is deleted
       
        },
        product_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "products",
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
        timestamps: true,
      }
    );
  
    return Cart;
  };