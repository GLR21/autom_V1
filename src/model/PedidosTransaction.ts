import { Transaction } from "./interface/Transaction";
import { Pedidos }     from "../objects/Pedidos";

class PedidosTransaction 
	extends
		Transaction
			implements
				TransactionInterface<Pedidos>
{
	constructor()
	{
		super();
	}

	async store(parameter: Pedidos)
	{
		var insert = `Insert into pm_pedidos ( total ) values ( ${ parameter.total } ) RETURNING id`;
		
		return await super.query( insert ).then
		(
			async ( res )=>
			{
				parameter.id = res.rows[0].id;

				parameter.pecasPedido.forEach
				(
					async peca=>
					{
						await super.query( `insert into pm_pedidos_pecas ( ref_pedido, ref_peca, quantidade ) values ( ${ parameter.id }, ${ peca.ref_peca }, ${ peca.quantidade } )` );
					}
				)

				await super.query( ` insert into pm_pedidos_pessoa ( ref_pessoa, ref_pedido ) values ( ${ parameter.ref_pessoa }, ${ parameter.id } )  ` );


				return true;
			}
		);

	}
	delete(parameter: Number)
	{
		throw new Error("Method not implemented.");
	}
	get(parameter: any)
	{
		throw new Error("Method not implemented.");
	}
	
}


export { PedidosTransaction };