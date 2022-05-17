import { TipoPerfil } from "../objects/TipoPerfil";
import { Transaction } from "./interface/Transaction";

class TipoPerfilTransaction
	extends
		Transaction
			implements 
				TransactionInterface<TipoPerfil>
{
	static TABLE_NAME = 'pm_auth';

	constructor()
	{
		super();
	}

	async store() 
	{
		throw new Error("Method not implemented.");
	}
	
	async delete()
	{
		throw new Error("Method not implemented.");
	}
	async get()
	{
		throw new Error("Method not implemented.");
	}
	
	async getAll()
	{
		return await super
						.query( `SELECT * from ${ TipoPerfilTransaction.TABLE_NAME }` )
						.then
						( 
							( res )=>
							{ 
								let typesList = new Array();
								res.rows.forEach
								(
									element => 
									{
										typesList.push( new TipoPerfil( element.id, element.descricao ) );
									}
								);
								return typesList;
							} 
						);
	}
}

export{ TipoPerfilTransaction };