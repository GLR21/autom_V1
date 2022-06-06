import { Transaction } from "./interface/Transaction";
import { Pedidos }     from "../objects/Pedidos";
import { PecasPedidos } from "../objects/PecasPedidos";

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
		let update = false;

		if( parameter.id )
		{
			update = true;
			insert = `UPDATE pm_pedidos set total = ${ parameter.total }, status = ${ parameter.status } where id = ${ parameter.id }`;
		}
		
		return await super.query( insert ).then
		(
			async ( res )=>
			{

				if( !update )
				{
					parameter.id = res.rows[0].id;
				} 

				if( update )
				{
					await super.query( `DELETE FROM pm_pedidos_pecas where ref_pedido = ${ parameter.id }` );
				}

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

	public async getAll()
	{
		return await super.query( 'SELECT id, total, status from pm_pedidos;' )
		.then
		(
			async( res )=>
			{
				let pedidos = new Array();

				await Promise.all( res.rows.map( async( pedidoObj )=>
				{
					var pedido = new Pedidos( pedidoObj.id,  0 , pedidoObj.total, [], pedidoObj.status  );

					var pm_pedidos_pecas = await super.query( `SELECT ref_peca, quantidade from pm_pedidos_pecas where ref_pedido = ${pedido.id}` );

					pm_pedidos_pecas.rows.forEach
					(
						element => 
						{
							pedido.pecasPedido.push( new PecasPedidos( element.ref_peca, element.quantidade ) );
						}
					);
					
					var id_pessoa = await super.query( `SELECT ref_pessoa from pm_pedidos_pessoa where ref_pedido = ${pedido.id}` );
					pedido.ref_pessoa = id_pessoa.rows[0].ref_pessoa;	

					pedidos.push( pedido );

				} ) );

				return pedidos;
			}
		);
	}
	
}


export { PedidosTransaction };