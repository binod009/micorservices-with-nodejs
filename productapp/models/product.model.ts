import { sequelize } from "../db";
import { DataTypes } from "sequelize";
import ProductServices from "../services/product.services";

const productModel = sequelize.define("product", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type:DataTypes.TEXT
    },
    price: {
        type:DataTypes.INTEGER
    },
    category: {
        type: DataTypes.STRING, 
    },
    slug: {
        type:DataTypes.STRING
    },
    product_image: {
        type:DataTypes.STRING,
    }

}, {
    timestamps:true
})

export default productModel;