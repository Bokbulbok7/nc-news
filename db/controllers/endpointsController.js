const { selectEndpoints } = require("../models/endpointsModel");

exports.getEndpoints = (req, res) => {
  selectEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints: endpoints });
  });
};
