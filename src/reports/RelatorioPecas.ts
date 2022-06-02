const fs = require( 'fs' );
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Relatorio } from './Relatorio';

class RelatorioPecas
		implements
			Relatorio

{
	public build(path:null|string)
	{
		(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
		var contentpdf = {
			content: [
				'First paragraph',
				'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
			]
			
		}
		const pdfDocGenerator = pdfMake.createPdf(contentpdf);
		var document = pdfDocGenerator.getStream();
		
	}
}

export { RelatorioPecas };