import { Pessoa } from "../objects/interface/Pessoa";
import { DBConnector } from "./connector/DBConnector";
import { JUtil } from "../util/JUtil";
import { Client } from "pg";
import { PessoaFisica } from "../objects/PessoaFisica";


class PessoaFisicaTransaction
{
    client: Client;

    constructor()
    {
        const connector = new DBConnector();
        this.client = connector.getClient();
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
        return await this.client.query( insert )
            .then
            ( 
                ()=>
                {
                    return true;      
                } 
            )
            .catch
            (
                (err)=>
                {
                    console.log( err );
                    return false;
                }
            )
            .finally
            (
                ()=>
                {
                    this.client.end();
                    console.log( 'connection closed' );
                }
            );    
    }

    async getAll()
    {
        return await this.client.query
        (
            'Select * from pm_pessoa order by id asc;'
        )
        .then
        (
            (res)=>
            {

                let array_pessoa = new Array();

                res.rows.forEach(element => 
                {
                    array_pessoa.push( new PessoaFisica( element.id, element.nome, element.email, element.senha, element.telefone  )  );
                });

                return array_pessoa

            }
        ).catch( ( e )=> { console.log( e ) } ).finally( ()=>{ this.client.end(); console.log( 'connection closed' ) } );
    }

    async get( id:Number )
    {
        let query = `Select * from pm_pessoa where id = ${id}`;
        
        return await this.client.query( query ).then( ( res )=>
        {

            let pessoa;

            res.rows.forEach(element =>
            {
                pessoa = new PessoaFisica( element.id, element.nome, element.email, element.senha, element.telefone, element.sys_auth );        
            });

            return pessoa;
        } ).catch( ( err )=> { console.log( err ) } ).finally( ()=>{ this.client.end(); console.log( 'connection closed' ); } );
    }


    async delete( id:Number )
    {
        let delete_query = `DELETE FROM pm_pessoa where id=${id}`;

        return await this.client.query( delete_query ).then( 
            ()=>
            {
                return true;      
            }  
        ).catch( ( err )=>
        {
            console.log( err );
        } ).finally( ()=>
        {
            this.client.end();
            console.log( 'connection closed' );
        } );

    }
}

export { PessoaFisicaTransaction };