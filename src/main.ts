import * as electron from 'electron';
import * as remoteMain from '@electron/remote/main';
const { app, BrowserWindow , ipcMain } = electron ;
import { JUtil  } from "./util/JUtil";
import 'dotenv/config'
import { Pessoa } from "./objects/Pessoa";
import { PessoaTransaction } from "./model/PessoaTransaction";
import { TipoPerfilTransaction } from "./model/TipoPerfilTransaction";
import { MarcasTransaction } from "./model/MarcasTransaction";
import { PecasTransaction } from "./model/PecasTransaction";
import { Pecas } from "./objects/Pecas";
import { PessoaFisica } from "./objects/PessoaFisica";
import { PessoaJuridica } from "./objects/PessoaJuridica";
import { PecasPedidos } from "./objects/PecasPedidos";
import { PedidosTransaction } from "./model/PedidosTransaction";
import { Pedidos } from "./objects/Pedidos";
import { dialog } from 'electron';
import { ReportsController } from './reports/ReportsController';
const util = JUtil;



let win;
let transaction;

async function createWindow()
{
	var splash = new electron.BrowserWindow
	(
		{
			// width: 800,
			// height:500,
			transparent: true,
			frame: false,
			alwaysOnTop: true
		}
	)
		
	splash.loadFile( "src/view/auth/splash.html");
	splash.center();
	setTimeout
	( 
		function()
		{
			remoteMain.initialize();
			win = new electron.BrowserWindow
			(
				{
					webPreferences : 
					{
						plugins:true,
						nodeIntegration: true,
						contextIsolation : false,
						webSecurity: false 
						
					}
						
				}
			);
				
			remoteMain.enable( win.webContents  );
			win.loadFile( "src/view/auth/LoginForm.html");
			win.center();
			win.show();
			win.maximize();	

			splash.close();

		}
	, 5000 );
}

async function build()
{
	return performance.now() * 20;
}

app.whenReady().then
(
	async ()=>
	{
		await createWindow();
	}
)

ipcMain.on( 'open:dir', async( event,arg )=>
{
	const result = await dialog.showOpenDialog( win, 
	{
		properties: ['openDirectory','createDirectory','treatPackageAsDirectory','promptToCreate']
	} );

	win.webContents.send( 'open:dir:select', { target:arg.target, path:result } );

} );

ipcMain.on( 'pessoa:add', async( e:any, item:any ) => 
{

	var pessoa;

	var tipo_pessoa = item.tipo_pessoa == 'true' ? 1 : 0;
	
	if( item.tipo_pessoa == 'true' )
	{

		pessoa = new PessoaJuridica
								(
									item.id, 
									item.nome,
									item.email,
									item.senha,
									item.telefone,
									item.sys_auth,
									item.cep,
									item.rua,
									item.bairro,
									item.numero_endereco,
									item.cidade,
									item.estado,
									tipo_pessoa,
									item.nome_fantasia,
									item.cnpj,
									item.data_registro
								);
	}
	else
	{
		pessoa = new PessoaFisica
								(	
									item.id, 
									item.nome,
									item.email,
									item.senha,
									item.telefone,
									item.sys_auth,
									item.cep,
									item.rua,
									item.bairro,
									item.numero_endereco,
									item.cidade,
									item.estado,
									tipo_pessoa,
									item.cpf,
									item.rg,
									item.data_nascimento
								);	
	}

	transaction = new PessoaTransaction();
	await transaction.store( pessoa ).then( ( res )=>
	{
		win.webContents.send( 'pessoa:add:success', res );
	} );
} );


ipcMain.on( 'load:lista:pessoas', async() =>
{
	transaction = new PessoaTransaction();
	await transaction.getAll().then( ( res )=>
	{
		win.webContents.send( 'load:lista:pessoas:success', res );
	} );

} );

ipcMain.on( 'edit:list:pessoas', async( err, res )=>
{
	transaction = new PessoaTransaction();
	await transaction.get( res ).then( ( res )=>
	{
		win.webContents.send( 'edit:pessoa', res );
	} );
} );


ipcMain.on( 'lista:pessoa:delete', async( err ,item )=>
{	
	transaction = new PessoaTransaction();
	
	await transaction.delete( item ).then
	(
		( res )=>
		{
			win.webContents.send( 'lista:pessoa:delete:response', res );
		}
	);
} );

ipcMain.on( 'load:tipos:lista', async( err, item )=>
{
	transaction = new TipoPerfilTransaction();
	await transaction.getAll().
	then
	(
		( res )=>
		{
			win.webContents.send( 'load:comboTipos', res );
		}
	);
} );

ipcMain.on(  'on:load:marcas', async( err, item )=>
{
	transaction = new MarcasTransaction();
	await transaction.getAll().
	then
	(
		( item )=>
		{
			win.webContents.send( 'load:comboMarcas', item );
		}
	);

} );

ipcMain.on
( 
	'pecas:add', 
	async( err, item )=>
	{
		transaction = new PecasTransaction();
		await transaction.store
						  ( 
								new Pecas
								( 
									item.id,
									item.nome,
									item.marca,
									item.descricao,
									item.valor_compra,
									item.valor_revenda
								) 
						  )
						  .then
						  ( 
							( res )=>
							{
								win.webContents.send( 'peca:saved', res );
							} 
						  );
	} 
);

ipcMain.on
( 
	'load:lista:pecas', 
	async( err, item )=>
	{
		transaction = new PecasTransaction();
		await transaction.getAll().then( ( res )=>
		{
			win.webContents.send( 'load:lista:pecas:success', res );
		} );
	} 
);

ipcMain.on
( 
	'edit:list:pecas', 
	async( err, item )=>
	{
		transaction = new PecasTransaction();
		await transaction.get( new Pecas( item.peca_id, null, item.marca_id, null, null,null  ) ).then
		(
			( res )=>
			{
				win.webContents.send( "edit:peca", res );
			}
		);
	}
);

ipcMain.on
(
	'lista:peca:delete',
	async( err, item )=>
	{
		transaction = new PecasTransaction();
		await transaction.delete( item ).then
		(
			( res )=>
			{
				win.webContents.send( 'lista:pecas:delete:response', res );
			}
		);
	}
);

ipcMain.on
(  
	'on:login',
	async( err, item )=>
	{
		transaction = new PessoaTransaction();
		await transaction.onLogin( item ).then( ( res )=>{ win.webContents.send( 'login:attempt', res ) }  );
	}
);

ipcMain.on
( 
	'query:peca:pedido',
	async( err, item )=>
	{
		transaction = new PecasTransaction();
		await transaction.query( `Select valor_revenda from ${ PecasTransaction.TABLE_NAME } where id = ${ item } ` )
		.then
		(
			( res )=>
			{
				win.webContents.send( 'query:peca:pedido:success', res.rows[0].valor_revenda );
			}
		);
	}
)

ipcMain.on
(
	'save:pedido',
	async( err, item )=>
	{
		var pecas = Array<PecasPedidos>();

		item.pecas.forEach
		(
			peca => 
			{
				pecas.push( new PecasPedidos( peca.ref_peca, peca.quantidade) );
			}
		);

		transaction = new PedidosTransaction();
		await transaction.store( new Pedidos( null, item.ref_pessoa, item.total, pecas ) )
		.then
		(
			( res )=>
			{
				win.webContents.send( 'save:pedido:success', res );
			}	 
		);
		
	}
);

ipcMain.on
(
	'gerar:relatorio:pecas',
	async ( err, item )=>
	{
		let result = await ReportsController.generateReport( ReportsController.RELATORIO_PECAS, item.path );
		win.webContents.send( 'gerar:relatorio:pecas:response', result );
	}
);

ipcMain.on
( 
	'gerar:relatorio:pedidos',
	async( err, item )=>
	{
		let result = await ReportsController.generateReport( ReportsController.RELATORIO_PEDIDOS , item);
		win.webContents.send( 'gerar:relatorio:pedidos:response', result );
	}
)

ipcMain.on
(
	'gerar:relatorio:pedidos:clientes',
	async( err, item )=>
	{
		item.ref_pessoa = item.ref_pessoa > 0 ? item.ref_pessoa : undefined;
		let result = await ReportsController.generateReport( ReportsController.RELATORIO_PEDIDOS , item);
		win.webContents.send( 'gerar:relatorio:pedidos:clientes:response', result );
	}
)