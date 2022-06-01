import { RelatorioPecas } from "./RelatorioPecas";

class ReportsController
{
	public static RELATORIO_PECAS = 'RelatorioPecas';

	static generateReport( report:string, param:null|any )
	{
		switch( report )
		{
			case this.RELATORIO_PECAS:
				new RelatorioPecas().build( param );
			break;
		}
	}
}

export { ReportsController };