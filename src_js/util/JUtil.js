"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JUtil = void 0;
const fs = require('fs');
const crypto = require('crypto');
class JUtil {
    static getFileContents(path) {
        return fs.readFileSync(path).toString();
    }
    static replaceContents(string, replaces) {
        replaces.forEach(element => {
            string = string.replace(element['key'], element['value']);
        });
        return string;
    }
    static writeFile(path, content) {
        fs.writeFileSync(path, content, { flag: 'w' });
        return path;
    }
    static returnJSONFromFile(path) {
        return JSON.parse(fs.readFileSync('resources/db.json').toString());
    }
    static hashString(string_to_hash, algorithm_type) {
        return crypto.createHmac(algorithm_type, Buffer.from(string_to_hash).toString('utf8')).digest('hex');
    }
}
exports.JUtil = JUtil;
JUtil.SHA256 = 'sha256';
JUtil.SHA512 = 'sha512';
