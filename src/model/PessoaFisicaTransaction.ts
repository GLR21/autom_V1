import { PessoaFisica } from "../objects/PessoaFisica";
import { Transaction } from "./interface/Transaction";

class PessoaFisicaTransaction
	extends 
		Transaction
			implements
				TransactionInterface<PessoaFisica>
{

	constructor()
    {
        super();
    }

	async store(parameter: PessoaFisica, is_update = false)
	{
		var insert = '';
		
		if(  is_update )
		{
			insert = 
			`UPDATE
				pm_pessoa_fisica
			SET
				cpf='${parameter.cpf}',
				rg ='${parameter.rg}',
				dt_nascimento = '${parameter.data_nascimento}'
			WHERE
				ref_pessoa = ${ parameter.id }
			`;
		}
		else
		{
			insert =
			`Insert into 
				pm_pessoa_fisica ( ref_pessoa, cpf, rg, dt_nascimento ) 
				values
				( 
					 ${ parameter.id },
					'${ parameter.cpf }',
					'${ parameter.rg }',
					'${ parameter.data_nascimento }'
				)`;
		}


			return await super.query( insert ).then( ( res )=> { return true } );
	}
	async delete(parameter: Number)
	{
		var is_deleted = false;

		is_deleted = await super.query( `DELETE FROM pm_pessoa_fisica where ref_pessoa = ${ parameter } ` ).then( ( res )=>{ return true; } );

		return is_deleted;
	}
	
	async get(parameter: any)
	{
		var query = `SELECT * from pm_pessoa_fisica where ref_pessoa = ${ parameter.id }`;

		return await super.query( query )
		.then
		( 
			( res )=>
			{  
				return new PessoaFisica
									( 
										parameter.id,
										parameter.nome,
										parameter.email,
										parameter.senha,
										parameter.telefone,
										parameter.sys_auth,
										parameter.cep,
										parameter.rua,
										parameter.bairro,
										parameter.numero_endereco,
										parameter.cidade,
										parameter.estado,
										parameter.tipo_pessoa,
										res.rows[0].cpf,
										res.rows[0].rg,
										res.rows[0].dt_nascimento
									); 
			} 
		);

	}

}

export { PessoaFisicaTransaction };