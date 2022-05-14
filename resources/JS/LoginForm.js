const electron = require('electron');
const { ipcRenderer } = electron;
const form = document.getElementById( 'login_form' );

$( document ).ready
(
	()=>
	{
		$( '#login_help' ).hide();

		$( '#submit' ).click
		(
			( e )=>
			{
				e.preventDefault();
				var login = 
				{
					email: $( '#email' ).val(),
					senha: $( '#senha' ).val()
				}
				ipcRenderer.send( 'on:login', login );
			}
		);


		ipcRenderer.on( 'login:attempt', ( err, res )=>
		{
			console.log( res );
			if( res )
			{
				window.location = 'PessoaList.html';
			}
			else
			{
				form.reset();
				$( '#email' ).addClass( 'is-danger' );
				$( '#senha' ).addClass( 'is-danger' );
				$( '#login_help' ).addClass( 'is-danger' );
				$( '#login_help' ).show();
			}
		} );
	}
);