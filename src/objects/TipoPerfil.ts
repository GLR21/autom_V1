class TipoPerfil
{
	id:Number|null;
	descricao:string;

	constructor( id:Number|null, descricao:string )
	{
		this.id        = id;
		this.descricao = descricao;	
	}
}

export { TipoPerfil };