import { Client, QueryResult } from "pg";
import { DBConnector } from "../connector/DBConnector";

class Transaction
{
	client:Client;

	constructor()
	{
		this.client = DBConnector.getClient();
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
								return res;
							} 
						)
						.catch
						(
							( err )=>
							{
								console.log( err );
							}
						);
	}
}

export { Transaction };