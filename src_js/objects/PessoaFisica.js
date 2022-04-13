"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PessoaFisica = void 0;
class PessoaFisica {
    constructor(id = null, nome, email, senha, telefone, sys_auth = 2, cpf = '') {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.sys_auth = sys_auth;
    }
}
exports.PessoaFisica = PessoaFisica;
