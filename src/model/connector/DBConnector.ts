import { Client } from "pg";
import { JUtil } from "../../util/JUtil";

class DBConnector
{
	client: any;
	constructor()
    {
		const dbconfig  = JUtil.returnJSONFromFile( 'resources/db.json' );
		const client =  new Client
		(
			{
				user: dbconfig.user,
				password: dbconfig.password,
				host: dbconfig.host,
				database: dbconfig.database,
				port: dbconfig.port
        	}
		);

		client.connect
		(
			err => 
			{
				if (err) 
				{
				  console.error('connection error', err.stack);
				} 
				else 
				{
				  console.log('connected');

				}
			}
		)
		this.client = client;					
    }

	getClient()
	{
		return this.client;
	}
}

export { DBConnector };