"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PessoaFisicaTransaction = void 0;
const DBConnector_1 = require("./connector/DBConnector");
const JUtil_1 = require("../util/JUtil");
const PessoaFisica_1 = require("../objects/PessoaFisica");
class PessoaFisicaTransaction {
    constructor() {
        const connector = new DBConnector_1.DBConnector();
        this.client = connector.getClient();
    }
    store(pessoa) {
        return __awaiter(this, void 0, void 0, function* () {
            let insert;
            console.log(pessoa.id);
            if (pessoa.id != null) {
                insert = `UPDATE 
                        pm_pessoa 
                            set 
                                nome='${pessoa.nome}',
                                email='${pessoa.email}',
                                senha='${JUtil_1.JUtil.hashString(pessoa.senha, JUtil_1.JUtil.SHA256)}',
                                telefone='${pessoa.telefone}',
                                sys_auth=${pessoa.sys_auth} 
                            where id=${pessoa.id}`;
            }
            else {
                insert = `INSERT INTO 
            pm_pessoa 
            ( 
                nome, 
                email, 
                senha, 
                telefone, 
                sys_auth 
            ) 
            values 
            ( 
                '${pessoa.nome}', 
                '${pessoa.email}',
                '${JUtil_1.JUtil.hashString(pessoa.senha, JUtil_1.JUtil.SHA256)}',
                '${pessoa.telefone}',
                ${pessoa.sys_auth}
            )`;
            }
            return yield this.client.query(insert)
                .then(() => {
                return true;
            })
                .catch((err) => {
                console.log(err);
                return false;
            })
                .finally(() => {
                this.client.end();
                console.log('connection closed');
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query('Select * from pm_pessoa order by id asc;')
                .then((res) => {
                let array_pessoa = new Array();
                res.rows.forEach(element => {
                    array_pessoa.push(new PessoaFisica_1.PessoaFisica(element.id, element.nome, element.email, element.senha, element.telefone));
                });
                return array_pessoa;
            }).catch((e) => { console.log(e); }).finally(() => { this.client.end(); console.log('connection closed'); });
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `Select * from pm_pessoa where id = ${id}`;
            return yield this.client.query(query).then((res) => {
                let pessoa;
                res.rows.forEach(element => {
                    pessoa = new PessoaFisica_1.PessoaFisica(element.id, element.nome, element.email, element.senha, element.telefone, element.sys_auth);
                });
                return pessoa;
            }).catch((err) => { console.log(err); }).finally(() => { this.client.end(); console.log('connection closed'); });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let delete_query = `DELETE FROM pm_pessoa where id=${id}`;
            this.client.query(delete_query).then(() => {
                return true;
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                this.client.end();
                console.log('connection closed');
            });
        });
    }
}
exports.PessoaFisicaTransaction = PessoaFisicaTransaction;
