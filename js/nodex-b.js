/*
file: nodex-b.js
for: provide functions that work in browser supporting node-x project

*/

const nodex = {
  about: {
    brief: 'programs to help working in browser for project node-x',
    version: '0.1',
    by: '@devster',
    date: 'jun27/2025 11:13+7' 
  },
  help: {},
  note: {},
  secure: {
    masterKey: 'd299927fdea2d5a7e994a5c8d4ff3bee85c5c770be1a4f7fa3b9b81bc216bd90',
    salt: '*tLa4T51@-^H'
  } 
}




nodex.getMd5 = (STRING) => {

  /*
  for: convert string to md5 code
  test: ok
  */

  function rotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX, lY) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    else return lResult ^ lX8 ^ lY8;
  }
  function F(x, y, z) { return (x & y) | (~x & z); }
  function G(x, y, z) { return (x & z) | (y & ~z); }
  function H(x, y, z) { return x ^ y ^ z; }
  function I(x, y, z) { return y ^ (x | ~z); }

  function FF(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str) {
    const lWordCount = ((str.length + 8) >> 6) + 1;
    const lWordArray = new Array(lWordCount * 16).fill(0);
    for (let i = 0; i < str.length; i++) {
      lWordArray[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    }
    lWordArray[(str.length >> 2)] |= 0x80 << ((str.length % 4) * 8);
    lWordArray[lWordCount * 16 - 2] = str.length * 8;
    return lWordArray;
  }

  function wordToHex(lValue) {
    let wordToHexValue = "", temp;
    for (let j = 0; j <= 3; j++) {
      temp = (lValue >>> (j * 8)) & 255;
      wordToHexValue += (temp < 16 ? "0" : "") + temp.toString(16);
    }
    return wordToHexValue;
  }

  let x = convertToWordArray(STRING);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    let AA = a, BB = b, CC = c, DD = d;

    a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], 17, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], 9, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], 23, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0], 6, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], 10, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], 15, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}





nodex.getSha256 = async ( STR ) => {
  const data = new TextEncoder().encode( STR);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

















nodex.getXwt = ( USER_NAME, JWT) => {
  /*
  for: gen a simple one time token (OTT) to avoid passing jwt on the url query. Protecting security and make the url not too long.
  idea: the server will take this ottx and make md5 with jwt it has in the db so it knows this is valid or not.
  note: changed name to xwt (x web token)
  output:
    - xwtFormat: [[ott]].[[userName/base64url]].[[milisec/base64url]]
    - the xwt length in general is around 62 chars little shorter than sha-256
  */

  if (!USER_NAME || !JWT) {
    return false
  }
  

  const milisec = Date.now()
  const ott = nodex.getMd5( USER_NAME + JWT + milisec)
  return ott + '.' + nodex.getBase64Url(USER_NAME) + '.' + nodex.getBase64Url(milisec)
}



/*=====================================================================

  for applying xwt2 in our projects may be in future, right now the xwt1
  should be reasonable especially its length of chars not too long. If
  we use xwt2 the length is so long. Actually the md5 is short, just 32 chars but the payload is very much. So for now, just stick with xwt1.

=====================================================================*/

nodex.getXwt2 = ( USER_NAME, SESSION_ID, JWT ) => {
  /*
  for: xwt v2 we have put more data into payload so we make it json format and then convert to base64url. This makes it contains more information in the payload. And the format of xwt2 code will be 2 blocks which is [[ ott/md5 ]].[[ payload/json/base64url ]]
  input:
    USER_NAME:
    SESSION_ID:
    JWT: [=jwt=]
  output: 
    -xwt2 which is [[[ ott/md5 ]]].[[[ payload/base64url/json ]]]
    -payload wll have format
      {
        userName  : __,
        sessionId : __,
        milisec   : __
      }
  */

  const payloadJson = JSON.stringify(
    {
      userName  : USER_NAME,
      sessionId : SESSION_ID,
      milisec   : Date.now()
    }
  )

  return nodex.getMd5( payloadJson + JWT) + '.' + 
  nodex.getBase64Url( payloadJson)
}







nodex.xwt2pass = ( XWT ) => {
  //this for test, the real one has to work in server side because need to check jwt and some more in the db.

  let [ ott, payload ] = XWT.split('.')
  let payloadJson = nodex.getStringFromBase64url( payload)
  let payloadOj = JSON.parse( payloadJson)

  if ( (Date.now() - payloadOj.milisec) > 3000) return false

  let newOtt = nodex.getMd5( payloadJson + sessionStorage.jwt)
  if (newOtt = ott) return true
  else return false
}




//================================================================






nodex.getBase64Url = (str) => {
  /*
  for: gen base64 that good to pass via url
  test: ok
  */
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


nodex.getStringFromBase64url = (base64url) => {
  /*
  for: convert base64url back to string/plain text
  test: ok
  */
  let base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  // Pad with `=` to make length a multiple of 4
  while (base64.length % 4) {
    base64 += '=';
  }

  return atob(base64);
}




nodex.makeJwts = async ( JWT ) => {
  /*
  for: encrypt jwt and save in sessionStorage
  input:
    loginProfile: X-USER-NAME ....for key
    sessionId: STR ....for key
    salt: STR-PASSWD ...for key
    jwt: JWT,
  rule: no input, no output
  */

  if (JWT && sessionStorage.sessionId && sessionStorage.loginProfile) {
    const thisKey = await xb.hash( 
      sessionStorage.loginProfile + sessionStorage.sessionId + 
      nodex.secure.salt
    ) 
    sessionStorage.setItem('jwts', await xb.enc( JWT, thisKey) )
  }
  
}



nodex.getJwtFromJwts = async () => {
  /*
  for: decrypt jwts to jwt
  input: none, as will take it from sessionStorage
  */

  if (!sessionStorage.jwts || !sessionStorage.sessionId || !sessionStorage.loginProfile) return false

  const thisKey = await xb.hash( 
    sessionStorage.loginProfile + sessionStorage.sessionId + 
    nodex.secure.salt
  )
  return await xb.dec( sessionStorage.jwts, thisKey)
}





nodex.validBase64 = ( BASE64 ) => {
  /*
  for: validate if the input is the base64 format
  output: true | false
  test: ok
  */

  if (typeof BASE64 !== 'string') return false;

  // Remove line breaks and spaces
  const cleaned = BASE64.trim().replace(/\r?\n|\s/g, '');

  // Base64 must be divisible by 4
  if (cleaned.length % 4 !== 0) return false;

  // Valid Base64 characters: A–Z, a–z, 0–9, +, /, and optional padding =
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

  return base64Regex.test(cleaned);
}



nodex.validBase64Url = ( BASE64_URL ) => {
  /*
  for: validate if input is base64Url 
  output: true | false
  test: ok
  */

  if (typeof BASE64_URL !== 'string') return false;

  // Split by dot if present (e.g., JWT has 3 parts)
  const parts = BASE64_URL.split('.');

  // Check each part individually
  const base64UrlRegex = /^[A-Za-z0-9\-_]+$/;

  return parts.every(part =>
    part.length > 0 &&
    base64UrlRegex.test(part)
  );
}



//==================================================================
// zess, a session database

nodex.Zess = class {

  constructor() {
    //create new zess in session
    if (sessionStorage.zess || sessionStorage.zess == '1') {
      //already having db or init, so don't touch
    } else {
      sessionStorage.setItem('zess','1') //new
    }
  }

  // helper---------------------------------
  async #getKey() { //gen key for enc/dec
    try {
      return await xb.hash( sessionStorage.loginProfile + sessionStorage.sessionId + nodex.secure.salt )
    } catch (error) {
      console.error('ERROR/#getKey', error)
    }
  }

  async #readInternal() {
    try {
      let zess = sessionStorage.getItem('zess')
      return JSON.parse( 
        await xb.dec( zess, await this.#getKey() ) 
      )
    } catch (error) {
      console.error('ERROR/#readInternal', error)
    }
  }

  async #readExternal( SEC_KEY ) {
    try {
      let zess = sessionStorage.getItem('zess')
      return JSON.parse( 
        await xb.dec( zess, SEC_KEY ) 
      )
    } catch (error) {
      console.error('ERROR/#readExternal', error)
    }
  }

  async #writeInternal( ZESS_OBJ ) {
    try {
      let zess = await xb.enc(
      JSON.stringify( ZESS_OBJ ), await this.#getKey()
      ) 
      sessionStorage.setItem('zess', zess)
    } catch (error) {
      console.error('ERROR/#writeInternal', error)
    }
  }

  async #writeExternal( ZESS_OBJ, SEC_KEY ) {
    try {
      let zess = await xb.enc(
        JSON.stringify( ZESS_OBJ ), SEC_KEY
      ) 
      sessionStorage.setItem('zess', zess)
    } catch (error) {
      console.error('ERROR/zess/#writeExternal', error)
    }
  }

  // worker------------------------
  async set( NAME, VALUE, SEC_KEY ) {
    
    // changed the set must put sec-key too to protect someone setting the same existing-key and destroying that value

    if (!sessionStorage.zess || !NAME || !VALUE) return false
    if ( SEC_KEY != await this.#getKey()) return false

    let zessObj
    if (sessionStorage.zess == '1') { //value from init
      zessObj = {}
    } else {
      zessObj = await this.#readExternal( SEC_KEY)
    }
    zessObj[ NAME ] = VALUE
    await this.#writeExternal( zessObj, SEC_KEY )
  }


  async get( NAME, SEC_KEY ) {
    //must put both name and sec-key
    if (!sessionStorage.zess || !NAME || !SEC_KEY) return false
    if (SEC_KEY != await this.#getKey()) return false

    if (sessionStorage.zess == '1') {
      return null
    } else {
      let zessObj = await this.#readExternal( SEC_KEY )
      return zessObj[ NAME ]
    }
     
  }


  async del( NAME, SEC_KEY ) {
    if (!sessionStorage.zess || !NAME || !SEC_KEY || sessionStorage.zess == '1') return false
    if (SEC_KEY != await this.#getKey()) return false

    let zessObj = await this.#readExternal( SEC_KEY)
    delete zessObj[ NAME ]
    await this.#writeExternal( zessObj, SEC_KEY)
  }


  /*async init() { //make the tank to store data
    await this.#writeInternal( {} )
  }*/


  async list( SEC_KEY ) { //list all keys in db
    if (!sessionStorage.zess) return false
    if (SEC_KEY != await this.#getKey()) return false

    let zessObj
    if (sessionStorage.zess == '1') {
      return null
    } else {
      zessObj = await this.#readExternal( SEC_KEY )
      return Object.keys( zessObj )
    }
    
  }

  

  async reset( SEC_KEY ) {
    //this resets the zess database to '1' which is the beginning and means all setting data are destroyed.

    if (SEC_KEY != await this.#getKey() ) return false
    sessionStorage.setItem('zess','1')
  }

  /*
  time: jun29/2025 09:51+7
  note: everything seems working, need to add try/catch for more reliable
  by: @devster
  */

}






nodex.validUuid = ( UUID ) => {
  /*
  for: check if it is valid UUID
  output: true | false
  */
 
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test( UUID );
}



//===============================================================
nodex.Secret = class {
  #value; #key

  constructor ( LENGTH ) {
    this.#value = xb.password( LENGTH )
    this.#key = nodex.secure.masterKey
  }

  get ( KEY ) {
    if ( KEY == this.#key) {
      return this.#value
    } else {
      return false
    }
  }
}









/**
 * Generates a UUID (Universally Unique Identifier) string.
 * This implementation is based on RFC 4122, version 4.
 * It produces a random UUID.
 *
 * @returns {string} A randomly generated UUID string.
 */
nodex.getUuid = () => {
  // Generate 16 random hexadecimal digits (32 characters total)
  // The 'x' and 'y' characters are placeholders for specific UUID patterns.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    // Generate a random number between 0 and 15 (inclusive)
    const r = Math.random() * 16 | 0;
    // If 'c' is 'y', apply a specific bitwise operation to 'r'
    // This ensures the correct UUID format for the 'y' character.
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    // Convert the resulting number to a hexadecimal string
    return v.toString(16);
  });
}

// Example usage:
// console.log(generateUUID());
// console.log(generateUUID());




nodex.getUuid2 = () => {

  /*
  for: gen the UUID from secure engine inside js but if not available, fallback to simple one
  */


  // Check if crypto.randomUUID() is supported (modern browsers)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    // Fallback for browsers supporting crypto.getRandomValues but not randomUUID
    // This generates a Version 4 UUID using cryptographically strong random numbers.
    const uuid = new Uint8Array(16);
    crypto.getRandomValues(uuid);

    // Set the version (4) and variant (RFC 4122) bits
    uuid[6] = (uuid[6] & 0x0f) | 0x40; // Version 4
    uuid[8] = (uuid[8] & 0x3f) | 0x80; // RFC 4122 variant

    // Convert to hexadecimal string format
    let uuidStr = '';
    for (let i = 0; i < 16; i++) {
      uuidStr += uuid[i].toString(16).padStart(2, '0');
      if (i === 3 || i === 5 || i === 7 || i === 9) {
        uuidStr += '-';
      }
    }
    return uuidStr;
  } else {
    // Fallback for very old browsers (less secure, but functional)
    // This uses Math.random(), which is not cryptographically secure.
    console.warn("Using Math.random() for UUID generation. Consider updating your browser for stronger randomness.");
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Example usage:
// console.log(generateUUID());
// console.log(generateUUID());



//get tiny time---------------------------------------------------
nodex.getTinyTime = ( MILISEC ) => {
  let tt = new Date( MILISEC)
  let yr = tt.getFullYear()
  let mth = tt.toLocaleString('default',{month:'short'})
  let dt = tt.getDate()
  let hr = tt.getHours()
  let min = String( tt.getMinutes() ).padStart(2,'0') // makes :00

  //output format = jun13 20:04
  if (yr == new Date().getFullYear()) {
    yr = ''
  } else {
    yr = '/' + yr
  }

  return hr + ':' + min + ' /' + mth + dt + yr
}



//------------------------------------------------------------------


nodex.sortArray = (arr, field, OPT = 'as') => {
  /*
  for: sort objects in an array, getting new array as output not affecting the original array
  input:
    arr: [[input array]]
    field: [[field to sort]]
    OPT: [[default is 'as' (ascending) if put 'de' it is descending]]
  output: the sorted array, not affecting original array
  test: ok
  createdDate: jul1/2025 18:05+7
  by: @devster 
  */

  const sortedArr = [...arr];
  let ascending = true //default
  if (OPT == 'as') {
    ascending = true
  } else if (OPT == 'de') {
    ascending = false
  } else {
    // will be true
  }

  sortedArr.sort((a, b) => {
    const valA = a[field];
    const valB = b[field];

    if (valA === undefined || valB === undefined) {
      // Handle cases where the field might be missing in some objects.
      // You might want to adjust this behavior based on your specific needs.
      // For now, we'll treat undefined as "less than" defined values.
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return ascending ? -1 : 1;
      if (valB === undefined) return ascending ? 1 : -1;
    }

    // Basic comparison for numbers and strings
    if (typeof valA === 'number' && typeof valB === 'number') {
      return ascending ? valA - valB : valB - valA;
    } else {
      // For strings, use localeCompare for proper alphabetical sorting
      const comparison = String(valA).localeCompare(String(valB));
      return ascending ? comparison : -comparison;
    }
  });

  return sortedArr;
}



//---------------------------------------------------------------

/*
nodex.getDataUrlimage = async (FILE_INPUT_ELEM, options = {}) => {
  
  /*
  for: get pic from file input and makes it dataUrl, also crop to 4:3 ratio
  useGuide: |
    <input type="file" onchange="nodex.getDataUrlimage( this, { crop: '4:3', outputWidth: 1000 } ).then( durl => show_pic_elem.src = durl)">
  note: the default crop is 4:3 and outputWidth is 1000, so you can leave the option blank. Right now, the func just do 4:3
  warning: the input file's width must be at least 1000 if we set output width 1000
  test: ok
  by: @devster
  */
/*
  const file = FILE_INPUT_ELEM.files[0]; // Get the selected file Blob


  //                            validate


  if (!file || !file.type.startsWith('image/')) {
      //errorMessageElem.textContent = 'No file selected.';
      return;
  }

  

  //                            main logic

  try {
    // --- Core image processing logic ---
    const {
      crop = '4:3',
      outputWidth = 1000,
      outputHeight
    } = options;

    const processedDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event) {
        const img = new Image();
        img.onload = () => {
          const originalWidth = img.naturalWidth;
          const originalHeight = img.naturalHeight;

          let sx = 0,
              sy = 0,
              sWidth = originalWidth,
              sHeight = originalHeight;

          const targetAspectRatio = 4 / 3;

          if (crop === '4:3') {
            if (originalWidth / originalHeight > targetAspectRatio) {
              sHeight = originalHeight;
              sWidth = originalHeight * targetAspectRatio;
              sx = (originalWidth - sWidth) / 2;
              sy = 0;
            } else {
              sWidth = originalWidth;
              sHeight = originalWidth / targetAspectRatio;
              sx = 0;
              sy = (originalHeight - sHeight) / 2;
            }
          }

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let destWidth, destHeight;
          const currentAspectRatio = sWidth / sHeight;

          if (outputWidth && outputHeight) {
              destWidth = outputWidth;
              destHeight = outputHeight;
          } else if (outputWidth) {
              destWidth = outputWidth;
              destHeight = outputWidth / currentAspectRatio;
          } else if (outputHeight) {
              destHeight = outputHeight;
              destWidth = outputHeight * currentAspectRatio;
          } else {
              destWidth = sWidth;
              destHeight = sHeight;
          }

          canvas.width = destWidth;
          canvas.height = destHeight;

          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, destWidth, destHeight);

          resolve(canvas.toDataURL(file.type));
        };

        img.onerror = () => {
            reject(new Error("Failed to load image for processing."));
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
          reject(new Error("Failed to read the image file."));
      };

      reader.readAsDataURL(file); // Start reading the file
    });

    // Display the processed image
    //outputImageElem.src = processedDataUrl;
    //outputImageElem.style.display = 'block';

    //console.log('Image processed and displayed successfully!');

    return processedDataUrl

  } catch (error) {
      console.error('Error processing image:', error);
      //errorMessageElem.textContent = `Error: ${error.message}`;
      //outputImageElem.src = '';
      //outputImageElem.style.display = 'none';
  }
  //}); // End of event listener
}

*/


// Ensure 'nodex' object exists
//if (typeof nodex === 'undefined') {
//  var nodex = {};
//}

nodex.getDataUrlimage = async (FILE_INPUT_ELEM, options = {}) => {

  /*
  for: get pic from file input and makes it dataUrl, also crop to 4:3 ratio
  useGuide: |
    <input type="file" onchange="nodex.getDataUrlimage( this, { crop: '4:3', outputWidth: 1000, text: 'Hello World' } ).then( durl => show_pic_elem.src = durl)">
  note: 
    - the default crop is 4:3 and outputWidth is 1000. If 'text' option is provided, it will stamp at top: 4px, left: 4px, font-size: 12px, semi-transparent white (fixed).
    - now user can adjust the aspect freely, tested. jul8/2025
  warning: the input file's width must be at least 1000 if we set output width 1000, otherwise quality may degrade. (if resolution of original width is less then 1000, the output will be set by the original.)
  test: ok
  by: @devster
  time: 21:03 jul6/2025 +7
  update:
    - date: jul8
      note: now adjust the aspect/ratio freely but still, default is 4:3. We added the text to the pic metadata as well as at the tail of dataUrl, no problem of showing in browser.
      by: @devster

  */


/*

    to make the image metadata stamping works, must put this line in the html file

    <script src="https://cdn.jsdelivr.net/npm/piexifjs"></script>

*/



  const file = FILE_INPUT_ELEM.files[0]; // Get the selected file Blob

  //                            validate
  if (!file || !file.type.startsWith('image/')) {
    return; // Return early if no valid file
  }

  //                            main logic
  try {
    // --- Destructure main image options ---
    const {
      crop = '4:3',
      outputWidth = 1000, //pixel width of the pic data
      outputHeight,
      userText = Date.now() + '-' + nodex.getRandomWord() 
    } = options;

    const processedDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event) {
        const img = new Image();
        img.onload = () => {
          const originalWidth = img.naturalWidth;
          const originalHeight = img.naturalHeight;

          let sx = 0,
            sy = 0,
            sWidth = originalWidth,
            sHeight = originalHeight;

          //ratio work
          const [ w, h ] = crop.split(':')
          const targetAspectRatio = w/h   //4 / 3;

          //if (crop === '4:3') {
            if (originalWidth / originalHeight > targetAspectRatio) {
              //if ratio > setRatio, base with h, adjust w
              sHeight = originalHeight;
              sWidth = originalHeight * targetAspectRatio;
              sx = (originalWidth - sWidth) / 2;
              sy = 0;
            } else {
              //if ratio < setRatio, base with w, adjust h
              sWidth = originalWidth;
              sHeight = originalWidth / targetAspectRatio;
              sx = 0;
              sy = (originalHeight - sHeight) / 2;
            }
          //}

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let destWidth, destHeight;
          const currentAspectRatio = sWidth / sHeight;

          // Determine final canvas dimensions
          let finalOutputWidth = outputWidth;
          let finalOutputHeight = outputHeight;

          if (finalOutputWidth && finalOutputWidth > sWidth) {
            finalOutputWidth = sWidth;
          }
          if (finalOutputWidth && !finalOutputHeight) {
              finalOutputHeight = finalOutputWidth / currentAspectRatio;
          }

          if (finalOutputHeight && finalOutputHeight > sHeight) {
            finalOutputHeight = sHeight;
          }
          if (finalOutputHeight && !finalOutputWidth) {
              finalOutputWidth = finalOutputHeight * currentAspectRatio;
          }

          if (!finalOutputWidth && !finalOutputHeight) {
            //if user not provided both width and height, takes the original which set aspect ratio already (eg 4:3)
              finalOutputWidth = sWidth;
              finalOutputHeight = sHeight;
          }

          //this is very final w&h
          destWidth = finalOutputWidth;
          destHeight = finalOutputHeight;

          canvas.width = destWidth;
          canvas.height = destHeight;

          // 1. Draw the image onto the canvas
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, destWidth, destHeight);

          // 2. Stamp text if provided (using fixed defaults)
          let finalText
          if ( userText ) {
            // Hardcoded text properties
            const fixedFont = '30px monospace';
            const fixedColor = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
            const fixedPositionX = 4; // 4px from left
            const fixedPositionY = 4; // 4px from top

            ctx.font          = fixedFont;
            ctx.fillStyle     = fixedColor;
            ctx.textAlign     = 'left';
            ctx.textBaseline  = 'top';

            //this is where we set the text on the pic
            finalText = `xzell-${destWidth}x${destHeight}-` + userText

            ctx.fillText(
              finalText, 
              fixedPositionX, fixedPositionY
            );
          }

          //resolve(canvas.toDataURL(file.type));

          
          //add embed info into image
          const dataUrl = canvas.toDataURL('image/jpeg')
          let finalDataUrl = dataUrl

          if (typeof window.piexif !== 'undefined') {

            //inject EXF metadata
            const exifObj = {
              "0th"       : {},
              "Exif"      : {},
              "1st"       : {},
              "thumbnail" : null
            }

            //put text nto metadata
            exifObj["0th"][piexif.ImageIFD.ImageDescription] = 'This image is regenerated by xzell.'
            exifObj["Exif"][piexif.ExifIFD.UserComment] = 'xzellPicId=' + finalText
            
            const exifBytes = piexif.dump(exifObj)
            finalDataUrl = piexif.insert(exifBytes, dataUrl)
          }

          //finished
          resolve( finalDataUrl + '#xzellPicId=' + finalText )

        };

        img.onerror = () => {
          reject(new Error("Failed to load image for processing."));
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read the image file."));
      };

      reader.readAsDataURL(file); // Start reading the file
    });

    return processedDataUrl;

  } catch (error) {
    console.error('Error processing image:', error);
  }
}


/*
nodex.getRandomWords = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    // Optional: Basic validation for the length
    if (typeof length !== 'number' || length < 0 || !Number.isInteger(length)) {
        console.warn("getRandomWords: Length must be a non-negative integer. Returning empty string.");
        return '';
    }

    for (let i = 0; i < length; i++) {
        // Get a random index from 0 to charactersLength - 1
        const randomIndex = Math.floor(Math.random() * charactersLength);
        // Append the character at the random index to the result
        result += characters.charAt(randomIndex);
    }

    return result;
}
*/




/*
this is how to read image file metadata


const exif = piexif.load(dataUrl);
const code = exif["0th"][piexif.ImageIFD.ImageDescription] || exif["Exif"][piexif.ExifIFD.UserComment];
console.log('Extracted code:', code);





*/







//------------------------------------------------------------------


nodex.getRandomWord = (length=10) => {
  /*
  for: gen randome words includes a-zA-Z0-9, user can set length
  test: ok
  by: @devster
  time: 21:04 jul6/2025 +7
  */

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


//------------------------------------------------------------------


nodex.getCleanString = ( inputString ) => {

  /*
  for: clean input-string to ensure there's no harm code. This can be used when taking the user-input into server/db, or cleaning before showing server/db-data into html page
  whereToUse: both server or browser
  input: string from someone/external/user
  output: clean string
  by: google gemini
  time: 09:14 jul7/2025 +7
  test: pending
  */

  if (typeof inputString !== 'string') {
    return ''; // Return an empty string or throw an error for non-string inputs
  }

  let cleanedString = inputString;

  // 1. HTML Entity Encoding (basic)
  // This helps prevent basic HTML injection by converting characters like <, >, &, " to their HTML entities.
  cleanedString = cleanedString.replace(/&/g, '&amp;');
  cleanedString = cleanedString.replace(/</g, '&lt;');
  cleanedString = cleanedString.replace(/>/g, '&gt;');
  cleanedString = cleanedString.replace(/"/g, '&quot;');
  cleanedString = cleanedString.replace(/'/g, '&#x27;'); // Apostrophe
  cleanedString = cleanedString.replace(/\//g, '&#x2F;'); // Forward slash (useful for closing tags)

  // 2. Remove potentially dangerous tags and attributes (more aggressive)
  // This part is more direct in removing known dangerous patterns.
  // Note: Regular expressions for parsing HTML are notoriously difficult to get right perfectly.
  // For critical applications, consider using a dedicated DOMPurify-like library.

  // Remove script tags (case-insensitive, allows for spaces/newlines)
  cleanedString = cleanedString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove img tags with onerror attributes
  cleanedString = cleanedString.replace(/<img[^>]*onerror=[^>]*>/gi, '');

  // Remove common event handlers (e.g., onclick, onload, onerror) from any tag
  // This is a simplified approach. A more robust solution might parse attributes.
  cleanedString = cleanedString.replace(/\bon(?:click|load|error|submit|mouseover|mouseout|keydown|keyup|keypress)\s*=\s*['"]?[^'"]*['"]?/gi, '');

  // Remove `javascript:` URIs in href or src attributes
  cleanedString = cleanedString.replace(/href=["']javascript:[^"']*["']/gi, 'href="#"');
  cleanedString = cleanedString.replace(/src=["']javascript:[^"']*["']/gi, 'src="#"');

  // 3. Optional: Strip leading/trailing whitespace
  cleanedString = cleanedString.trim();

  return cleanedString;
}


//----------------------------------------------------------------


/**
 * Performs a basic, non-exhaustive check for potentially dangerous HTML/JavaScript patterns in a string.
 * This function is for client-side heuristic detection only and MUST NOT be relied upon for security.
 * Server-side validation and proper output encoding are essential for preventing XSS and other attacks.
 *
 * @param {string} inputString The string to check.
 * @returns {boolean} True if potentially dangerous patterns are found, false otherwise.
 */
nodex.isDanger = nodex.isDangerString = (inputString) => {

  /*
  for: checking input if it is danger or suspecting to be malicious thing
  input: string
  output: true if danger | false if safe
  */

    if (typeof inputString !== 'string') {
        console.warn("isDangerBasic received non-string input:", inputString);
        return false; // Or throw an error, depending on desired behavior
    }

    // Convert to lowercase to simplify regex matching
    const lowerInput = inputString.toLowerCase();

    // Regex patterns for common malicious constructs:

    // 1. Script tags (even disguised)
    // <script>, <noscript>, <svg/onload=...>, <body/onload=...>, etc.
    // This is very broad for any opening angle bracket followed by 's' and potentially more,
    // then 'c', 'r', 'i', 'p', 't'. Also catches variations.
    const scriptTagRegex = /<\s*(script|noscript|svg|img|body|iframe|link|style|object|embed|form|input|textarea|button)\b[^>]*>/i;
    if (scriptTagRegex.test(lowerInput)) {
        console.warn("isDangerBasic: Detected potential script/dangerous tag.", lowerInput.match(scriptTagRegex)[0]);
        return true;
    }

    // 2. Event handlers (e.g., onerror, onload, onclick, onmouseover)
    // Looking for 'on' followed by word characters and an equals sign
    const eventHandlerRegex = /\bon[a-z]+\s*=/i;
    if (eventHandlerRegex.test(lowerInput)) {
        console.warn("isDangerBasic: Detected potential event handler attribute.", lowerInput.match(eventHandlerRegex)[0]);
        return true;
    }

    // 3. JavaScript URI schemes (e.g., javascript:alert(1))
    // In href, src, or CSS url()
    const jsUriRegex = /(href|src|background|url)\s*=\s*(['"]\s*)?javascript\s*:/i;
    if (jsUriRegex.test(lowerInput)) {
        console.warn("isDangerBasic: Detected potential JavaScript URI.", lowerInput.match(jsUriRegex)[0]);
        return true;
    }

    // 4. Data URI schemes that could execute code (e.g., data:text/html, <svg onload=...>)
    const dataUriRegex = /data:(text\/html|application\/xml|image\/svg\+xml)\s*;/i;
    if (dataUriRegex.test(lowerInput)) {
        console.warn("isDangerBasic: Detected potential Data URI.", lowerInput.match(dataUriRegex)[0]);
        return true;
    }

    // 5. HTML entities that could represent dangerous characters (e.g., &#x3C; for <)
    // This is more complex to catch all, but common ones are enough for basic.
    // &lt;, &gt;, &#60;, &#62;, &#x3c;, &#x3e;
    const htmlEntityRegex = /(&#x?[0-9a-f]+;|<|>)/i;
    if (htmlEntityRegex.test(lowerInput)) {
        // This is a common indicator, but not necessarily malicious on its own.
        // It simply indicates the presence of encoded characters.
        // For basic detection, it might be a flag.
        // console.warn("isDangerBasic: Detected HTML entities.", lowerInput.match(htmlEntityRegex)[0]);
        // return true; // You might choose to return true here or not, depending on strictness.
    }

    // 6. CSS expressions (IE only, but good to catch for broad compatibility)
    const cssExpressionRegex = /expression\s*\(.*\)/i;
    if (cssExpressionRegex.test(lowerInput)) {
        console.warn("isDangerBasic: Detected potential CSS expression.", lowerInput.match(cssExpressionRegex)[0]);
        return true;
    }

    // If no suspicious patterns are found
    return false;
}

// --- Examples ---
/*
let input1 = "This is a safe string.";
console.log(`Input: "${input1}" -> isDangerBasic: ${isDangerBasic(input1)}`); // Expected: false

let input2 = "Hello <script>alert('XSS');</script> World";
console.log(`Input: "${input2}" -> isDangerBasic: ${isDangerBasic(input2)}`); // Expected: true (script tag)

let input3 = "<img src='x' onerror='alert(1)'>";
console.log(`Input: "${input3}" -> isDangerBasic: ${isDangerBasic(input3)}`); // Expected: true (onerror attribute)

let input4 = "<a href=\"javascript:void(0)\">Click Me</a>";
console.log(`Input: "${input4}" -> isDangerBasic: ${isDangerBasic(input4)}`); // Expected: true (javascript: URI)

let input5 = "Some benign text with no special characters.";
console.log(`Input: "${input5}" -> isDangerBasic: ${isDangerBasic(input5)}`); // Expected: false

let input6 = "<svg/onload=alert(document.domain)>";
console.log(`Input: "${input6}" -> isDangerBasic: ${isDangerBasic(input6)}`); // Expected: true (svg tag + onload)

let input7 = "background-image: url('javascript:alert(1)');";
console.log(`Input: "${input7}" -> isDangerBasic: ${isDangerBasic(input7)}`); // Expected: true (javascript: URI in url())

let input8 = "<div style=\"width: expression(alert('XSS'))\"></div>";
console.log(`Input: "${input8}" -> isDangerBasic: ${isDangerBasic(input8)}`); // Expected: true (CSS expression)

let input9 = "Looks innocent but could be dangerous when decoded: &lt;script&gt;alert(1)&lt;/script&gt;";
console.log(`Input: "${input9}" -> isDangerBasic: ${isDangerBasic(input9)}`); // Expected: false (due to strict entity check - but this is the point of client-side limits)

let input10 = "Just normal HTML: <span>Hello</span>";
console.log(`Input: "${input10}" -> isDangerBasic: ${isDangerBasic(input10)}`); // Expected: false

*/



nodex.isSafe = nodex.isSafeString = ( SUSPECTING_STR ) => {
  return !nodex.isDanger( SUSPECTING_STR )
}


/*
    all right, we can use nodex.isSafe, nodex.isSafteString, nodex.isDanger, nodex.isDangerString to basically check the suspecting string. Tested=ok.
*/



//-----------------------------------------------------------------



nodex.post = async ( ur_l, dat_a, headerField) => {
  /*
  for: send data to server via POST method
  input:
    ur_l: << of the server >>
    dat_a: << object >>
    headerField: << object like { xwt: sssssss }
  output:
    - this is response from server, for node-x we'll try most of response in SimpleMsg, this format: |
      {
        done: true | false,
        msg: 'done, sssssssssssssssssss',
        from: 'node-x/sssssss'
      }
    - so you can just check response.done to see success or fail
  guide: const serverResponse = await nodex.post( URL, DATA, HEADER)
  */

  let setHeaders = {
    'Content-Type':'application/json'
  }

  if (headerField) {
    for (key in headerField) {
      setHeaders[ key.toLowerCase() ] = headerField[ key] 
    } 
  } 

  try {
    const resp = await fetch( ur_l, {
      method  : 'POST',
      headers : setHeaders,
      body    : JSON.stringify( dat_a)
    })

    if (!resp.ok) {
      const errorText = await resp.text()
      throw new Error(`fail, network error, ${resp.status}: ${errorText}`)
    }

    return await resp.json() //this is from where we fetched.
  
  } catch( error) {
    console.error( 'justPost', error )
    return {
      done  : false, 
      msg   : 'fail, fetch from server (3000)',
      attach: error, 
      from  : 'justPost'}
  }

  // tested=ok, @devster
}


//--------------------------------------------------------------


nodex.uploadPic = async ( FILE_INPUT_ELEM, API_URL = conf.nodexUrl + '/upload-jpg' ) => {
  
  // upload pic file to api
  // file saves in nodex/public/jpg and in nexdb.picMaster
  // guide: <button onclick="nodex.uploadPic( file_input_elem )" ...

  const file = FILE_INPUT_ELEM.files[0];
  // ^ take only first file by default

  if (!file) {
    alert("No file selected");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  const reply = await fetch( API_URL, {
    method: 'POST',
    body  : formData
  });

  return await reply.json();

  /*
      reply is in StdMsg format:
      {
        done: true,
        msg: 'done, sssssssssssssssssssssss',
        attach: {
          md5: ssssssssssssssssss,
          id: << object id of mongo >>
        }
      }


  */
}