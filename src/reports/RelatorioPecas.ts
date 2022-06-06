
import PdfPrinter from 'pdfmake';
import { PecasTransaction } from '../model/PecasTransaction';
import { Relatorio } from './Relatorio';
const fs = require( 'fs' );

class RelatorioPecas
		extends
			Relatorio

{
	public async build(path:null | string): Promise<any> 
	{
		var printer = new PdfPrinter( Relatorio.FONTS );
		var docDefinition = 
		{
			pageSize: 'A4',
			pageMargins: 72,
			content: 
			[
				{
					table: 
					{
						headerRows: 1,
						widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
						body: 
						[
							["Nome", "Marca","Descrição", "Compra", "Revenda"],
						],	
					},
				},
			]
		};

		docDefinition['header'] = Relatorio.HEADER;
		let pecas_transaction = new PecasTransaction();
		var pecas = await pecas_transaction.getAll();
		
		pecas.forEach
		(
			peca =>
			{
				docDefinition.content[0].table?.body.push( [ peca.nome, peca.marca.nome, ( peca.descricao === null ? '': peca.descricao ), "R$"+peca.valor_compra.replace( '.',',' ),  "R$"+peca.valor_revenda.replace( '.', ',' ) ] );
			}
		)
		
		try
		{
			var pdfDoc = printer.createPdfKitDocument( docDefinition );
			pdfDoc.pipe( fs.createWriteStream( `${path}` ) );
			pdfDoc.end();
			return true;
		}
		catch( e )
		{
			console.log( e );
			return false;
		}
		
	}
}

export { RelatorioPecas };