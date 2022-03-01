const electron = require('electron');
const { app, BrowserWindow , ipcMain } = electron ;
const ContatoController = require('./controller/ContatoController.js');
const contatoController = new ContatoController();


app.whenReady().then
(
	() => 
	{
		const win = new BrowserWindow
		(
			{
				width: 800,
				height : 800,
				webPreferences : 
				{
					nodeIntegration: true,
					contextIsolation : false
				}
				
			}
		);

		win.loadFile( 'src/view/index.html' );
	}
)

//Go to contatoController
ipcMain.on( 'contato:save', ( e, item ) => 
{
	try
	{
		contatoController.save( item );
	}
	catch( erro )
	{
		console.log( erro );
	}	
} );