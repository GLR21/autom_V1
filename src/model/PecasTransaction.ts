import { Pool } from "pg";
import { Pecas } from "../objects/Pecas";
import { Transaction } from "./interface/Transaction";
import { MarcasTransaction } from "./MarcasTransaction";

class PecasTransaction 
	extends 
		Transaction
			implements
				TransactionInterface<Pecas>
{
	static TABLE_NAME = 'pm_pecas';

	constructor()
	{
		super();
	}

	async store(parameter: Pecas)
	{
		var insert;

		if( parameter.id != null )
		{
			insert = 
			`
				UPDATE 
					${ PecasTransaction.TABLE_NAME }
				SET 
					nome 		  = '${ parameter.nome }',
					descricao 	  = '${ parameter.descricao }',
					valor_compra  = to_number( '${ parameter.valor_compra }'  , '${ process.env.NUMERIC_FORMAT_PSQL }' ),
					valor_revenda = to_number( '${ parameter.valor_revenda }' , '${ process.env.NUMERIC_FORMAT_PSQL }' ),
					ref_marca 	  = ${ parameter.marca }
				WHERE
					id = ${ parameter.id }
			`;	
		}
		else
		{
			insert =
			`INSERT INTO 
				${PecasTransaction.TABLE_NAME}
			( 
				nome,
				descricao,
				valor_compra,
				valor_revenda,
				ref_marca
			) 
			values 
			( 
				'${ parameter.nome }',
				'${ parameter.descricao }',
				to_number( '${ parameter.valor_compra }'  , '${ process.env.NUMERIC_FORMAT_PSQL }' ),
				to_number( '${ parameter.valor_revenda }' , '${ process.env.NUMERIC_FORMAT_PSQL }' ),
				${ parameter.marca }
			)`;
		}

		return await this.query( insert ).then( (  )=>{ return true } );
	}
	async delete(parameter: Number)
	{
		return await this.query( `DELETE FROM ${ PecasTransaction.TABLE_NAME } WHERE id = ${ parameter }` ).then( ( )=>{ return true; } );
	}
	async get(parameter:any)
	{
		var query = `SELECT * from ${ PecasTransaction.TABLE_NAME } where id= ${parameter.id}`;
		return await this.query(  query ).
		then
		( 
			( res )=>
			{
				 var peca = res.rows[0]; 
				 return new Pecas( peca.id, peca.nome, peca.ref_marca, ( peca.descricao == 'null' ? '' : peca.descricao ) , peca.valor_compra, peca.valor_revenda  );
			} 
		);	
	}
	async getAll() 
	{
		return await this
		.query( `SELECT * FROM ${ PecasTransaction.TABLE_NAME } ` )
		.then
		( 
			async( res ) =>
			{
				var pecas_arr = new Array();


				await Promise.all( res.rows.map( async( peca )=>
				{
					var marca_transaction = new MarcasTransaction();
					var marca = await marca_transaction.get( peca.ref_marca );
					pecas_arr.push( new Pecas( peca.id, peca.nome, marca , peca.descricao, peca.valor_compra, peca.valor_revenda ) );
				} )  );

				return pecas_arr;
			} 
		);
	}

	async query(query_string: string): Promise<any> 
	{
		return await super.query( query_string );	
	}

}

export { PecasTransaction };