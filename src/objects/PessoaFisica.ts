import { Pessoa } from "./interface/Pessoa";

class PessoaFisica 
    implements
        Pessoa
{
    nome: string;
    email: string;
    senha: string;
    telefone: string;

    constructor( nome:string, email:string, senha:string, telefone:string, cpf:string )
    {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
    }
    
}