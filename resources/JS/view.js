function cpfChange(cpfValue, id)
{
    var numeric = cpfValue.replace(/[^0-9]+/g, '');
    var cpfLength = numeric.length;

    var partOne = numeric.slice(0, 3) + ".";
    var partTwo = numeric.slice(3, 6) + ".";
    var partThree = numeric.slice(6, 9) + "-";

    var cpfInput = document.getElementById(`${id}`); // here is the CPF ID of the input

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

function cnpjChange(cpfValue, id)
{
    var numeric = cpfValue.replace(/[^0-9]+/g, '');
    var cpfLength = numeric.length;
    
    var partOne   = numeric.slice( 0 ,2 ) + ".";
    var partTwo   = numeric.slice( 2 ,5 ) + ".";
    var partThree = numeric.slice( 5 ,8 ) + "/";
    var partFour  = numeric.slice( 8 ,12) + "-";
    var partFive  = numeric.slice( 16,18);
    

    var cpfInput = document.getElementById(`${id}`); // here is the CPF ID of the input

    var arr = 
    [  
        cpfLength < 3,
        cpfLength >= 3 && cpfLength < 5,
        cpfLength >= 5 && cpfLength < 8,
        cpfLength >= 8 && cpfLength < 12,
        cpfLength == 12,
        cpfLength >= 14,
    ]; 

    var index = arr.indexOf( true );
    
    switch (index)
    {
        case 0:
            cpfInput.value = numeric;
        break;
        
        case 1:
            var formatCPF = partOne +
                numeric.slice(2);
                cpfInput.value = formatCPF;
        break;
        
        case 2:
            var formatCPF = partOne +
            partTwo +
            numeric.slice(5);
            cpfInput.value = formatCPF;
        break;
        
        case 3:
            var formatCPF = partOne +
                    partTwo +
                    partThree +
                    numeric.slice(8);
                    cpfInput.value = formatCPF;
        break;
        
        case 4:
            var formatCPF = partOne +
            partTwo +
            partThree +
            partFour
            cpfInput.value = formatCPF;
        break;

        case 5:
            var formatCPF = partOne +
                    partTwo +
                    partThree +
                    partFour  +
                    numeric.slice( 12,14 )
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

    var fields_to_validate = new Array();

    Object.keys( json_of_inputs ).forEach
    ( 
        prop =>
        {
            
            if( Array.isArray( json_of_inputs[prop] ) )
            {
                for( var i=0; i< json_of_inputs[prop].length; i++ )
                {
                    var index = prop+`_${i}`;

                    var json = { [index]: json_of_inputs[prop][i] };

                    fields_to_validate.push(  json  );    
                }
            }
            else
            {
                fields_to_validate.push( { [prop]: json_of_inputs[prop] }  );
            }
            
        }
    );


    var test = new Array();

    fields_to_validate
    .forEach
    (
        element => 
        {

            var key = Object.keys(element).toString().replace( /([_\d])/g, '' ).replace( 'input', '' );
            
            if( keyIsUndefined( key, test ) )
            {
                test[key] = [];
            }

            test[key].push( element );
            
        }
    );

    Object.keys( test ).forEach
    ( 
        el =>
        {
           switch( el )
            {
                case 'name':

                    test[el]
                    .forEach
                    (
                        element => 
                        {
                            if( keyIsUndefined( el, validatedInputs ) )
                            {
                                validatedInputs[el] = [];
                            }
                            element = element[Object.keys( element )[0]];
                            validatedInputs[el].push(  { el: element,  result:  !isEmpty( element.value ) } );        
                        }
                    );
                break;
                case 'email':
                    test[el]
                    .forEach
                    (
                        element => 
                        {
                            if( keyIsUndefined( el, validatedInputs ) )
                            {
                                validatedInputs[el] = [];
                            }

                            element = element[Object.keys( element )[0]];

                            if( !isEmpty( element.value ) )
                            {
                                validatedInputs[el].push(  { el: element,  result:  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( element.value ) } );        
                                
                            }
                            else
                            {
                                validatedInputs[el].push(  { el: element,  result: false } );        
                            }
                        }
                    );
                break;
                case 'password':
                    test[el]
                    .forEach
                    (
                        element => 
                        {
                            if( keyIsUndefined( el, validatedInputs ) )
                            {
                                validatedInputs[el] = [];
                            }

                            element = element[Object.keys( element )[0]];
                            validatedInputs[el].push(  { el: element,  result:  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test( element.value  ) } );        
                        }
                    );
                break;
                case 'phone':
                    test[el]
                    .forEach
                    (
                        element => 
                        {
                            if( keyIsUndefined( el, validatedInputs ) )
                            {
                                validatedInputs[el] = [];
                            }
                            
                            element = element[Object.keys( element )[0]];
                
                            

                            if( !isEmpty( element.value ) )
                            {
                                validatedInputs[el].push(  { el: element,  result:  additionalValidation.isValidNumber() } );        
                            }
                            else
                            {
                                validatedInputs[el].push(  { el: element,  result:  false } );        
                            }
                        }
                    );
                break;
                case 'decimal':

                    test[el]
                    .forEach
                    (
                        element => 
                        {
                            if( keyIsUndefined( el, validatedInputs ) )
                            {
                                validatedInputs[el] = [];
                            }
                            
                            element = element[Object.keys( element )[0]];
                            validatedInputs[el].push(  { el: element,  result:  !(element.value.toString().replace( /[,.]/g, '' ) == '000') } );        
                        }
                    );
                break;
                case 'combo':
                    test[el]
                    .forEach
                    (
                        element => 
                        {
                            if( keyIsUndefined( el, validatedInputs ) )
                            {
                                validatedInputs[el] = [];
                            }
                            
                            element = element[Object.keys( element )[0]];
                            validatedInputs[el].push(  { el: element,  result:  element.value != 0} );        
                        }
                    );
                break;
                case 'cpf':
                    test[el]
                    .forEach
                    (
                        element => 
                        {
                            if( keyIsUndefined( el, validatedInputs ) )
                            {
                                validatedInputs[el] = [];
                            }
                            element = element[Object.keys( element )[0]];
                            validatedInputs[el].push(  { el: element,  result:  validateCPF( element.value ) } );        
                        }
                    );
                break;
            }
        }
    )


    var validatedInputsLength = getInnerLength( validatedInputs );
    var verified_inputs = 0;
    
    for( var key in validatedInputs )
    {

        validatedInputs[key]
        .forEach
        (
            element => 
            {
                if( !element.result )
                {
                    if( key == 'combo' )
                    {
                        $( element.el.parentNode ).addClass( 'is-danger' ); 
                    }
                    else
                    {
                        $( `#${element.el.id}` ).addClass( 'is-danger' );
                    }
                    $( `#${element.el.id}_help` ).addClass( 'is-danger' );
                    $( `#${element.el.id}_help` ).show();
                    verified_inputs = verified_inputs > 0 ? verified_inputs-- : verified_inputs;
                }
                else
                {
                    if( key == 'combo' )
                    {
                        $( element.el.parentNode ).removeClass( 'is-danger' ); 
                    }
                    else
                    {
                        $( `#${element.el.id}` ).removeClass( 'is-danger' );
                    }
                    $( `#${element.el.id}_help` ).removeClass( 'is-danger' );   
                    $( `#${element.el.id}_help` ).hide();  
                    verified_inputs++;   
                }
            }
        );
    }
    return verified_inputs == validatedInputsLength;
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

function keyIsUndefined( key, array )
{
    return typeof array[key] == 'undefined';
}

function getInnerLength( array )
{
    var sum= 0;

    for( var key in array )
    {
        sum+= array[key].length;
    }
    return sum;
}

function validateCPF( cpf  )
{

    cpf = cpf.replace( /([-.])/g, '' );
    
    let i = 0;
    
    if( cpf.length < 11 )
    {
        return false
    }

    let sum_equals = 0;

    while( i <= cpf.length  )
    {
        sum_equals+= ( parseInt( cpf[0], 10  ) == parseInt( cpf[i], 10 ) ? 1 : 0 );
        ++i;
    } 

    i = 0;

    if( sum_equals == cpf.length )
    {
        return false;
    }
    
    var nine_digits = [];
    var ten_digits  = [];
    while( i <= 8 )
    {
        nine_digits.push( cpf[i] );
        ++i;
    }

    nine_digits.reverse();

    i = 0;
    let sum = 0;
    let multiplier_starter = 2;

    while( i <= 8 )
    {
        sum+= ( parseInt( nine_digits[i], 10) ) *( multiplier_starter+i );
        ++i;
    }

    var first_digit = ( ((sum*10)%11) == 10 || ((sum*10)%11) == 11 ? 0: ((sum*10)%11)  ) == parseInt( cpf[ cpf.length -2 ] , 10 );

    //primeira validacao é falsa
    if( !first_digit )
    {
        return false
    }

    i = 0;
    while( i <= 9 )
    {
        ten_digits.push( cpf[i] );
        ++i;
    }
    ten_digits.reverse();
    i = 0;
    sum = 0;
    while( i <= 9 )
    {
        sum+= parseInt( ten_digits[i], 10) *( multiplier_starter+i );
        ++i;
    }
    var second_digit = ( ((sum*10)%11) == 10 || ((sum*10)%11) == 11 ? 0: ((sum*10)%11)  ) == parseInt( cpf[ cpf.length -1 ] , 10 );    

    return second_digit === first_digit;
}

function formatDate( date_string, locale )
{
    var split = '';
    string_return = '';
    switch( locale )
    {
        case 'br':
            split = date_string.split( '-' );
            string_return = split[2]+'/'+split[1]+'/'+split[0];
        break;
        case 'en':
            split = date_string.split( '/' );
            string_return = split[2]+'-'+split[1]+'-'+split[0];
        break;
    }
   
    return string_return;
}
