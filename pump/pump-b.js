/*

file: NEX-WEB/pump/pump-b.js
for: put some funcs here to help all browser codes
by: @devster
project: pump

*/


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
/*
    get output like 1,125,456.25
*/

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
} //ok


// simpleSum --------------------------------------------------
/*
    get the sum of a simple array.
    so you have all numbers in array and put into this func and get their sum.
    CAUTION: make sure all value is num
*/

pumpb.simpleSum = ( yourArray ) => {
  yourArray.reduce( (z,i) => i += z, 0)
} //ok




// simpleDate ------------------------------------------------------
/*
    get simple date format like 31/12
*/
pumpb.simpleDate = ( yourDateStr ) => {
  // input -> '2025-12-11'
  // output -> '11/12'

  let part = yourDateStr.split('-')
  return part[2] + '/' + part[1]
} //ok


// sortArray --------------------------------------------------------
/*
    get the array sorted in ascending or desending, for both str & num
*/
pumpb.sortArray = (array, fieldName, type = 'ascending') => {
    // Return a shallow copy of the array to avoid modifying the original array (best practice)
    const sortedArray = [...array]; 

    sortedArray.sort((a, b) => {
        // 1. Get the values from the two objects being compared
        const valA = a[fieldName];
        const valB = b[fieldName];

        // 2. Determine the comparison result (1, -1, or 0)
        let comparison = 0;

        // Note: This logic assumes numerical or standard string comparison.
        // For case-insensitive strings or specific locale sorting, use .localeCompare().
        if (valA > valB) {
            comparison = 1; // a comes after b
        } else if (valA < valB) {
            comparison = -1; // a comes before b
        }
        
        // 3. Apply the direction logic
        if (type.toLowerCase() === 'descending') {
            // If descending, reverse the comparison result
            return comparison * -1;
        }

        // Default is ascending
        return comparison;
    });

    return sortedArray;
}



/*
    output as 'hh:mm:ss' like '23:59:59'
*/
pumpb.getDuration = ( millisec ) => {

  let sign = '';
  millisec = Number(millisec)
  if (millisec < 0) {
    sign = '-'
  }

  const totalSeconds = Math.abs( Math.floor( millisec / 1000));
  const hour = Math.floor(totalSeconds / 3600); 
  const min = Math.floor((totalSeconds % 3600) / 60);
  const sec = totalSeconds % 60;

  return sign + `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`

} //ok


/*
    getDailyAttendance
    output
*/
pumpb.getSimpleTime = (jsDateObject) => {
  // 1. Validation: Ensure the input is a valid Date object
  if (!(jsDateObject instanceof Date) || isNaN(jsDateObject.getTime())) {
      console.error("Invalid input: Please provide a valid JavaScript Date object.");
      return "00:00:00"; 
  }

  // 2. Extract components using local time (getTimezoneOffset applied)
  const hours = jsDateObject.getHours();
  const minutes = jsDateObject.getMinutes();
  const seconds = jsDateObject.getSeconds();

  // 3. Format the components with leading zeros (HH:MM:SS)
  // String(n).padStart(2, '0') ensures '9' becomes '09'
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');

  // 4. Return the combined string
  return `${h}:${m}:${s}`;
} //ok




pumpb.getLocalIsoDate = ( dateObject ) => {

  const pad = (n) => String(n).padStart(2, '0');
  const year = dateObject.getFullYear();
  const month = pad(dateObject.getMonth() + 1);
  const day = pad(dateObject.getDate());

  const hours = pad(dateObject.getHours());
  const minutes = pad(dateObject.getMinutes());
  const seconds = pad(dateObject.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

} //ok





pumpb.getMilli = ( humanTime ) => {
  // convert hh:mm:ss to 136546545132...millisec

  let sign;
  let part = humanTime.toString().split(':')
  if (part[0].startsWith('-')) { // take out the sign first
    part[0] = part[0].slice(1)
    sign = -1
  }

  let hh = Number(part[0] || 0) * (1000*60*60)
  let mm = Number(part[1] || 0) * (1000*60) 
  let ss = Number(part[2] || 0) * (1000)

  return sign == -1 ? sign*(hh+mm+ss) : hh+mm+ss
} //ok




pumpb.clearBrowserBar = () => {
    window.history.replaceState( null,'', window.location.origin + window.location.pathname)
}
