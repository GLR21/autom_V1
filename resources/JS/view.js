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
                    $( `#${element.el.id}` ).addClass( 'is-danger' );
                    $( `#${element.el.id}_help` ).addClass( 'is-danger' );
                    $( `#${element.el.id}_help` ).show();
                    verified_inputs = verified_inputs > 0 ? verified_inputs-- : verified_inputs;
                }
                else
                {
                    $( `#${element.el.id}` ).removeClass( 'is-danger' );
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