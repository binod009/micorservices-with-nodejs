import { Model, Sequelize, DataTypes } from "sequelize";
export class Login extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
 
}

export const LoginModel = (sequelize: Sequelize) => {
  const Login = sequelize.define("logins",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique:true,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.TEXT,
        defaultValue: "inactive",
      },
    },
    {
      timestamps: true,
    }
  );

  return Login;
};
