

module.exports = 


class Contato 
{

	id    = null;
	name  = '';
	phone = '';

	/**
	 * Creates an instance of Contato.
	 * @author Gabriel Lange Ramos
	 * @param {BigInteger} id
	 * @param {String} name
	 * @param {String} phone
	 */
	constructor( name, phone )
	{
		// this.id    = id;
		this.name  = name;
		this.phone = phone;
	}	

	/**
	 * @description return the id
	 * @author Gabriel Lange Ramos
	 * @returns {BigInteger} 
	 */
	getId()
	{
		return this.id;
	}

	/**
	 * @description return the name
	 * @author Gabriel Lange Ramos
	 * @returns {String} 
	 */
	getName()
	{
		return this.name;
	}

	/**
	 * @description return the phone
	 * @author Gabriel Lange Ramos
	 * @returns {String} 
	 */
	getPhone()
	{
		return this.phone;
	}

	/**
	 * @description set a name
	 * @author Gabriel Lange Ramos
	 * @param {String} name
	 */
	setName( name )
	{
		this.name = name;
	}

	/**
	 * @description set a phone
	 * @author Gabriel Lange Ramos
	 * @param {String} phone
	 */
	setPhone( phone )
	{
		this.phone = phone;
	}

}