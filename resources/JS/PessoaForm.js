const electron = require('electron');
const { ipcRenderer } = electron;
const main_form       = document.getElementById( 'pessoa_form' );
const name            = document.getElementById( 'pessoa_nome' );
const email           = document.getElementById( 'pessoa_email' );
const phone           = document.getElementById( 'pessoa_telefone' );
const password   	  = document.getElementById( 'pessoa_senha' );
const data_nascimento = document.getElementById( 'pessoa_data_nascimento' );
const cep             = document.getElementById( 'pessoa_cep' );
const rua             = document.getElementById( 'pessoa_rua' );
const bairro          = document.getElementById( 'pessoa_bairro' );
const numero_endereco = document.getElementById( 'pessoa_numero_endereco' );
const cidade          = document.getElementById( 'pessoa_cidade' );
const estado          = document.getElementById( 'pessoa_estado' );
const cpf			  = document.getElementById( 'pessoa_cpf' );
const rg			  = document.getElementById( 'pessoa_rg' );	
const cnpj            = document.getElementById( 'pessoa_cnpj' );
const nome_social     = document.getElementById( 'pessoa_nome_fantasia' );

const tooglePassword  = document.getElementById('togglePassword');
const queryVariables  = new URLSearchParams(window.location.search);

$( document ).ready( function()
{
	$( '#pessoa_id_field' ).hide();
	$( '#pessoa_cnpj' ).hide();
	$( '#pessoa_nome_fantasia' ).hide();
	$( '#tipo_pessoa' ).val( 'false' );
	
	$( '#pessoa_data_nascimento' ).datepicker(
		{
			dateFormat: 'dd/mm/yy',
			changeMonth: true,
     		changeYear: true,
			yearRange: `1930:${ new Date().getFullYear().toString() }`,
			beforeShow: 
			function()
			{
        		setTimeout
				(
					function()
					{
            			$('.ui-datepicker').css('z-index', 99999999999999);
        			}, 0
				);	
			}
		});

	$('.ui-datepicker').css('z-index', 99999999999999);
	//Carrega toda a combo
	ipcRenderer.send( 'load:tipos:lista' );
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
				input_name  :   [data_nascimento, name, cep, rua, bairro, cidade, estado, numero_endereco],
				input_email :   email,
				input_phone :   phone,
				input_password: password
			};


			if( $('#tipo_pessoa').val() == 'true' )
			{
				array_validation.input_name.push( cnpj );
				array_validation.input_name.push( nome_social );
			}
			else
			{
				array_validation.input_cpf = cpf;
				array_validation.input_name.push( rg );
			}

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
			id  			: $( '#pessoa_id' ).val() != '' ? $( '#pessoa_id' ).val(): null,
			nome			:$( name ).val(),
			email			:$( email ).val(),
			senha			: $( password ).val(),
			telefone		:iti.getNumber(),
			cep				: $( '#pessoa_cep' ).val(),
			rua				: $( '#pessoa_rua' ).val(),
			bairro			: $( '#pessoa_bairro' ).val(),
			numero_endereco	: $( '#pessoa_numero_endereco' ).val(),
			cidade			: $( '#pessoa_cidade' ).val(),
			estado			: $( '#pessoa_estado' ).val(),
			sys_auth		: ( $('#admin_options' ).val() != 0 ? $('#admin_options' ).val() : 2),
			tipo_pessoa		: $( '#tipo_pessoa' ).val()

		}

		if( isPasswordEdition() )
		{
			pessoa.senha = null;
		}
	
		if( $( '#tipo_pessoa' ).val() == 'true' )
		{
			pessoa.nome_fantasia = $( '#pessoa_nome_fantasia' ).val();
			pessoa.cnpj          = $( '#pessoa_cnpj' ).val();	
			pessoa.data_registro = formatDate( $( '#pessoa_data_nascimento' ).val() , 'en' );		
		}
		else
		{
			pessoa.cpf             = $( '#pessoa_cpf' ).val();
			pessoa.rg              = $( '#pessoa_rg' ).val();
			pessoa.data_nascimento = formatDate( $( '#pessoa_data_nascimento' ).val() , 'en' );
		}

		ipcRenderer.send('pessoa:add',pessoa);
	} );

	$("#tipo_pessoa").change
	(
		function()
		{
			if( this.checked )
			{
				$( '#pessoa_cpf' ).hide();
				$( '#pessoa_rg' ).hide();
				$( '#pessoa_cnpj' ).show();
				$( '#pessoa_nome_fantasia' ).show();
				$( '#pessoa_nome' ).attr( 'placeholder', 'Razão social' );
				$( '#pessoa_data_nascimento' ).attr( 'placeholder', 'Data de registro' );
				$( this ).val( true );
			}
			else
			{
				$( '#pessoa_cpf' ).show();
				$( '#pessoa_rg' ).show();
				$( '#pessoa_nome' ).attr( 'placeholder', 'Nome' );
				$( '#pessoa_data_nascimento' ).attr( 'placeholder', 'Data de nascimento' );
				$( '#pessoa_cnpj' ).hide();
				$( '#pessoa_nome_fantasia' ).hide();
				$( this ).val( false );
			}
		} 
	);
	
	if(queryVariables.get('pessoa_id'))
	{
		ipcRenderer.send( 'edit:list:pessoas', queryVariables.get('pessoa_id')  );
	}

	//Define o valor, se houver
	ipcRenderer.on( 'edit:pessoa', ( err, res )=>
	{
		$( '#pessoa_id' ).val( res.id );
		$( '#pessoa_nome' ).val( res.nome );
		$( '#pessoa_email' ).val( res.email );
		$( '#pessoa_telefone' ).val( res.telefone );
		$( '#pessoa_cep' ).val( res.cep );
		$( '#pessoa_rua' ).val( res.rua );
		$( '#pessoa_bairro' ).val( res.bairro );
		$( '#pessoa_numero_endereco' ).val( res.numero_endereco );
		$( '#pessoa_cidade' ).val( res.cidade );
		$( '#pessoa_estado' ).val( res.estado );

		if( res.tipo_pessoa == 1 )
		{
			$( '#pessoa_cpf' ).hide();
			$( '#pessoa_rg' ).hide();
			$( '#pessoa_nome_fantasia' ).val( res.nome_fantasia );
			$( '#pessoa_cnpj' ).val( res.cnpj );
			$( '#pessoa_cnpj' ).show();			
			$( '#pessoa_nome_fantasia' ).show();
			$( '#pessoa_nome' ).attr( 'placeholder', 'Razão social' );
			$( '#tipo_pessoa' ).val( 'true' );
			$( '#tipo_pessoa' ).prop( 'checked', true )
			$( '#pessoa_data_nascimento' ).datepicker( 'setDate', res.data_registro  );
			$( '#pessoa_data_nascimento' ).attr( 'placeholder', 'Data de registro' );
			
		}
		else
		{
			$( '#pessoa_cpf' ).val( res.cpf );
			$( '#pessoa_rg' ).val(  res.rg );
			$( '#pessoa_data_nascimento' ).datepicker( 'setDate', res.data_nascimento  );
			$( '#pessoa_data_nascimento' ).attr( 'placeholder', 'Data de nascimento' );
		}
		
		$('#admin_options').val( res.sys_auth );
		$( '#pessoa_id_field' ).show();
	} );

	$( '#pessoa_cep' ).focusout
	(
		function( )
		{
			$.ajax
			(
				{
					url: 'https://viacep.com.br/ws/'+$(this).val().replace( '-','' )+'/json/',
					dataType: "json",
					success: function (response)
					{
						$( '#pessoa_cep' ).removeClass( 'is-danger' );
						$( '#pessoa_cep_help' ).removeClass( 'is-danger' );
						$( '#pessoa_cep_help' ).hide();
						$( '#pessoa_cep' ).val( response.cep )
						$( '#pessoa_rua' ).val( response.logradouro )
						$( '#pessoa_bairro' ).val( response.bairro );
						$( '#pessoa_cidade' ).val( response.localidade );
						$( '#pessoa_estado' ).val( response.uf );
					},
					error: function( response )
					{
						$( '#pessoa_cep' ).addClass( 'is-danger' );
						$( '#pessoa_cep_help' ).addClass( 'is-danger' );
						$( '#pessoa_cep_help' ).show();

					}
				}
			)
		}
	)
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

function isPasswordEdition()
{
	return $( '#pessoa_id' ).val() != '' && $('#pessoa_senha').val() == '';
}