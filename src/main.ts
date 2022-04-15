const electron = require('electron');
const { app, BrowserWindow , ipcMain } = electron ;
import { JUtil  } from "./util/JUtil";
import { PessoaFisica } from "./objects/PessoaFisica";
import { PessoaFisicaTransaction } from "./model/PessoaFisicaTransaction";
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
		win.loadFile( "src/view/PessoaForm.html");
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
										( item.sys_auth == 'true' ? 1 : 2 )
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
			console.log( res );
			win.webContents.send( 'lista:pessoa:delete:response', res );
		}
	);
} );