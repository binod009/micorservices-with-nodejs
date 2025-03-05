import { Model, Sequelize,DataTypes } from "sequelize";

class Order extends Model {
    public order_id!:number;
    public customer_id!: number;
    public order_date!: Date;
    public total_amount!: number;
    public order_status!: string;
    public payment_status!: string;
    public payment_method!: string;
    public shipping_address!: string;
    public billing_address!: string;
    public tracking_number!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

export const orderModel = (sequelize: Sequelize) => {
   const Order = sequelize.define("orders",{
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'customers', // References the 'customers' table
                key: 'id',         // Links to the 'id' column in customers
            },
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // Defaults to current date/time
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2), // e.g., 99999999.99
            allowNull: false,
        },
        order_status: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'pending', // Common default status
        },
        payment_status: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'unpaid', // Common default
        },
        payment_method: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        shipping_address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        billing_address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        tracking_number: {
            type: DataTypes.TEXT,
            allowNull: true, // Optional, as it might be added later
        },
    }, { timestamps: true })
    
    return Order;
}
