import { PessoaJuridica } from "../objects/PessoaJuridica";
import { Transaction } from "./interface/Transaction";

class PessoaJuridicaTransaction
	extends
		Transaction
			implements
				TransactionInterface<PessoaJuridica>
{
	constructor()
	{
		super();
	}

	async store(parameter: PessoaJuridica, is_update:boolean = false)
	{
		var insert = '';

		if( is_update )
		{
			insert = 
			`UPDATE 
				pm_pessoa_juridica
			SET 
				razao_social 	= '${parameter.nome}',
				nome_fantasia 	= '${parameter.nome_fantasia}',
				cnpj			= '${parameter.cnpj}',
				dt_registro     = '${parameter.data_registro}'
			WHERE
				ref_pessoa = ${ parameter.id }
			`;
		}
		else
		{
			insert = 
			`INSERT INTO pm_pessoa_juridica ( ref_pessoa, razao_social, nome_fantasia, cnpj, dt_registro ) values
			(
				 ${ parameter.id },
				'${ parameter.nome }',
				'${ parameter.nome_fantasia }',
				'${ parameter.cnpj }',
				'${ parameter.data_registro }'
			)
			`;
		}

		return await super.query( insert ).then( ( res )=>{ return true } );
	}
	async delete(parameter: Number)
	{
		var is_deleted = false;

		is_deleted = await super.query( `DELETE FROM pm_pessoa_juridica where ref_pessoa = ${ parameter } ` ).then( ( res )=>{ return true; } );

		return is_deleted;
	}

	async get(parameter: any)
	{
		var query = `SELECT * from pm_pessoa_juridica where ref_pessoa = ${ parameter.id }`;

		return await super.query( query )
		.then
		( 
			( res )=>
			{  
				return new PessoaJuridica
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
										res.rows[0].nome_fantasia,
										res.rows[0].cnpj,
										res.rows[0].dt_registro
									); 
			} 
		);
	}
}

export { PessoaJuridicaTransaction };