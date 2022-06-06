const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "7003242447",
    database: "postgres"
})

module.exports = client