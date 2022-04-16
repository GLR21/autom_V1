import { Client, QueryResult } from "pg";
import { DBConnector } from "../connector/DBConnector";

class Transaction
{
	client:Client;

	constructor()
	{
		const connector = new DBConnector();
		this.client = connector.getClient();
	}

	async query( query_string:string ):Promise<void | any>
	{
		return await this
						.client
						.query( query_string  )
						.then
						( 
							( res )=>
							{
								return res.rows;
							} 
						)
						.catch
						(
							( err )=>
							{
								console.log( err );
							}
						)
						.finally
						(
							()=>
							{
								this.client.end();
								console.log( 'Connection ended' );
							}
						);
	}
}

export { Transaction };