const electron = require('electron');
const { ipcRenderer } = electron;
const main_form  = document.getElementById( 'pessoa_form' );
const name       = document.getElementById( 'pessoa_nome' );
const email      = document.getElementById( 'pessoa_email' );
const phone      = document.getElementById( 'pessoa_telefone' );
const password   = document.getElementById( 'pessoa_senha' );
const tooglePassword = document.getElementById('togglePassword');
const queryVariables = new URLSearchParams(window.location.search);

$( document ).ready( function()
{
	$( '#pessoa_id_field' ).hide();
	//Loads flag number input
	const iti = window.intlTelInput(phone, 
	{
		utilsScript: "../../node_modules/intl-tel-input/build/js/utils.js",
		separateDialCode : true,
		autoPlaceholder: "polite",
		formatOnDisplay : true, 
		nationalMode: true,
		preferredCountries : ["br", "pt" ,"us"],
		responsiveDropdown : true
	});

	//Add listener to eye icon to change password view
	tooglePassword.addEventListener( 'click',  function()
	{
		const type = password.getAttribute('type') === "password" ? "text" : "password";
		password.setAttribute( "type", type );
		this.classList.toggle( 'bi-eye' );
	}  );

	//Filter only numbers in number input
	setInputFilter(phone, function(value)
	{
		return /^-?\d*$/.test(value); 
	});

	//Hide help elements
	Array.from( main_form.getElementsByTagName( 'input' ) ).forEach
	( 
		el =>
		{
			$( `#${el.id}_help` ).hide();
		}
	);

	$('#submit').click
	(
		( e )=>
		{
			e.preventDefault();

			//If false, enable password validation. If true, then thas a edition and the user can save or not another password.
			var validate_save_pass = isPasswordEdition();
			
			var array_validation = 
			{
				input_name  :   name,
				input_email :   email,
				input_phone :   phone,
				input_password: password
			};

			if( validate_save_pass )
			{
				delete array_validation.input_password;
			}

			if( validate( array_validation, iti ) )
			{
				$(main_form).submit();
			}	
		}
	);

	$(main_form).on( 'submit', (e)=>
	{
		const pessoa = 
		{
			id  : $( '#pessoa_id' ).val() != '' ? $( '#pessoa_id' ).val(): null,
			nome:$( name ).val(),
			email:$( email ).val(),
			senha:$( password ).val(),
			telefone:iti.getNumber(),
			sys_auth: ( $('#admin_options' ).val() != 0 ? $('#admin_options' ).val() : 2)
		}

		if( isPasswordEdition() )
		{
			pessoa.senha = null;
		}
		
		ipcRenderer.send('pessoa:add',pessoa);
	} );

	// $("#is_admin").change
	// (
	// 	function()
	// 	{
	// 		if( this.checked )
	// 		{
	// 			$(this).attr( 'value', 'true' );
	// 		}
	// 		else
	// 		{
	// 			$(this).attr( 'value', 'false' );
	// 		}
	// 	} 
	// );
	
	if(queryVariables.get('pessoa_id'))
	{
		ipcRenderer.send( 'edit:list:pessoas', queryVariables.get('pessoa_id')  );
	}

	ipcRenderer.send( 'load:tipos:lista' );

} );
	
ipcRenderer.on( 'pessoa:add:success', ( err, item )=>
{
	if( item )
	{
		bulmaToast.toast({ message: 'Registro salvo com sucesso', type: 'is-success', duration: 4000, closeOnClick: true, offsetTop: 15 });
		setTimeout( location.assign( 'PessoaList.html' ), 4500 );
	}
	else
	{
		bulmaToast.toast({ message: 'Ocorreu um erro, favor entrar em contato com o suporte.', type: 'is-danger', duration: 3500, closeOnClick: true, offsetTop: 15 });
		main_form.reset();
	}
} );

ipcRenderer.on( 'edit:pessoa', ( err, res )=>
{
	$( '#pessoa_id' ).val( res.id );
	$( '#pessoa_nome' ).val( res.nome );
	$( '#pessoa_email' ).val( res.email );
	$( '#pessoa_telefone' ).val( res.telefone );
	$('#admin_options').val( res.sys_auth );
	$( '#pessoa_id_field' ).show();
} );

ipcRenderer.on( 'load:comboTipos', ( err, res )=>
{
	res.forEach
	(
		element => 
		{
			var option = document.createElement( 'option' );
			$( option ).attr( 'value', element.id );
			option.innerText = element.descricao;
			$('#admin_options' ).append( option );	
		}
	);
} );

function isPasswordEdition()
{
	return $( '#pessoa_id' ).val() != '' && $('#pessoa_senha').val() == '';
}