import { Model,Sequelize,DataType, DataTypes } from "sequelize";


class Cart extends Model{
    public cart_id!: number;
    public customer_id!: number;
    public product_id!: number;
    public quantity!: number;
    public price!: number;
    public createdAt!: Date;
    public updateAt!:Date
}

export const  cartModel = (sequelize: Sequelize) => {
    Cart.init({
        id: {
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull:false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
    },{sequelize})
}