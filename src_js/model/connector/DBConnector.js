"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnector = void 0;
const pg_1 = require("pg");
const JUtil_1 = require("../../util/JUtil");
class DBConnector {
    constructor() {
        const dbconfig = JUtil_1.JUtil.returnJSONFromFile('resources/db.json');
        const client = new pg_1.Client({
            user: dbconfig.user,
            password: dbconfig.password,
            host: dbconfig.host,
            database: dbconfig.database,
            port: dbconfig.port
        });
        client.connect(err => {
            if (err) {
                console.error('connection error', err.stack);
            }
            else {
                console.log('connected');
            }
        });
        this.client = client;
    }
    getClient() {
        return this.client;
    }
}
exports.DBConnector = DBConnector;
