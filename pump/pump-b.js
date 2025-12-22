/*

file: NEX-WEB/pump/pump-b.js
for: put some funcs here to help all browser codes
by: @devster
project: pump

*/


const pumpb = {}


pumpb.testUsers = ['@john','@sern','@fern','@fond','@jum']

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


pumpb.getSimpleDate = pumpb.simpleDate


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




pumpb.MyQuery = class MyQuery {
    constructor(queryString) {
        // Initializes with the current URL parameters or a provided string
        this.params = new URLSearchParams(queryString || window.location.search);
        this.basePath = window.location.pathname; 
    }
    
    // --- New Method ---
    /**
     * Checks if a parameter with the given name exists.
     * @param {string} name The name of the parameter to check (e.g., 'id', 'page').
     * @returns {boolean} True if the parameter exists, false otherwise.
     */
    has(name) {
        return this.params.has(name);
    }
    
    // --- Existing Methods ---
    get(name) { 
        return this.params.get(name); 
    }
    
    set(name, value) { 
        this.params.set(name, value); 
    }
    
    toString() { 
        return '?' + this.params.toString(); 
    }

    // Method to update URL and re-render (optional, requires a callback function)
    updateURLAndRender(renderCallback) {
        const newPath = this.basePath + this.toString();
        window.history.pushState({ path: newPath }, '', newPath);
        if (typeof renderCallback === 'function') {
            renderCallback(this);
        }
    }
}




pumpb.getLengthFrom2times = (startTime, stopTime) => {
    // 1. Convert "HH:MM" strings to total minutes from midnight.
    const timeToMinutes = (timeStr) => {
        // timeStr looks like "HH:MM", e.g., "09:30"
        const parts = timeStr.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        return (hours * 60) + minutes;
    };

    const startTotalMinutes = timeToMinutes(startTime);
    const stopTotalMinutes = timeToMinutes(stopTime);

    // 2. Calculate the difference in minutes.
    let differenceInMinutes = stopTotalMinutes - startTotalMinutes;

    // 3. Handle rollover (stop time is on the next day, e.g., 23:00 to 01:00).
    // If the difference is negative, add 24 hours (1440 minutes).
    if (differenceInMinutes < 0) {
        differenceInMinutes += 1440; // 24 hours * 60 minutes
    }

    // 4. Format the total minutes back into "HH:MM" duration string.
    const durationHours = Math.floor(differenceInMinutes / 60);
    const durationMinutes = differenceInMinutes % 60;

    // Use String.padStart() to ensure two digits (e.g., '1' becomes '01').
    const formattedHours = String(durationHours).padStart(2, '0');
    const formattedMinutes = String(durationMinutes).padStart(2, '0');

    // Return the final "HH:MM" duration string.
    return `${formattedHours}:${formattedMinutes}`;
}



pumpb.getLongLeaveDuration = (dateTimeStart, dateTimeStop) => {
    /*
        input -> dateTimeStart like 2025-12-19T13:59

    */

    const start = new Date(dateTimeStart);
    const stop = new Date(dateTimeStop);
    const WORK_HOURS_PER_DAY = 8;

    if (stop <= start) {
        return { totalDuration: "00:00", label: "0 วัน 0 ชม. 0 นาที" };
    }

    // 1. คำนวณความต่างแบบปฏิทินก่อนเพื่อหา "วัน"
    const diffInMs = stop - start;
    const msInDay = 1000 * 60 * 60 * 24;
    
    let totalDays = Math.floor(diffInMs / msInDay);
    let remainingMs = diffInMs % msInDay;

    // 2. แปลงเศษที่เหลือเป็น ชั่วโมง และ นาที
    let extraHours = Math.floor(remainingMs / (1000 * 60 * 60));
    let extraMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    // 3. Logic สำคัญ: รวมชั่วโมงทำงาน (นับวันละ 8 ชม.)
    // เอาจำนวนวันเต็มๆ คูณ 8
    let workHours = totalDays * WORK_HOURS_PER_DAY;
    
    // บวกเศษชั่วโมงที่ลาเพิ่ม (แต่เศษของวันต้องไม่เกิน 8 ชม. ตามกฎเฮีย)
    // เช่น ถ้าลาเศษออกมา 10 ชม. เราก็นับแค่ 8 ชม.
    workHours += Math.min(extraHours, WORK_HOURS_PER_DAY);
    
    let workMinutes = extraMinutes;

    // 4. จัด Format ให้เป็น HH:mm (เช่น 100:45)
    const hh = String(workHours).padStart(2, '0');
    const mm = String(workMinutes).padStart(2, '0');
    const totalDuration = `${hh}:${mm}`;

    return {
        totalDuration: totalDuration,
        days: totalDays,
        hours: extraHours,
        minutes: extraMinutes,
        label: `${totalDays} วัน ${extraHours} ชม. ${extraMinutes} นาที (นับเฉพาะเวลาทำงาน)`
    };
}


pumpb.getLongLeaveDuration2 = ( startDate, stopDate ) => {
    /*
        we count different of days, and we take 1 day = 8 workhours as standard

    */

    if (startDate && stopDate) {

        const start = new Date(startDate);
        const stop = new Date(stopDate);

        // 1. หาจำนวนวันที่ลา (วันจบ - วันเริ่ม + 1)
        const diffInMs = stop - start;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

        if (diffInDays > 0) {
            // 2. คำนวณชั่วโมงรวม (วันละ 8 ชม.)
            const totalHours = diffInDays * 8;

            // 3. ปั้นค่าให้ตรงตามที่เฮียต้องการ
            const result = {
                durationInHours: `${String(totalHours).padStart(2, '0')}:00`,
                durationInWords: `${diffInDays} วัน (รวม ${totalHours} ชม.)`
            };

            // 4. เอาไปโชว์ใน textarea (เฮียจะเลือกโชว์อันไหน หรือเอามาต่อกันก็ได้ครับ)
            // ตัวอย่าง: โชว์ทั้งสองอย่างต่อกัน
            //outputField.value = result.durationInHours + " | " + result.durationInWords;
            
            // หรือถ้าจะเอาไปใช้ส่งค่าไปหลังบ้าน เฮียก็ใช้ค่าจาก result.durationInHours ได้เลย
            //console.log(result); 

            return result

        } else {
            //outputField.value = "00:00 | 0 วัน";
            return {
                durationInHours: '00:00',
                durationInWords: '0 วัน'
            }
        }
    }
}




pumpb.youAreTestUser = ( yourUser ) => {
  // return true if yourUser is in pumpb.testUsers, false if not

  if (pumpb.testUsers.includes( yourUser)) {
    return true
  } else {
    return false
  }

}





pumpb.calcHourlyFees = (timeLengthStr, hourlyFee) => {
    // 1. Split the string into hours and minutes
    const [hours, minutes] = timeLengthStr.split(':').map(Number);

    // 2. Convert minutes to a decimal fraction of an hour
    // Example: 25 mins / 60 = 0.41666...
    const decimalMinutes = minutes / 60;

    // 3. Add hours and decimal minutes together
    const totalHours = hours + decimalMinutes;

    // 4. Calculate final fee
    const totalFee = totalHours * hourlyFee;

    // Optional: Round to 2 decimal places for currency precision
    return Math.round(totalFee * 100) / 100;
}
