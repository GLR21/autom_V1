import { Pecas } from "../objects/Pecas";
import { Transaction } from "./interface/Transaction";

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

		var insert =
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

		return await this.query( insert ).then( (  )=>{ return true } );
	}
	delete(parameter: Number) {
		throw new Error("Method not implemented.");
	}
	get(parameter: Number) {
		throw new Error("Method not implemented.");
	}
	getAll() 
	{
		this
		.query( `SELECT * FROM ${ PecasTransaction.TABLE_NAME } ` )
		.then
		( 
			( res ) =>
			{
				var pecas = new Array();

				res.forEach
				(
					element =>
					{
						pecas.push( new Pecas( element.id, element.nome, element.marca, element.descricao, element.valor_compra, element.valor_revenda ) );
					}
				);

				return pecas;
			} 
		);
	}

}

export { PecasTransaction };