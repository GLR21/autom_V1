const electron = require('electron');
const { app, BrowserWindow , ipcMain } = electron ;
const ContatoController = require('./controller/ContatoController.js');
const util = require('./util/JUtil.js');
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
		

		replaces = 
		[
			{
				"key"   : "{libs}",
				"value" : util.getFileContents( 'src/view/libs/lib.html' )
			},
			{
				"key"   : "{save_contacts}",
				"value" : util.getFileContents( 'src/view/libs/save_contacts.html' )
			}
		];
		
		win.loadFile( util.writeFile( "src/view/tmp/index_tmp.html" , util.replaceContents( util.getFileContents( 'src/view/index.html' ), replaces ))   );
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