import { RelatorioPecas } from "./RelatorioPecas";
import { RelatorioPedidos } from "./RelatorioPedidos";

class ReportsController
{
	public static RELATORIO_PECAS = 'RelatorioPecas';
	public static RELATORIO_PEDIDOS = 'RelatorioPedidos';

	static async generateReport( report:string, param:null|any )
	{
		let relatorio;
		let response;
		switch( report )
		{
			case this.RELATORIO_PECAS:
				relatorio = new RelatorioPecas();
				response = await relatorio.build( param );
			break;
			case this.RELATORIO_PEDIDOS:
				relatorio = new RelatorioPedidos();
				response  = await relatorio.build( param );
		}

		return response;
	}
}

export { ReportsController };