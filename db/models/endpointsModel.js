const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`).then((data) => {
    return JSON.parse(data);
  });
};
