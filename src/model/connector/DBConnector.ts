import { Client } from "pg";
import { JUtil } from "../../util/JUtil";

class DBConnector
{
	private static client: any;

	private constructor()
    {
		const dbconfig  = JUtil.returnJSONFromFile( 'resources/db_dumb.json' );
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
		return client;					
    }

	public static getClient()
	{
		if( typeof DBConnector.client == 'undefined' || DBConnector.client == null  )
		{
			DBConnector.client = new DBConnector();
		}

		return DBConnector.client;

	}
}

export { DBConnector };