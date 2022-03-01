const fs = require( 'fs' );

module.exports = 

class JUtil
{
	static getFileContents( path )
	{
		return fs.readFileSync( path ).toString();
	}

	static replaceContents( string, replaces )
	{
		replaces.forEach( element => 
		{
			string = string.replace( element['key'], element['value'] );	
		});

		return string;
	}

	static writeFile( path, content )
	{
		fs.writeFileSync( path, content, { flag: 'w' } );
		return path;
	}	
}