// pump-b.js
// some codes using in browser side
// every func will reside in the object pumpb


const pumpb = {}

pumpb.fetchThis = async function ( data, api, method = 'POST' ) {
  /*
      works on GET, POST only
  */ 

  method = method.toUpperCase()

  if (method.toUpperCase() == 'GET') {

    let resp = await fetch( PUMP_DOMAIN + api )
    return await resp.json()

  } else { // suppose to be POST

    let resp = await fetch( PUMP_DOMAIN + api, {
      method  : method.toUpperCase(),
      headers : {'Content-Type':'application/json'},
      body    : JSON.stringify( data )
    })

    return await resp.json()
  }

}


pumpb.getMoneyFormat = (value, reverse = false) => {
    // 1. Convert back to a pure number (reverse = true)
    if (reverse === true) {
        if (typeof value !== 'string') {
            value = String(value); 
        }

        // Remove all thousand separators (commas)
        let cleanedString = value.replace(/,/g, '');

        // Convert the cleaned string into a float/number
        const pureNumber = parseFloat(cleanedString);

        if (isNaN(pureNumber)) {
            return 0; // Return 0 if the input was not a valid number string
        }
        return pureNumber;
    } 
    
    // 2. Format to money string (reverse = false - default behavior)
    else {
        // Convert input to a number and handle invalid inputs
        const numberValue = Number(value);
        if (isNaN(numberValue)) {
            return '0.00'; 
        }

        // Use Intl.NumberFormat for robust formatting (adding comma and fixed .00)
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2, 
            useGrouping: true       
        });

        return formatter.format(numberValue);
    }
}

