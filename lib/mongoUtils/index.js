const { ObjectID } = require('mongodb');

const createObjectID = id => new ObjectID(id);

module.exports = { createObjectID };
