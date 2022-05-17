import { Pessoa } from "./Pessoa";

class PessoaJuridica
	extends
		Pessoa	
{

	nome_fantasia:string;
	cnpj         :string;
    data_registro:Date;

	constructor
    ( 
        id              :Number|null = null,
        nome            :string,
        email           :string,
        senha           :string|null,
        telefone        :string,
        sys_auth        :Number = 2,
        cep             :string,
        rua             :string,
        bairro          :string,
        numero_endereco  :Number,
        cidade          :string,
        estado          :string,
        tipo_pessoa     :Number,
		nome_fantasia   :string,
		cnpj            :string,
        data_registro   :Date
    )
    {
        super( id, nome, email, senha, telefone, sys_auth, cep, rua, bairro,numero_endereco, cidade,estado, tipo_pessoa );
		this.cnpj 			= cnpj;
		this.nome_fantasia 	= nome_fantasia;
        this.data_registro  = data_registro
	}
}

export  { PessoaJuridica };