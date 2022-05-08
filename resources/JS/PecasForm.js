const electron = require('electron');
const { ipcRenderer } = electron;
const form = document.getElementById( 'peca_form' );
$( document ).ready( function()
{
    ipcRenderer.send( 'on:load:marcas' );

    Array.from( form.getElementsByClassName( 'input' )  ).forEach
	( 
		el =>
		{
			$( `#${el.id}_help` ).hide();
		}
	);

    Array.from( form.getElementsByTagName( 'select' )  ).forEach
	( 
		el =>
		{
			$( `#${el.id}_help` ).hide();
		}
	);

    $( '#peca_valor_revenda' ).val( '0,00' );
    $( '#peca_valor_compra' ).val( '0,00' );

    $( '#peca_valor_revenda' )
    .keyup
    ( 
        function()
        {
            $( this ).val( formatAmount( $( this ).val() ) );
        }
    );

    $( '#peca_valor_compra' )
    .keyup
    ( 
        function()
        {
            $( this ).val( formatAmount( $( this ).val() ) );
        }
    );

    $('#submit').click
	(
        ( e )=>
        {
            e.preventDefault();
            
            var validation = validate
                            ( 
                                {
                                    input_decimal : [ document.getElementById( 'peca_valor_revenda' ),  document.getElementById( 'peca_valor_compra' )  ],
                                    input_name    : document.getElementById( 'peca_nome' ),
                                    input_combo   : document.getElementById( 'marcas' )
                                } 
                            );
            if( validation )
            {
                $( '#peca_form' ).submit();
            }

        }
    );
    
    $('#peca_form').on( 'submit', ( e )=>
    {
        const peca = 
        {
            nome            : $( '#peca_nome' ).val(),
            marca           : $( '#marcas' ).val(),
            descricao       : (isEmpty( $( '#peca_descricao' ).val()) ?  null : $( '#peca_descricao' ).val()) ,
            valor_compra    : $( '#peca_valor_compra' ).val(),
            valor_revenda   : $( '#peca_valor_revenda' ).val()

        }

        ipcRenderer.send('pecas:add', peca );
    } );
    
});

ipcRenderer.on( 'load:comboMarcas', ( err, res  )=>
{
    res.forEach
	(
		element => 
		{
			var option = document.createElement( 'option' );
			$( option ).attr( 'value', element.id );
			option.innerText = element.nome;
			$('#marcas' ).append( option );	
		}
	);
} );

ipcRenderer.on( 'peca:saved', ( err, res )=>
{
    if( res )
	{
		bulmaToast.toast({ message: 'Registro salvo com sucesso', type: 'is-success', duration: 4000, closeOnClick: true, offsetTop: 15 });
		setTimeout( location.assign( 'PecasList.html' ), 4500 );
	}
	else
	{
		bulmaToast.toast({ message: 'Ocorreu um erro, favor entrar em contato com o suporte.', type: 'is-danger', duration: 3500, closeOnClick: true, offsetTop: 15 });
		main_form.reset();
	}
} );