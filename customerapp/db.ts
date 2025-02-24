import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  `postgres://postgres:${process.env.DB_PASS}@localhost:5432/${process.env.DB}`
);

export const connectDB = () => {
    sequelize
      .authenticate()
      .then(() => {
        sequelize
          .sync({force:true,alter: true})
          .then(() => console.log("all models sync"));
      })
      .catch((err) => console.log("error connecting to database", err)); 
}
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "usermanagement",
//   password: "binod@555",
//   port: 5432,
// });

// pool.connect((err) => {
//   if (err) {
//     console.log("cannot connect to PostgreshServer");
//   } else console.log("connect to postgresh");
// });


export {sequelize};