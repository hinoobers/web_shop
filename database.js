const mysql2 = require("mysql2");

const pool = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "webshop"
})

module.exports = pool.promise();