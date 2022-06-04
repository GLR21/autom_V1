const fs = require( 'fs' );
class Relatorio
{
	protected static FONTS = 
	{
		Roboto:
		{
			normal: `resources/fonts/Roboto/Roboto-Regular.ttf`,
			bold: 'resources/fonts/Roboto/Roboto-Bold.ttf',
			italics: 'resources/fonts/Roboto/Roboto-Italic.ttf',
			bolditalics: 'resources/fonts/Roboto/Roboto-MediumItalic.ttf'
		}
	};

	protected static HEADER =
	{
		margin: [ 200 , 10, 0, 100],
		columns: 
		[
			{
				image: `data:image/jpeg;base64,${Buffer.from( fs.readFileSync( 'resources/images/logo.png' ) ).toString( 'base64' )}`,
				width: 40,
				height: 40,
				margin: [10, 0, 0, 0]
			},
			{
				margin: [15, 10, 0, 0],
				text: 'Autom Reports',
				bold: true
			}
		]
	};

	async build( path:string|null ):Promise<any>
	{
		return true;
	}
}

export { Relatorio };