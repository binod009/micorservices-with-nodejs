const Database = require("../db");

class PostServices extends Database {
  constructor() {
    super();
  }
  createPostService = async (values) => {
    const query =
      "INSERT INTO post (title, description) VALUES ($1, $2) RETURNING *";
    const result = await this.pool.query(query, values);
    return result;
  };

  getAllPostDataService = async () => {
    const query = "SELECT * from post";
    const result = await this.pool.query(query);
    return result.rows;
  };
}

module.exports = new PostServices();
