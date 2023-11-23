const db = require("../connection");

exports.checkUserExists = (username) => {
  return db
    .query(`SELECT username FROM users WHERE username = $1;`, [username])
    .then((result) => {
      const rows = result.rows;
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "User not found.",
        });
      } else {
        return rows;
      }
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    return result.rows;
  });
};
