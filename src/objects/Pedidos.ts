import { PecasPedidos } from "./PecasPedidos";

class Pedidos
{
	id:Number|null;
	ref_pessoa:Number;
	total:Number|null;
	pecasPedido:Array<PecasPedidos>;
	

	constructor( id:Number|null, ref_pessoa:Number, total:Number|null, pecasPedido:Array<PecasPedidos> )
	{
		this.id = id;
		this.ref_pessoa = ref_pessoa;
		this.total = total;
		this.pecasPedido = pecasPedido;
	}
}

export { Pedidos }