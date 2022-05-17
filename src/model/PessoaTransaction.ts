import { Pessoa } from "../objects/Pessoa";
import { JUtil } from "../util/JUtil";
import { Transaction } from "./interface/Transaction";
import { PessoaFisicaTransaction } from "./PessoaFisicaTransaction";
import { PessoaJuridicaTransaction } from "./PessoaJuridicaTransaction";


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
            insert+=`sys_auth=${pessoa.sys_auth},`;
            insert+=`cep='${pessoa.cep}',`;
            insert+=`rua='${pessoa.rua}',`;
            insert+=`bairro='${pessoa.bairro}',`;
            insert+=`numero_endereco=${pessoa.numero_endereco},`;
            insert+=`cidade='${pessoa.cidade}',`;
            insert+=`estado='${pessoa.estado}',`;
            insert+=`tipo_pessoa=${pessoa.tipo_pessoa}`;
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
                sys_auth,
                cep,
                rua,
                bairro,
                numero_endereco,
                cidade,
                estado,
                tipo_pessoa 
            ) 
            values 
            ( 
                '${pessoa.nome}', 
                '${pessoa.email}',
                '${ JUtil.hashString( pessoa.senha, JUtil.SHA256 ) }',
                '${pessoa.telefone}',
                ${pessoa.sys_auth},
                '${pessoa.cep}',
                '${pessoa.rua}',
                '${pessoa.bairro}',
                ${pessoa.numero_endereco},
                '${pessoa.cidade}',
                '${pessoa.estado}',
                ${pessoa.tipo_pessoa}
            ) RETURNING id`;
        }
        
        return await super
                    .query( insert )
                    .then
                    (
                        async ( res )=>
                        {

                            var transaction;
                            var upgrade = false;
                            
                            if( pessoa.id != null )
                            {
                                upgrade = true;
                            }
                            else
                            {
                                pessoa.id = res.rows[0].id;
                            }
                            

                            if( pessoa.tipo_pessoa == 0 )
                            {
                                transaction = new PessoaFisicaTransaction();
                            }
                            else
                            {
                                transaction = new PessoaJuridicaTransaction();
                            }
                            return await transaction.store( pessoa, upgrade );
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
                            if( res.rows.length != 0 )
                            {
                                res.rows.forEach
                                (
                                    element => 
                                    {
                                        array_pessoa.push
                                        ( 
                                            new Pessoa
                                                ( 
                                                    element.id,
                                                    element.nome,
                                                    element.email,
                                                    element.senha,
                                                    element.telefone,
                                                    element.sys_auth,
                                                    element.cep, element.rua,
                                                    element.bairro,
                                                    element.numero_endereco,
                                                    element.cidade,
                                                    element.estado,
                                                    element.tipo_pessoa 
                                                )  
                                        );
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
                        async ( res )=>
                        { 
                            let pessoa;

                            res.rows.forEach(element =>
                            {
                                pessoa = new Pessoa
                                ( 
                                    element.id,
                                    element.nome,
                                    element.email,
                                    element.senha,
                                    element.telefone,
                                    element.sys_auth,
                                    element.cep, 
                                    element.rua,
                                    element.bairro,
                                    element.numero_endereco,
                                    element.cidade,
                                    element.estado,
                                    element.tipo_pessoa 
                                );        
                            });

                            var transaction;

                            if( pessoa.tipo_pessoa == 0 )
                            {
                                transaction = new PessoaFisicaTransaction();
                            }
                            else
                            {
                                transaction = new PessoaJuridicaTransaction();
                            }

                            return await transaction.get( pessoa );
                        } 
                    );
    }

    async delete( parameter:any )
    {
        let delete_query = `DELETE FROM pm_pessoa where id=${parameter.id}`;

        var transaction;

        var is_deleted = false;

        if( parameter.tipo_pessoa == 0 )
        {
            transaction = new PessoaFisicaTransaction();
        }
        else
        {
            transaction = new PessoaJuridicaTransaction();
        }

        is_deleted = await transaction.delete( parameter.id );
        
        if( is_deleted )
        {
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

        return is_deleted
    }

    async onLogin( parameter:any )
    {
        var query = `select * from pm_pessoa where email= '${parameter.email}' and senha = '${JUtil.hashString( parameter.senha, JUtil.SHA256 )}'`;
        return await super.query(  query ).then( ( res )=> {  return res.rows.length != 0 } );
    }
}

export { PessoaTransaction };