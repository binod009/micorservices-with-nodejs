const { Pool } = require("pg");
class Database {
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

module.exports = Database;
