function cpfChange(cpfValue)
{
    var numeric = cpfValue.replace(/[^0-9]+/g, '');
    var cpfLength = numeric.length;

    var partOne = numeric.slice(0, 3) + ".";
    var partTwo = numeric.slice(3, 6) + ".";
    var partThree = numeric.slice(6, 9) + "-";

    var cpfInput = document.getElementById("cpf"); // here is the CPF ID of the input

    var arr = 
    [  
        cpfLength < 4,
        cpfLength >= 4 && cpfLength < 7,
        cpfLength >= 7 && cpfLength < 10,
        cpfLength >= 10 && cpfLength < 12,
        cpfLength >= 12
    ]; 

    var index = arr.indexOf( true );

    switch (index)
    {
        case 0:
            cpfInput.value = numeric;
        break;
        
        case 1:
            var formatCPF = partOne +
                numeric.slice(3);
                cpfInput.value = formatCPF;
        break;
        
        case 2:
            var formatCPF = partOne +
            partTwo +
            numeric.slice(6);
            cpfInput.value = formatCPF;
        break;
        
        case 3:
            var formatCPF = partOne +
                    partTwo +
                    partThree +
                    numeric.slice(9);
                    cpfInput.value = formatCPF;
        break;
        
        case 4:
            var formatCPF = partOne +
                    partTwo +
                    partThree +
                    numeric.slice(9, 11);
                    cpfInput.value = formatCPF;
        break;
    }
}

function setInputFilter(textbox, inputFilter) 
{
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event)
	{
		textbox.addEventListener(event, function() 
		{
			if (inputFilter(this.value)) 
			{
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} 
			else if (this.hasOwnProperty("oldValue")) 
			{
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
			else 
			{
				this.value = "";
			}
		});
	});
}

function  validateDateFormat(el, format)
{
    var numerics = el.value.replace(/[^0-9]+/g, '');
    
    if( format == 'dd/MM/yyyy' )
    {
        var part1 = numerics.slice( 0 , 2 ) + "/";
        var part2 = numerics.slice( 2 , 4 ) + "/"; 
        var part3 = numerics.slice( 4 , 8 ) + "";

        var length = numerics.length;

        var verify =
        [
            length < 3,
            length >= 3 && length < 5,
            length >= 5 && length <= 8,
            length >= 9
        ]


        switch (verify.indexOf( true ))
        {
            case 0:
                el.value = numerics;
                break;
        
            case 1:
                el.value = part1 + numerics.slice(2);
                break;

            case 2:
                el.value = part1 + part2 + numerics.slice( 4 );
                break;
            case 3: 
                el.value = part1 + part2  + part3
            break
            default:
                el.value = part1 + part2 + part3 + numerics.slice(8, 11);;
                break;
        }
    }
}

function validate( json_of_inputs, additionalValidation = null )
{

    var verified_inputs = 0;

    var validatedInputs  = [];

    Object.keys( json_of_inputs ).forEach
    ( 
        prop =>
        {
            switch( prop )
            {
                case 'input_name':
                case 'input_razao_social':
                case 'input_nome_fantasia':
                    validatedInputs[prop] = !isEmpty( json_of_inputs[prop].value );
                break;
                case 'input_email':
                    //In case the input is not empty, an regex is used to test if the email is valid. Case the field is empty, then it doens't even try the regex.
                    if( !isEmpty( json_of_inputs[prop].value ) )
                    {
                        validatedInputs[prop] =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( json_of_inputs[prop].value );
                    }
                    else
                    {
                        validatedInputs[prop] = false;
                    }
                break;
                case 'input_password':
                    validatedInputs[prop] = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test( json_of_inputs[prop].value  );
                break;
                case 'input_phone':
                    if( !isEmpty( json_of_inputs[prop].value ) )
                    {
                        validatedInputs[prop] = additionalValidation.isValidNumber();
                    }
                    else
                    {
                        validatedInputs[prop] = false;
                    }    
                break;
                case 'input_decimal':
                    validatedInputs[prop] =  $(json_of_inputs[prop]).val().toString().replace( /[,.]/g, '' ) == '000';
                break;
            }

            console.log( prop );
        }
    );
    
    for( var key in validatedInputs )
    {
        if( !validatedInputs[key] )
        {
            
            $( `#${json_of_inputs[key].id}` ).addClass( 'is-danger' );
            $( `#${json_of_inputs[key].id}_help` ).addClass( 'is-danger' );
            $( `#${json_of_inputs[key].id}_help` ).show();
            verified_inputs = verified_inputs > 0 ? verified_inputs-- : verified_inputs;
        }
        else
        {
            $( `#${json_of_inputs[key].id}` ).removeClass( 'is-danger' );
            $( `#${json_of_inputs[key].id}_help` ).removeClass( 'is-danger' );
            $( `#${json_of_inputs[key].id}_help` ).hide();
            verified_inputs++;
        }
    }
    return verified_inputs==Object.keys( json_of_inputs ).length;
}


function isEmpty( value )
{
    return value === "";
}

function formatAmountNoDecimals( number )
{
    var rgx = /(\d+)(\d{3})/;
    while( rgx.test( number ) ) 
    {
        number = number.replace( rgx, '$1' + '.' + '$2' );
    }
    return number;
}

function formatAmount( number )
{
    number = number.replace( /[^0-9]/g, '' );

    if( number.length == 0 ) number = "0.00";
    else if( number.length == 1 ) number = "0.0" + number;
    else if( number.length == 2 ) number = "0." + number;
    else number = number.substring( 0, number.length - 2 ) + '.' + number.substring( number.length - 2, number.length );

    number = new Number( number );
    number = number.toFixed( 2 );

    number = number.replace( /\./g, ',' );

    x = number.split( ',' );
    x1 = x[0];
    x2 = x.length > 1 ? ',' + x[1] : '';

    return formatAmountNoDecimals( x1 ) + x2;
}
