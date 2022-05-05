const electron = require('electron');
const { ipcRenderer } = electron;

$( document ).ready( function()
{
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
            validate( {  input_decimal: document.getElementById( 'peca_valor_revenda' ), input_decimal: document.getElementById( 'peca_valor_compra' )  } );
        }
    );


});