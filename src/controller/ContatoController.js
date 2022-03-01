const fs = require('fs');

module.exports = 

class ContatoController
{
	
	id = 1;
	/**
	 * Creates an instance of ContatoController.
	 * @author Gabriel Lange Ramos
	 */
	constructor()
	{
	}

	save( contato )
	{
		fs.appendFileSync('src/model/contatoSave.txt', `${this.id}|${contato.name}|${contato.phone}\n`, ()=>{ console.log('salve') } );
		this.id++;
	}

}

