const electron = require('electron');
const { app, BrowserWindow , ipcMain } = electron ;
import { JUtil  } from "./util/JUtil";
import 'dotenv/config'
import { PessoaFisica } from "./objects/PessoaFisica";
import { PessoaFisicaTransaction } from "./model/PessoaFisicaTransaction";
import { TipoPerfilTransaction } from "./model/TipoPerfilTransaction";
import { MarcasTransaction } from "./model/MarcasTransaction";
import { PecasTransaction } from "./model/PecasTransaction";
import { Pecas } from "./objects/Pecas";
const util = JUtil;

let win;
let transaction;

app.whenReady().then
(
	() => 
	{
		win = new BrowserWindow
		(
			{
				webPreferences : 
				{
					nodeIntegration: true,
					contextIsolation : false
				}
				
			}
		);
		// win.loadFile( "src/view/PessoaForm.html");
		win.loadFile( "src/view/PecasList.html");
		win.maximize();
	}
)

ipcMain.on( 'pessoa:add', async( e:any, item:any ) => 
{
	const pessoa = new PessoaFisica(	item.id, 
										item.nome,
										item.email,
										item.senha,
										item.telefone,
										item.sys_auth
									);
									
	transaction = new PessoaFisicaTransaction();
	await transaction.store( pessoa ).then( ( res )=>
	{
		win.webContents.send( 'pessoa:add:success', res );
	} );
} );


ipcMain.on( 'load:lista:pessoas', async() =>
{
	transaction = new PessoaFisicaTransaction();
	await transaction.getAll().then( ( res )=>
	{
		win.webContents.send( 'load:lista:pessoas:success', res );
	} );

} );

ipcMain.on( 'edit:list:pessoas', async( err, res )=>
{
	transaction = new PessoaFisicaTransaction();
	await transaction.get( res ).then( ( res )=>
	{
		win.webContents.send( 'edit:pessoa', res );
	} );
} );


ipcMain.on( 'lista:pessoa:delete', async( err ,item )=>
{	
	transaction = new PessoaFisicaTransaction();
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

