
class Pecas
{
	id:Number|null 				= null;
	nome:string 				= '';
	marca:Number|null 			= null;
	descricao:string|null 		= null; 
	valor_compra:string|null 	= null;
	valor_revenda:string|null 	= null;

	constructor( id:Number|null, nome:string, marca:Number, descricao:string|null, valor_compra:string, valor_revenda:string )
	{
		this.id 			= id;
		this.nome 			= nome;
		this.marca			= marca;
		this.descricao		= descricao;
		this.valor_compra	= valor_compra;
		this.valor_revenda	= valor_revenda;
	}
}

export { Pecas };