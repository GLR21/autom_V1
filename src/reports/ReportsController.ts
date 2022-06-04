import { RelatorioPecas } from "./RelatorioPecas";

class ReportsController
{
	public static RELATORIO_PECAS = 'RelatorioPecas';

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
		}

		return response;
	}
}

export { ReportsController };