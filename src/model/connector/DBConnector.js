const { Client } = require('pg');

module.exports = 

class DBConnector
{
    constructor()
    {
        return new Client(
        {
            user: "postgres",
            password: "postgres",
            host: "localhost",
            database: "postgres",
            port: 5432
        });
    }
           
}

