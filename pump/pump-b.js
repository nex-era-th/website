// pump-b.js
// some codes using in browser side
// every func will reside in the object pumpb


const pumpb = {}

// fetchThis ----------------------------------------------------

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


// getMoneyFormat -------------------------------------------

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



// getSumOf ------------------------------------------------------
/*
    let output = getSumOf( ARRAY, ['fieldName1, 'field2', ... ])
    output like { field1: --,field2: --, ... }

*/

pumpb.getSumOf = (documents, fieldNames) => {
    // 1. Initialize the result object with keys set to 0
    const initialAccumulator = {};
    
    // Ensure fieldNames is an array before proceeding
    if (!Array.isArray(fieldNames) || fieldNames.length === 0) {
        console.warn("Field names array is invalid or empty. Returning empty object.");
        return {};
    }

    fieldNames.forEach(field => {
        initialAccumulator[field] = 0;
    });

    // 2. Use reduce() to iterate over the documents and accumulate for ALL fields
    const totalSums = documents.reduce((accumulator, currentDoc) => {
        
        // Inner loop iterates over the provided fieldNames array
        fieldNames.forEach(fieldName => {
            const fieldValue = currentDoc[fieldName];

            // --- Robust Cleaning and Conversion Logic ---
            let numericValue = 0;

            if (typeof fieldValue === 'string') {
                // Clean and convert string (removes symbols/commas for clean parsing)
                const cleanedValue = fieldValue.replace(/[,$,]/g, '');
                numericValue = parseFloat(cleanedValue);
            } else if (typeof fieldValue === 'number') {
                // Already a number, use directly
                numericValue = fieldValue;
            }

            // Add to the accumulator only if the result is a valid number
            if (!isNaN(numericValue)) {
                accumulator[fieldName] += numericValue;
            }
        });
        
        return accumulator;

    }, initialAccumulator);

    return totalSums;
}