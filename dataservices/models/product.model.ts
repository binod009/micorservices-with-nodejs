import { Model, Sequelize, DataTypes } from "sequelize";


class Product extends Model{
    public id!: number;
    public product_name!: string;
    public description!: string;
    public price!: number;
    public category!: string;
    public slug!: string;
    public product_image!: string;
    public createdAt!: Date;
    public updateAt!:Date    
}

export const productModel = (sequelize: Sequelize) => {
    Product.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull:false
        }, price: {
            type: DataTypes.INTEGER,
            allowNull:false
        }, category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull:false
        },
        product_image: {
            type: DataTypes.STRING,
            allowNull:true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },

    }, { sequelize, tableName: 'products', timestamps: true })
    return Product;
}