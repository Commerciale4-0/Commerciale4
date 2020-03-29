const faunadb = require("faunadb");
const query = faunadb.query;
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
});
exports.client = client;
exports.query = query;
