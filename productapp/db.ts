import { Pool } from "pg";
import { ClientConfig } from "./utils/config";
class Database {
  private user: string | undefined;
  private database: string | undefined;
  private pass: string | undefined;
  private port: number | undefined;
    public pool: Pool;
    
  constructor() {
    this.user = ClientConfig.user;
    this.database = ClientConfig.dbuser;
    this.pass = ClientConfig.pass;
    this.port = ClientConfig.port;
    this.pool = new Pool({
      database: this.database,
      port: this.port,
      password: this.pass,
      user: this.user,
    });
  }
  async connectDB() {
    this.pool.connect((err) => {
      if (!err) {
        console.log("connnected to database");
      } else {
        console.log("got error from database", err);
      }
    });
  }
}

export default Database;
