import { Pool } from "pg";
import { Sequelize } from "sequelize";
type databaseTypes = {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
};

const sequelize = new Sequelize(
  `postgres://postgres:${process.env.DB_PASS}@localhost:5432/${process.env.DB}`,{logging:false}
);


// **POOL is Not beign Used**

export default class Database {
  private user: string;
  private host: string;
  private database: string | undefined;
  private password: string | undefined;
  private port: number;
  public pool: Pool;

  constructor() {
    (this.user = "postgres"),
      (this.host = "localhost"),
      (this.database = process.env.DB),
      (this.password = process.env.DB_PASS),
      (this.port = 5432);
    this.pool = new Pool({
      host: this.host,
      user: this.user,
      database: this.database,
      password: this.password,
      port: this.port,
    });
  }

  connectDB() {
    sequelize.authenticate().then(() => {
      console.log('connected to database')
    }).catch((error) => {
      console.log('database connection error', error);
    })
  }
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
export { sequelize };
