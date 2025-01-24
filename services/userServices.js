const { Pool } = require('pg');
const Database = require('../db');
class UserService extends Database {
    constructor() {
        super();
    }
    getUserByEmail = async(email) => {
        const result = await this.pool.query('SELECT * FROM login WHERE email = $1', [email]);
        return result;
    }
}
module.exports = new UserService(); 