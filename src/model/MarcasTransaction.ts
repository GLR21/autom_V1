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
	async store(parameter: Marcas)
	{
		throw new Error("Method not implemented.");
	}
	async delete(parameter: Number)
	{
		throw new Error("Method not implemented.");
	}
	async get(parameter: Number)
	{
		return await this.query( `SELECT * from ${ MarcasTransaction.TABLE_NAME } where id = ${parameter}` )
		.then
		( 
			( res )=>
			{ 
				var marca;
				res.rows.forEach
				(
					element => 
					{	
						marca  = new Marcas( element.id, element.nome );
					}
				);
				 
				return marca;
			} 
		);
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

				res.rows.forEach
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