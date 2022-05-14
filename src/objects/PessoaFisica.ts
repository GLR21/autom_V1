import { Pessoa } from "./Pessoa";

class PessoaFisica 
    extends
        Pessoa
{

    constructor( id:Number|null = null, nome:string, email:string, senha:string|null, telefone:string, sys_auth:Number = 2, cpf:string = '' )
    {
        super( id, nome, email, senha, telefone, sys_auth );
    }
}

export { PessoaFisica };