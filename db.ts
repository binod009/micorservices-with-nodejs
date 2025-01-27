
import { Pool} from "pg";

type databaseTypes = {
  user: string,
  host: string,
  database: string,
  password: string,
  port: number,
}
  

export default class Database{
  private user: string;
  private host: string;
  private database: string;
  private password: string;
  private port: number;
  public pool: Pool;
  
  constructor() {
    (this.user = "postgres"),
      (this.host = "localhost"),
      (this.database = "usermanagement"),
      (this.password = "binod@555"),
      (this.port = 5432);
    this.pool = new Pool({
      user: this.user,
      database: this.database,
      password: this.password,
      port: this.port,
    });
  }

  connectDB() {
    this.pool.connect((err) => {
      if (err) {
        console.log("cannot connect to PostgreshServer");
      } else console.log("connect to postgresh");
    });
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


