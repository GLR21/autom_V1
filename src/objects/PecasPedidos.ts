class PecasPedidos
{
	ref_peca  :Number;
	quantidade:Number;

	constructor( ref_peca:Number, quantidade:Number )
	{
		this.ref_peca  	 = ref_peca;
		this.quantidade  = quantidade;
	}
}

export { PecasPedidos };