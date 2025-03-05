import { Model, Sequelize,DataTypes } from "sequelize";


class OrderItem extends Model {
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

    public associate(models: any) {
        // Associations for Wishlist Model
    OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
      }
}


export const orderItemModel = (sequelize: Sequelize) => {
    const OrderItem = sequelize.define("orders_items", {
        order_items_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false
        },
        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "orders",
                key:"order_id"
          }
        },
        product_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'products', // References the 'customers' table
                key: 'id',         // Links to the 'id' column in customers
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false, // Defaults to current date/time
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2), // e.g., 99999999.99
            allowNull: false,
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2), // e.g., 99999999.99
            allowNull: false,
        },
        
    }, { timestamps: true })
    
    return OrderItem;
}
