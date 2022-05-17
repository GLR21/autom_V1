
class Pessoa 
{
    id  : Number|null;
    nome: string;
    email: string;
    senha: string|null;
    telefone: string;
    sys_auth: Number;
    cep:string;
    rua:string;
    bairro:string;
    numero_endereco:Number;
    cidade:string;
    estado:string;    
    tipo_pessoa:Number;

    constructor( id:Number|null = null, nome:string, email:string, senha:string|null, telefone:string, sys_auth:Number = 2, cep:string, rua:string, bairro:string, numero_endereco:Number, cidade:string, estado:string, tipo_pessoa:Number  )
    {
        this.id             = id;
        this.nome           = nome;
        this.email          = email;
        this.senha          = senha;
        this.telefone       = telefone;
        this.sys_auth       = sys_auth;
        this.cep            = cep;
        this.rua            = rua;
        this.bairro         = bairro;
        this.numero_endereco = numero_endereco;
        this.cidade         = cidade;
        this.estado         = estado;
        this.tipo_pessoa    = tipo_pessoa;
    }
}

export { Pessoa };