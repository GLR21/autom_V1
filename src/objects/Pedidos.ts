import { PecasPedidos } from "./PecasPedidos";

class Pedidos
{
	id:Number|null;
	ref_pessoa:Number;
	total:Number|null;
	pecasPedido:Array<PecasPedidos>;
	status:Number;
	

	constructor( id:Number|null, ref_pessoa:Number, total:Number|null, pecasPedido:Array<PecasPedidos>, status:Number = 2 )
	{
		this.id = id;
		this.ref_pessoa = ref_pessoa;
		this.total = total;
		this.pecasPedido = pecasPedido;
		this.status = status;
	}
}

export { Pedidos }