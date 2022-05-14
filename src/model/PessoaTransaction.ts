import { Pessoa } from "../objects/Pessoa";
import { JUtil } from "../util/JUtil";
import { Transaction } from "./interface/Transaction";


class PessoaTransaction
    extends 
        Transaction
            implements
                TransactionInterface<Pessoa>
{
    constructor()
    {
        super();
    }

    async store( pessoa:Pessoa)
    {
        let insert;
        
        if( pessoa.id != null )
        {
            insert = `UPDATE 
                        pm_pessoa 
                            set `;
            
            insert+= `nome='${pessoa.nome}',`;
            insert+= `email='${pessoa.email}',`;
            if( pessoa.senha != null )
            {
                insert+= `senha='${JUtil.hashString( pessoa.senha, JUtil.SHA256 )}',`;
            }
            insert+=`telefone='${pessoa.telefone}',`;
            insert+=`sys_auth=${pessoa.sys_auth} `;
            insert+= ` where id=${pessoa.id}`;
        }
        else
        {
            insert = `INSERT INTO 
            pm_pessoa 
            ( 
                nome, 
                email, 
                senha, 
                telefone, 
                sys_auth 
            ) 
            values 
            ( 
                '${pessoa.nome}', 
                '${pessoa.email}',
                '${ JUtil.hashString( pessoa.senha, JUtil.SHA256 ) }',
                '${pessoa.telefone}',
                ${pessoa.sys_auth}
            )`;
        }

        return await super
                    .query( insert )
                    .then
                    (
                        ( res )=>
                        {
                            return true;
                        }
                    );
    }

    async getAll()
    {
        let getAll = 'Select * from pm_pessoa order by id asc;';

        return await super
                    .query( 'Select * from pm_pessoa order by id asc;' )
                    .then
                    ( 
                        ( res )=>
                        {
                            let array_pessoa = new Array();
                            if( res.length != 0 )
                            {
                                res.forEach
                                (
                                    element => 
                                    {
                                        array_pessoa.push( new Pessoa( element.id, element.nome, element.email, element.senha, element.telefone, element.sys_auth  )  );
                                    }
                                );
                            }
                            return array_pessoa
                        } 
                    );
    }

    async get( id:Number )
    {
        let query = `Select * from pm_pessoa where id = ${id}`;
        
        return await super
                    .query( query )
                    .then
                    ( 
                        ( res )=>
                        { 
                            let pessoa;

                            res.forEach(element =>
                            {
                                pessoa = new Pessoa( element.id, element.nome, element.email, element.senha, element.telefone, element.sys_auth );        
                            });

                            return pessoa; 
                        } 
                    );
    }

    async delete( id:Number )
    {
        let delete_query = `DELETE FROM pm_pessoa where id=${id}`;

        return await super
                    .query( delete_query )
                    .then
                    ( 
                        ()=> 
                        { 
                            return true; 
                        } 
                    );
    }

    async onLogin( parameter:any )
    {
        var query = `select * from pm_pessoa where email= '${parameter.email}' and senha = '${JUtil.hashString( parameter.senha, JUtil.SHA256 )}'`;
        return await super.query(  query ).then( ( res )=> {  return res.length != 0 } );
    }
}

export { PessoaTransaction };