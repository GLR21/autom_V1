import { Relatorio } from "./Relatorio";
import PdfPrinter from 'pdfmake';
import { PedidosTransaction } from "../model/PedidosTransaction";
import { PessoaTransaction } from "../model/PessoaTransaction";
import { Pedidos } from "../objects/Pedidos";
import { PecasTransaction } from "../model/PecasTransaction";
import { MarcasTransaction } from "../model/MarcasTransaction";
const fs = require( 'fs' );

class RelatorioPedidos
	extends
		Relatorio
{
	public async build(param:any): Promise<any> 
	{
		var printer = new PdfPrinter( Relatorio.FONTS );

		let pedidostransaction = new PedidosTransaction();
		let pessoatransaction  = new PessoaTransaction();

		let pedidosArr = await pedidostransaction.getAll( param );

		var docDefinition = 
		{
			pageSize: 'A4',
			pageMargins: 72,
			content: 
			[
				{
					table: 
					{
					},
					layout: 'noBorders'
				},
			]
		};

		docDefinition.content[0].table['headerRows'] = 1;
		docDefinition.content[0].table['body'] = new Array();

		var tableBody = docDefinition.content[0].table['body'];
		
		try
		{
			if( pedidosArr.length > 0 )
			{
				await Promise.all( pedidosArr.map( async(  pedido:Pedidos )=>
				{
					let pessoa = await pessoatransaction.get( pedido.ref_pessoa );
					let produtos = await this.generateInnerTable( pedido );
	
					tableBody.push( [ { text:`Pedido: ${pedido.id}`, bold: true, border:[ false, false, false, false ] }  ] );
					tableBody.push( [ { text:`Cliente: ${pedido.ref_pessoa}-${pessoa.nome}`, bold: true, border:[ false, false, false, false ] }  ] );
					tableBody.push( [ produtos] );
					tableBody.push( [ { text: `Total: R$${pedido.total?.toString().replace( '.',',' )}`, bold:true, margin: [ 0, 0, 0, 20 ] } ] )
				} ) )
			}
			else
			{
				tableBody.push( [ { text:`Não há pedidos para este filtro.`, bold: true, border:[ false, false, false, false ] }  ] )
			}


			docDefinition['header'] = Relatorio.HEADER;
			var pdfDoc = printer.createPdfKitDocument( docDefinition );
			pdfDoc.pipe( fs.createWriteStream( `${param.path}` ) );
			pdfDoc.end();
		
			return true;
		}
		catch( e )
		{
			return false;
		}
	}


	async generateInnerTable( pedido )
	{

		var innerTable = 
			{
				table:
				{
					headerRows: 1,
					widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
					body: 
					[
						["Cód. produto", "Nome","Marca", "Quantidade", "Valor"],
					],
				}
			}

		let pecaTransaction    = new PecasTransaction();
		let marcaTransaction   = new MarcasTransaction();	

		await Promise.all( pedido.pecasPedido.map( async( peca_pedido )=>
		{
				let peca  = await pecaTransaction.get( { id:peca_pedido.ref_peca } );

				let marca = await marcaTransaction.get( <Number>peca.marca );
				
				innerTable.table.body.push( [ peca.id, peca.nome, marca.nome, peca_pedido.quantidade, "R$"+peca.valor_revenda?.replace( '.', ',' ) ] );

		} ) );

		return innerTable;
	}

}

export { RelatorioPedidos };