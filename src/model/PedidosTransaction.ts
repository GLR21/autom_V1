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
		var insert = `Insert into pm_pedidos ( total,status ) values ( ${ parameter.total }, ${ parameter.status } ) RETURNING id`;
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
	async delete(parameter: any)
	{
		return await Promise.all
		( 
			[
				await super.query( `DELETE from pm_pedidos_pecas where ref_pedido = ${ parameter }` ),
				await super.query( `DELETE from pm_pedidos_pessoa where ref_pedido = ${ parameter }` ),
				await super.query( `DELETE from pm_pedidos where id = ${ parameter }` ),
			]
		)
		.then
		( 
			()=>
			{
				return true;
			} 
		)
		.catch
		( 
			( e )=>
			{
				console.log( e );
				return false;
			} 
		);
	}

	async get(parameter: any)
	{
		return await super.query( `SELECT * from pm_pedidos where id = ${ parameter.id }` )
		.then
		(
			async( res )=>
			{
				return await Promise.all( res.rows.map( async( pedidoReturn )=>
				{


					let pedido = new Pedidos( pedidoReturn.id, 0, pedidoReturn.total, [], pedidoReturn.status );

					let pecas = await super.query( `SELECT * from pm_pedidos_pecas where ref_pedido = ${ pedidoReturn.id }` );

					pecas.rows.forEach
					(
						element => 
						{
							pedido.pecasPedido.push( new PecasPedidos( element.ref_peca, element.quantidade ) );
						}
					);

					let ref_pessoa = await super.query( `select ref_pessoa from pm_pedidos_pessoa where ref_pedido = ${ pedido.id }` );

					pedido.ref_pessoa = ref_pessoa.rows[0].ref_pessoa;

					return pedido;
				} ) );
			}
		);
	}

	public async getAll( param?:any|null )
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

					var query_pessoa = `SELECT ref_pessoa from pm_pedidos_pessoa where ref_pedido = ${pedido.id}`;
					var query_peca   = `SELECT ref_peca, quantidade from pm_pedidos_pecas where ref_pedido = ${pedido.id}`;

					var id_pessoa;
					var pm_pedidos_pecas;

					if( typeof param != 'undefined' )
					{
						
						if( param.hasOwnProperty('ref_pessoa') )
						{
							if( typeof param.ref_pessoa != 'undefined'  )
							{
								query_pessoa+= ` AND ref_pessoa = ${ param.ref_pessoa }`;
							}

							id_pessoa = await super.query( query_pessoa );
							pm_pedidos_pecas = await super.query( query_peca );
						}
						else if( param.hasOwnProperty( 'ref_peca' ) )
						{
							if( typeof param.ref_peca != 'undefined' )
							{
								query_peca+= ` AND ref_peca = ${ param.ref_peca }`
							}

							id_pessoa = await super.query( query_pessoa );
							pm_pedidos_pecas = await super.query( query_peca );
						}
						else
						{
							pm_pedidos_pecas = await super.query( query_peca );
							id_pessoa = await super.query( query_pessoa );	
						}
						
					}
					else
					{
						pm_pedidos_pecas = await super.query( query_peca );
						id_pessoa = await super.query( query_pessoa );
					}

					if( id_pessoa.rows.length > 0 && pm_pedidos_pecas.rows.length > 0  )
					{
						pm_pedidos_pecas.rows.forEach
						(
							element => 
							{
								pedido.pecasPedido.push( new PecasPedidos( element.ref_peca, element.quantidade ) );
							}
						);
							
						pedido.ref_pessoa = id_pessoa.rows[0].ref_pessoa;
		
						pedidos.push( pedido );

					}

				} ) );

				return pedidos;
			}
		);
	}

	async conclude( param:any )
	{
		return await super.query( `UPDATE pm_pedidos set status = 3 where id = ${ param }` )
		.then
		( 
			()=>
			{ 
				return true; 
			} 
		)
		.catch
		( 
			( e )=>
			{
				console.log( e );
				return false;
			} 
		);
	}

	async cancel( param:any )
	{
		return await super.query( `UPDATE pm_pedidos set status = 1 where id = ${ param }` )
		.then
		( 
			()=>
			{ 
				return true; 
			} 
		)
		.catch
		( 
			( e )=>
			{
				console.log( e );
				return false;
			} 
		);
	}
	
}


export { PedidosTransaction };