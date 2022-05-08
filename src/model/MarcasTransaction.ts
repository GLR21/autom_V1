import { Marcas } from "../objects/Marcas";
import { Transaction } from "./interface/Transaction";

class MarcasTransaction
	extends 
		Transaction
			implements
				TransactionInterface<Marcas>
{
	static TABLE_NAME = 'pm_marcas';

	constructor()
	{
		super();
	}
	store(parameter: Marcas)
	{
		throw new Error("Method not implemented.");
	}
	delete(parameter: Number)
	{
		throw new Error("Method not implemented.");
	}
	get(parameter: Number)
	{
		throw new Error("Method not implemented.");
	}
	async getAll() 
	{
		return await
		this
		.query( `SELECT * FROM ${ MarcasTransaction.TABLE_NAME } ` )
		.then
		( 
			( res ) =>
			{
				var marcas = new Array();

				res.forEach
				(
					element =>
					{
						marcas.push( new Marcas( element.id, element.nome ) );
					}
				);
				
				return marcas;
			} 
		);
	}
}

export { MarcasTransaction };