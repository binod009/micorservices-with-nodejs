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
    Order.init( {
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
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'pending', // Common default status
        },
        payment_status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'unpaid', // Common default
        },
        payment_method: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        shipping_address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        billing_address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        tracking_number: {
            type: DataTypes.STRING(50),
            allowNull: true, // Optional, as it might be added later
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, { sequelize, tableName: "orders", timestamps: true })
    
    return Order;
}
