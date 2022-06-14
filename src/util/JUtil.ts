
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';

class JUtil
{

	public static SHA256:string = 'sha256';
	public static SHA512:string = 'sha512';

	static getFileContents( path:string )
	{
		return fs.readFileSync( path ).toString();
	}

	static replaceContents( string:string, replaces:Object )
	{
		for( var key in replaces )
		{
			string = string.replace( key, replaces[key] );	
		}

		return string;
	}

	static writeFile( path:string, content:string )
	{
		fs.writeFileSync( path, content, { flag: 'w' } );
		return path;
	}

	static returnJSONFromFile( path:string )
	{
		return JSON.parse( fs.readFileSync( path ).toString() );
	}

	static hashString( string_to_hash:any, algorithm_type:string )
	{
		return crypto.createHmac(  algorithm_type, Buffer.from(  string_to_hash  ).toString('utf8') ).digest( 'hex' );
	}

	static getFiles( path:string|any ): Array<string>
	{
		var files = Array();
		
		fs.readdirSync( path , { withFileTypes: true }).forEach
		(
			file => 
			{
				if( file.isFile() )
				{
					files.push( path+'/'+file.name );
				}
				
			}
		);

		return files;
	}

	static updateEnvFile( key:any, value:string ,path:string )
	{
		const ENV_VARS= fs.readFileSync( path, 'utf8' ).split( os.EOL );

		const target = <any>ENV_VARS.indexOf
		(
			<any>ENV_VARS.find
			(
				(line) => 
				{
					return line.match(new RegExp(key))
				}
			)
		);

		ENV_VARS.splice( target, 1, `${key}=${value}` );

		fs.writeFileSync( path, ENV_VARS.join( os.EOL ) );
	}
}

export { JUtil };