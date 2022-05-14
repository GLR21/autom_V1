//General use for all views.

$( '#logout' ).on( 'click', ()=>
{
	location.assign( 'auth/LoginForm.html' );
} );