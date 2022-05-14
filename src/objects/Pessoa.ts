
class Pessoa 
{
    id  : Number|null;
    nome: string;
    email: string;
    senha: string|null;
    telefone: string;
    sys_auth: Number;

    constructor( id:Number|null = null, nome:string, email:string, senha:string|null, telefone:string, sys_auth:Number = 2)
    {
        this.id   = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.sys_auth = sys_auth;
    }
}

export { Pessoa };