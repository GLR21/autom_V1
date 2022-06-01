const PDFDocument = require( 'pdfkit' );
const fs = require( 'fs' );
import { Relatorio } from './Relatorio';

class RelatorioPecas
		implements
			Relatorio

{
	public build(path:null|string)
	{
		var doc = new PDFDocument( { autoFirstPage: true, displayTitle: true } );
		doc.text( 'Hello World' );
		doc.pipe( fs.createWriteStream( '' ) );
		doc.end();
	}
}

export { RelatorioPecas };