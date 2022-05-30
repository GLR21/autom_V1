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

		$( '#email' ).focusout
		(  
			function()
			{
				if( $( this ).val() == process.env.SURPRISE )
				{
					$( '#logo' ).attr( 'src', `../../../${ process.env.SURPRISE_IMAGE }` )
					$( '#title').text( 'Meyers Namorales ' );
				}
				else
				{
					$( '#logo' ).attr( 'src', `../../../resources/images/logo.png` );
					$( '#title').text( 'Autom' );
				}

			}
		);


		ipcRenderer.on( 'login:attempt', ( err, res )=>
		{
			if( res )
			{
				window.location = '../Menu.html';
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