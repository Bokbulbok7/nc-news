const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs
    .readFile(`/home/meeragopi/northcoders/projects/be-nc-news/endpoints.json`)
    .then((data) => {
      return JSON.parse(data);
    });
};
