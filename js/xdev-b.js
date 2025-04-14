/**
 * xdev_b.js -- is a toolbox for developing software based on js & node.js. This module works on browser side. You'll need to use the xdev.js in the server too.
 * 
 * There're 2 files (a) xdev.js for xserver, (b) xdev_b.js for the xbrowser.
 * 
 * version:   0.2
 * license:   none
 * doc:       xdev-guid.html (not created yet)
 * web:       ''
 * createdDate: 20230613
 * lastUpdated: 20231212.1139
 * staff:     M 
 * 
 * #use
 *      <head>
 *          <script src="./xdev_b.js"></script>
 *      </head>
 * 
 *      <script>
 *          let el = xb.readForm2(formid)
 *          let re = $({get:'customer'})
 *      </script>
 * 
 * #log
 *  20231212  changed from XB to xb
 * 
 */



//const e = require("express")




//define a global var here -----------------------------
const xdev    = {}
const xdev_b  = {}
//xdev, xdev_b are reserved

const xb = {
  //this is main object, we use xb to make it as short as possible so faster to type but still remain the definition of xdev so just set xdev as another obj to prevent dup from other module. the xdev obj will use for about, help, etc.

  about: {
    program   :"browser side tool making dev easier",
    web       :'',
    version   :'1.1.1',
    by        :'@devster',
    time      :'20:29 apr14/2025 +7',
    lastUpdate: 'added xb.page'
  },

  secure: {
    sessionId: sessionStorage.getItem('sessionId'),
    masterSalt: "#|~}v4&u&1R",
    salt: '',
    username: '',
    passwordHash: '',
    pinHash: '',
    userLoggedIn: false,
    generalSalt: 'vxgtFse6-@Zl' //same as mdb.config.generalSalt
  },

  xserver: {
    serverId: '',
    getUrl: '/req',
    postUrl: '/xserver'
  },

  sendServerUrl: '/xserver',
  sendLog: {req:'', resp:''},
  active: false,
  ip: '',
  //loggedIn: false

  syncQue: [], //use it to sync to server
  updateQue: [], //check update from server

  help: {},
  note: []
}



// the $ interface
/*
xb.$ = async function(X) {

  switch (Object.keys(X)[0]) {

    case 'send':
      // xb.$({send:{...}, to:'/xserver'})
      // if 'to' absenses, default is xserver.postUrl

      //valid check
      if (typeof X.send != 'object' || !X.send || !Object.keys(X.send).length) return false

      //start
      if (!X.to) X.to = xb.xserver.postUrl
      let packet = new xb.Packet
      
      let reMsg = xb.makeKey(packet).then(key => {
        //wrap msg
        return xb.enc(
          JSON.stringify(X.send), key
        )

      }).then(wrap => {
        //replace msg with wrap
        packet.msg = wrap
        return

      }).then(() => {
        //certify packet, it updates the 'packet' directly
        return xb.cert(packet)

      }).then(certPacket => {
        xb.sendLog.reqs = certPacket
        
        return fetch(
          X.to,
          { method:  'POST',
            headers: {'Content-Type':'application/json; charset=utf-8'},
            body:     JSON.stringify(certPacket)}

        )

      }).then( re => {
        return re.json() //make it json

      }).then( reObj => {
        //the re now is obj and ready to use now
        xb.sendLog.resp = reObj
        //console.log(reObj)
        
        /*
        xb.cert(re).then(re => {
          console.log(re)
        })*/
/*
        return reObj  //this is responsed packet
      
      }).then(rePkg => {
        return xb.readPacketMsg(rePkg)
      })

      return reMsg  //this is the responsed msg/ obj
      break



    default:
      return false
  }
 
}
*/

// COMMUNICATIONS PART //////////////////////////////////////////

xb.$ = xb.send = async function (dataa='', serverUrl=xb.sendServerUrl, option='') {
  // sends data to server, this case is xserver
  // this is generally used to send the POST message, not GET
  // for the GET just use fetch(url)
  // xb.send({=data=},'/xserver')
  // keeps log in xb.sendLog
  // {=data=} is object only

  //first valid check
  if (!dataa || typeof dataa != 'object' ||  !Object.keys(dataa).length || Array.isArray(dataa) || !serverUrl) return false

  if (!option) {
    option = {
      method: 'POST', //can be 'GET'
      headers: {
        'Content-Type':'application/json; charset=utf-8'
      }
    }
  } else {
    //if option supplied but may not complete, or wrong
    if (typeof option != 'object' || Array.isArray(option)) {
      return false
    }
    if (!option.method) option.method = 'POST'
    if (!option.headers) option.headers = {
      'Content-Type':'application/json; charset=utf-8'
    }
  }

  //start
  let packet = new xb.Packet
  let reMsg = xb.makeKey(packet).then(key => {
    //wrap msg
    return xb.enc(
      JSON.stringify(dataa), key
    )

  }).then(wrap => {
    //replace msg with wrap
    packet.msg = wrap
    return

  }).then(() => {
    //certify packet, it updates the 'packet' directly
    return xb.cert(packet)

  }).then(certPacket => {
    xb.sendLog.req = certPacket
    
    return fetch(
      serverUrl,
      { 
        method:   option.method,
        headers:  option.headers,
        body:     JSON.stringify(certPacket)
      }
    )

  }).then( re => {
    return re.json() //make it json

  }).then( reObj => {
    //the re now is obj and ready to use now
    xb.sendLog.resp = reObj
    return reObj  //this is responsed packet
  
  }).then(rePkg => {
    return xb.readPacketMsg(rePkg)
  })

  return reMsg  //this is the responsed msg/ obj
}


// make the xb.send shorter to xb.$ and use it to send actions to xs
/* now we can do like: xb.$({act:'doSomething'}) and it sends to server */
/*
xb.$ = function (action) {
  // commd like {act:}
  xb.send(action)
}
*/



// CRYPTO PART ///////////////////////////////////////////////////
//-----------crypto-------------------------------------
// default algor = AES-GCM

//1-----------------------------------------
xb.random = function () {
  //re Uint32Array, the random is in the re[0] eg, 3660119685

  const arr = new Uint32Array(1) //1
  return self.crypto.getRandomValues(arr)[0]
}//ok

xb.help.random = {
  about: 'gen random integer, uses self.crypto func.',
  use: 'let num = xb.random()'
}


//2-----------------------------------------
xb.uuid = function () {
  //re standard uuid eg 92798ca1-0bd5-4c32-bb9a-493c9e8050b2

  return self.crypto.randomUUID()
}//ok

xb.help.uuid = {
  about:'gen uuid from self.crypto',
  use:'let v = xb.uuid()'
}


xb.puuid = function (i) {
  // let plainUuid = puuid('08264e6e-ac9c-45f5-ada9-a4b223126065')
  // returns '08264e6eac9c45f5ada9a4b223126065'
  // if we put the puuid in, the output will be back to normal uuid
  // to use the puuid as the html element it's good to put 'x' or a char in prefix to ensure that it always lead by the char, not num.

  if (i && typeof i == 'string') {
    if (i == 'about') return {
      brief:"puuid -- This plain-uuid program is converting normal uuid into a plain one which exludes the - symbol. So we can use it to be an id of the html element more easier.",
      version:'0.1',
      releasedDate:'2024-03-14',
      programmer:'m.me/mutita.org',
      use:`let plainUuid = puuid('<<$uuid>>') ...this returns a plain uuid which is the same but taking out the -. But if you put ... let uuid = (plainUuid) ... you'll get back the normal uuid.`
    }

    if (i.includes('-') && i.length == 36) {
      //covert normal uuid >> plain uuid
      return i.split('-').join('')
    } else if (!i.includes('-') && i.length == 32) {
      //converts puuid >> normal uuid
      let ar = []
      ar.push(i.slice(0,8))
      ar.push(i.slice(8,12))
      ar.push(i.slice(12,16))
      ar.push(i.slice(16,20))
      ar.push(i.slice(20))
      return ar.join('-')
    } else {
      return false
    }

  } else {
    return false
  }

  //tested OK, m2024-03-14 10:56
}

xb.help.puuid = {
  about:'make the plain uuid from uuid input and vise versa. So if you put #PUUID instead it gives the #UUID back. This is good when we work with the html id tag as it not support the - sign. The plain uuid is the just the uuid that has no -.',
  use:'let v = xb.puuid( #UUID | #PUUID )'
}













//3-----------------------------------------
xb.hash = async function (words, algor=256) {
  /*  xs.hash() | .hash(2) | .hash(256) | ...

      #eg  xs.hash('words')   ...this is default = SHA-256'
          xs.hash('words',3)    ...this is SHA-384
      #status: ok
      #testBy: m   
  */

  //make it easier to set the algorithm
  switch (algor) {
    case 1:
      algor = 'SHA-1' //160 bit
      break

    case 2:
      algor = 'SHA-256' //256 bit
      break

    case 384:
      algor = 'SHA-384' //384 bit
      break

    case 3:
      algor = 'SHA-384' 
      break

    case 512:
      algor = 'SHA-512' //512 bit
      break

    case 5:
      algor = 'SHA-512' 
      break

    default:
      algor = 'SHA-256'
  }

  //prep words & hash
  const te = new TextEncoder().encode(words)
  const buffer = await crypto.subtle.digest(algor, te)

  //buffer to hex
  const arr = Array.from(new Uint8Array(buffer))

  const hex = arr.map(
    (b) => b.toString(16).padStart(2,'0')
  ).join('')

  return hex
}//ok

xb.help.hash = {
  about:'hash your text into SHA-1, SHA-256, SHA-384, SHA-512',
  use:'await xb.hash("STRING","ALGORITHM)',
  exam:'let xyz = await xb.hash("thailand") ~gets default SHA-256',
  exam1:'let xyz = await xb.hash("thailand",5) ~gets hash of SHA-512 ; you can put 1,2,3,5 or SHA-1, SHA-256, SHA-384 and SHA-512 respectively to set the algorithm.'
}










//4-------------------------------------------------
xb.cert = async function (packet) {
  //certify the packet
  //20230813 - changed to hash the specific of sequence of fields to fix problem

  let salt = xb.secure.salt? xb.secure.salt : xb.secure.masterSalt

  if (typeof packet.msg != 'string') packet.msg = JSON.stringify(packet.msg)

  if (packet.cert == '') {
    //this is sign work
    packet.cert = await xb.hash(
      packet.from + 
      packet.to +
      packet.msg + 
      packet.id + 
      packet.active + 
      salt
    )

    return packet

  } else {
    //this is verify
    if (typeof packet.msg != 'string') packet.msg = JSON.stringify(packet.msg)

    let check = await xb.hash(
      packet.from + 
      packet.to +
      packet.msg + 
      packet.id + 
      packet.active + 
      salt
    )

    return packet.cert == check? true : false
  }
}









//5-----------------------------------------
xb.genKey = async function (algor='aes') {
  //  xdev.genKey('rsa'|'hmac'|'aes'|'ecdsa')

//RSA-OAEP
  if (algor=='rsa') {
    return await window.crypto.subtle.generateKey(
      {
        name:'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1,0,1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt','decrypt']
    )//ok
  
//HMAC    
  } else if (algor=='hmac') {
    const key = await window.crypto.subtle.generateKey(
      { name:'HMAC', 
        hash:{name:'SHA-256'} //256*|384|512
      },  
      true,
      ['sign','verify']
    )//ok, get 1 key

    key.export = await xb.exportKey(key,'hmac')
    return key
    //ok
  
//ECDSA    
  } else if (algor=='ecdsa') {
    return await crypto.subtle.generateKey(
      { name:'ECDSA', 
        namedCurve:'P-384' 
      },
      true,
      ['sign','verify']
    )//ok
  
//AES-GCM    
  } else if (algor=='aes') {
    //will use this as a default symmetric key
    const key = await crypto.subtle.generateKey(
      { name:'AES-GCM', 
        length:256 
      },
      true,
      ['encrypt','decrypt']
    )

    key.export = await xb.exportKey(key)
    return key
    //ok

  }
  
}

xb.help.genKey = {
  about:'generate key objects for browser use',
  use:'let key = await xb.genKey( #ALGORITHM )',
  exam:'let key = await xb.genKey() ~get default AES-GCM key',
  exam1:'let key = await xb.genKey("rsa")',
  algorithmSupported:'you can put rsa, hmac, ecdsa and aes as the algorithm', 
}










// internal use-----------------------------------
function b64ToBuf(b64) {
  var bi = atob(b64)
  var len = bi.length
  var bytes = new Uint8Array(len)
  for (i=0; i<len; i++) {
    bytes[i] = bi.charCodeAt(i)
  }
  return bytes.buffer
}

function hex2buf(hex) {
  var pairs = hex.match(/[\dA-F]{2}/gi)
  
  var int = pairs.map(s => {
    return parseInt(s,16)
  })

  var arr = new Uint8Array(int)
  //console.log(arr)
  return arr.buffer
}


//6-----------------------------------------
/*xb.enc = async function ( msg, key) {
  //msg must be string or non-object
  //if msg is number, it treats as '123456'
  //if msg is [111,222], treats as '111,222'
  return xb.encrypt( msg, key)
}//ok, make it a little bit shorter
*/


xb.encrypt = xb.enc = async function( msg, key) {
  //AES-GCM

  let key_ = hex2buf(key)
  let keyx = await crypto.subtle.importKey(
    'raw', key_, 'AES-GCM', false, ['encrypt']
  )

  let iv_ = crypto.getRandomValues(new Uint8Array(12))

  let cx = await crypto.subtle.encrypt(
    { name:'AES-GCM',
      iv: iv_,
      //additionalData: ? 
      tagLength: 128
    },
    keyx,
    new TextEncoder().encode(msg)
  )

  return xb.buffer2base64(iv_) + xb.buffer2base64(cx)
}

xb.help.encrypt = {
  about :'encrypts data into base64 by AES-GCM algorithm',
  use   :'xb.encrypt(#WORDS, #KEY)',
  exam  :'let base64Text = await xb.enc("thailand",keyVar)',
  note  :'the key typically use SHA-256 which has 64 hex; You can use xb.encrypt() or xb.enc() for shorter way.'
}





/*
xdev.encrypt = async function (msg, key, cert='', algor='aes') {
  //  xdev.encrypt(msg, key || msg, key, 'aes')
  //  aes default mode is GCM
  //  in aes algor, we put iv after the cipher: cipherrrrrr.ivvvvv so just put the cipher in the decrypt f

  //check msg
  if (typeof msg == 'object') {
    msg = JSON.stringify(msg)
  }
  const msg_ = new TextEncoder().encode(msg)

  //check additional data for GCM
  const cert_ = xdev.utf8ToBuffer(cert)


//RSA-OAEP ---------------------------------------------- 
  if (algor=='rsa') {
    const buffer = await window.crypto.subtle.encrypt(
      { name:'RSA-OAEP' },
      key,
      msg_
    )
  
    return xdev.buffer2base64(buffer) //xdev.buffer2hex(buffer)
    //ok, at msg 6xx characters gets 'uncaugth error', at half size no problem

//AES-GCM ------------------------------------   
  } else if (algor=='aes') {
    //this is default encryption

    //check the key if it's obj or base64, make it obj
    if (typeof key != 'object' && key.match(/^[0-9a-zA-Z+/=]+$/)) {
      // so it is base64 means the exported key
      key = await xdev.importKey(key)
    }

    const iv_ = crypto.getRandomValues(new Uint8Array(12))
    
    const msgx_ = await crypto.subtle.encrypt(
      { name: 'AES-GCM', 
        iv: iv_,
        additionalData: cert_, //this is additional msg to authen
        tagLength: 128
      },
      key, //key obj
      msg_
    )

    //pack output in base64 , separate cipher & iv with .
    const cx = xdev.buffer2base64(msgx_)
    const ivx = xdev.buffer2base64(iv_)

      //if there's additional data added it at the last
      return {  seal: cx + '.' + ivx ,
                cert: cert //AD or AAD
              }   

    //ok, this aes has no problem with msg size 6xx , can encrypt and decrypt back perfectly

    //ok, changed output format, m/20230515
  }//ok

  /*
  changed default to AES-GCM and included the 'addData' into it, tested everything works fine, m/20230514 
  
  made the output like this: [cipher].[iv].[additional data/plaintext] , ok m/

  changed output format to: 
    {cipher:'base64', additionalData: 'plain text'}

  changed to : {seal:[cx.iv], cert:[additional data]}

  */
//}*/


//7-----------------------------------------
xb.buffer2hex = function (buffer) {
  //  xdev.buffer2hex(buffer) ...gets hex code

  //buffer to hex
  const arr = Array.from(new Uint8Array(buffer))

  const hex = arr.map(
    (b) => b.toString(16).padStart(2,'0')
  ).join('')

  return hex    
}//ok



//8-----------------------------------------
xb.buffer2base64 = function (buffer) {
  //  xdev.buffer2base64(buffer) ...gets base64 codes

  const st = String.fromCharCode.apply(
    null,
    new Uint8Array(buffer)
  )
  return window.btoa(st)
}//ok



//9-----------------------------------------
xb.base64ToBuffer = function (base64) {
  //  xdev.base64ToBuffer(base64) ...gets buffer

  return new Uint8Array(
    atob(base64).split('').map(c => c.charCodeAt(0))
  )
}//ok



//10-----------------------------------------
xb.buffer2utf8 = function (buffer) {
  //  xdev.buffer2utf8(buffer) ...gets utf8 codes

  return new TextDecoder('utf-8').decode(
    new Uint8Array(buffer)
  )
}//ok



//////////////////////////////////////////////////////
// xb.base64() -- conversions between base64 and utf8

xb.base64 = function (inputt, mode='encode') {
  if (!inputt) return false 
  if (mode == 'encode' || mode == 'en') {
    return btoa(encodeURIComponent(inputt).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode('0x' + p1)
      }
    ))
  } else if (mode == 'decode' || mode == 'de') {
      return decodeURIComponent(atob(inputt).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
  }
  /*  TEST NOTE
      Tue Apr 23 2024 16:31:34 GMT+0700 (Indochina Time)
      everything fine, /m

      USE
          let base64Char = xb.base64(utf8String, 'encode')
          let utf8Char = xb.base64(base64Char, 'decode')

          *uses 'en' or 'de' as short names for 'encode' and 'decode'
          *if ommit the mode, default is 'encode'

      GUIDE 
          uses this func as main tool to handle base64/utf8 conversion
  */
}


xb.help.base64 = {
  about :'conversion utf8 to base64 and vise versa',
  use   :'xb.base64( $BASE64_UTF, "$NULL|en|encode|de|decode" )',
  exam  :'let b64 = xb.base64("thailand") ==> get base64 code',
  exam1 :'let utf8 = xb.base64("dGhhaWxhbmQ=", "de") ==> get utf8',
  note  :'default option is encode. When you want to decode base64 back to utf8 you put like xb.base64($INPUT, "de")',
  test  :'ok',
  by    :'@nex-era'
}




//11------------------------------------------------------
/*xb.dec = async function (cx, key) {
  return xb.decrypt(cx, key)
}*/


xb.decrypt = xb.dec = async function (cx, key) {
  /**
   * the input cx has format: [iv(16)][msgx][tag(16)]
   */

  let cx_ = b64ToBuf(cx)
  let cx2_ = new Uint8Array(cx_)
  let iv_ = cx2_.subarray(0,12)
  let msgx_ = cx2_.subarray(12)

  let key_ = hex2buf(key)
  let keyx = await crypto.subtle.importKey(
    'raw', key_, 'AES-GCM', false, ['decrypt']
  )

  let msg_ = await crypto.subtle.decrypt(
    {name:'AES-GCM', iv: iv_}, keyx, msgx_
  )

  return new TextDecoder().decode(msg_)
}

xb.help.decrypt = {
  about:'decrypts base64 encrypted string back to its original utf-8 plain text',
  use:'let plainText = await decrypt(#BASE64_STRING, #KEY)',
  exam:'let plainText = await dec(???, keyVar)',
  note:'the key ususally the SHA-256 hex; You can use both xb.decrypt() or xb.dec()'
}










/*
xdev.decrypt = async function (seal, key, cert='', algor='aes') {
  //  xdev.decrypt(cipher, key | cipher, key, 'aes')
  //  for aes the iv is already attached in the cipher codes so don't need to do anything about it


  if (typeof seal != 'string') return 'ERROR! wrong input'

  if (algor=='rsa') algor = 'RSA-OAEP'
  if (algor=='aes') algor = 'AES-GCM'





//RSA-OAEP --------------------------------------
  if (algor=='RSA-OAEP') {
    const cipher_ = xdev.base64ToBuffer(cipher)

    const deci = await window.crypto.subtle.decrypt(
      {name: algor},
      key, //priKey ...key obj
      cipher_
    )

    //if output is json, make it object
    const words = xdev.buffer2utf8(deci)
    try {
      return JSON.parse(words)
    } catch {
      return words
    }//should be ok as tested on the aes done
    //ok, 


//AES-GCM* -----------------------------   
  } else if (algor=='AES-GCM') {
    //this is default decryption

    //check the key if its obj or base64, make to key obj
    if (typeof key != 'object' && key.match(/^[0-9a-zA-Z/+=]+$/)) {
      //this is base64 exported key, so make it key obj
      key = await xdev.importKey(key)
    }//out of this assumes it is key obj

    //separate the cipher
    const block = seal.split('.')
    const msgx = block[0]
    const ivx = block[1]


    //put cipher & iv to buffers
    const msgx_ = xdev.base64ToBuffer(msgx)
    const ivx_ = xdev.base64ToBuffer(ivx)
    const cert_ = xdev.utf8ToBuffer(cert)
    

    const msg_ = await crypto.subtle.decrypt(
      { name: algor, 
        iv: ivx_ ,
        additionalData: cert_,
        tagLength: 128
      },
      key, //...key obj
      msgx_
    )

    //if json convert to x
    const msgOk = xdev.buffer2utf8(msg_)

    return {
      msg: msgOk,
      cert: cert
    }
   
    //ok, changed output format , m/20230515
  }

  /*
  make the AES-GCM default and include the 'addData', tested all OK, m/20230514 
  
  tested the [cipher].[iv].[additional data] decryption ok, m/

  changed output of enc to {cipher: ,additionalData: } and output of the dec is just returning the decipher, that's it. m/
  */

//}//ok



//12-----------------------------------------
xb.exportKey = async function(key, format='aes') {
  //  xdev.exportKey(key, 'priKey'|'pubKey'|'raw')
  //  output is base64

  if (key && format) {
    if (format=='priKey') format = 'pkcs8'
    if (format=='pubKey') format = 'spki'
    //for jwk just put 'jwk' at the format
    //for AES , put 'raw' at the format
    if (format.match(/aes|hmac/)) format = 'raw'

    const key_ = await window.crypto.subtle.exportKey(
      format,
      key
    )

    return xb.buffer2base64(key_) //don't put the PEM wrapper  
  
  } else {
    return 'ERROR! wrong input'
  }

  
}//ok for pri & pub keys, now doing for jwk


xb.help.exportKey = {
  about:'exports key from js object to base64 so can be used other places',
  use:'let b64 = await xb.exportKey(#KEY_OBJECT),#FORMAT',
  exam:'let b64 = await xb.exportKey(keyVar) ~default format is aes',
  note:'format can be priKey,pubKey,aes,hmac'
}



//13-----------------------------------------
xb.importKey = async function(key,format='aes') {
  //  xdev.importKey(key || key,'pubKey'|'aes'|'raw')  

  //get the base64 in and convert into a buffer
  const bi = window.atob(key)
  const buffer = new ArrayBuffer(bi.length)
  const view = new Uint8Array(buffer)

  for (i=0; i < bi.length; i++) {
    view[i] = bi.charCodeAt(i)
  }

  //now buffer is ready to use

//RSA-OAEP PKCS8 ----------------------------- 
  if (format=='priKey') { // ! needs revise
    return window.crypto.subtle.importKey(
      'pkcs8',
      buffer,
      { name:'RSA-OAEP', hash:'SHA-256' }, //changed from RSA-PSS
      true,
      ['decrypt'] //changed from sign
    )//ok
  
//RSA-OAEP SPKI ---------------------------   
  } else if (format=='pubKey') {
    return window.crypto.subtle.importKey(
      'spki',
      buffer,
      { name:'RSA-OAEP', hash:'SHA-256' },
      true,
      ['encrypt']
    )//ok
  
//AES-GCM* ------------------------------------------   
  } else if (format.match(/aes/)) { //cut raw out
    return crypto.subtle.importKey(
      'raw',
      buffer,
      'AES-GCM',
      true,
      ['encrypt','decrypt']
    )//ok
  
//HMAC -------------------------------   
  } else if (format=='hmac') {
    return crypto.subtle.importKey(
      'raw',
      buffer,
      {name:'HMAC', hash:'SHA-256'}, //256|384|512
      true,
      ['sign','verify']
    )
  }
}

xb.help.importKey = {
  about:'imports base64 key into js key object so can use in browser',
  use:'let jsKey = await xb.importKey(#BASE64_KEY, #FORMAT)',
  exam:'let key = await xb.importKey(b64Var) ~default format is aes',
  note:'format can be aes, priKey, pubKey, hmac'
}






//14----------------------------------------------
xb.sign = async function (msg, key, algor='hmac') {
  // take HMAC is the default sign algorithm

  //check the msg
  if (typeof msg == 'object') {
    msg = JSON.stringify(msg)
  }
  const msg_ = new TextEncoder().encode(msg)

//ECDSA  
  if (algor=='ecdsa') {
    const buffer = await crypto.subtle.sign(
      { name:'ECDSA', hash:{name:'SHA-384'} },
      key,
      msg_
    )
  
    return xb.buffer2base64(buffer)
    //ok

//HMAC    
  } else if (algor=='hmac') {
    //this is default for signing

    //if key not obj make it obj
    try {
      if (key.match(/^[0-9a-zA-Z/=+]+$/)) {
        //the key is the exported one not obj
        key = await xb.importKey(key,'hmac')
      }
    } catch {
      //the key is obj
    }
    

    const buffer = await crypto.subtle.sign(
      'HMAC',
      key,
      msg_
    )

    //return xdev.buffer2base64(buffer)
    return xb.buffer2hex(buffer)
    //ok
  }
}

xb.help.sign = {
  about:'sign message and give hex as signature',
  use:'await xb.sign(#MESSAGE, #KEY, #ALGORITHM)',
  exam:'let signature = await xb.sign("thailand", keyVar) ~default algor is hmac',
  note:'algor you can put ecdsa, hmac. Hmac is default.'
}











//15-------------------------------------------------
xb.verify = async function (msg, signature, key, algor='hmac') {
  // HMAC is default verify algor
  //const msg_ = new TextEncoder().encode(msg)

  //check msg
  if (typeof msg == 'object') {
    msg = JSON.stringify(msg)
  }

//ECDSA  
  if (algor=='ecdsa') {
    return await crypto.subtle.verify(
      { name:'ECDSA', hash:{name:'SHA-384'} },
      key,
      xb.base64ToBuffer(signature),
      new TextEncoder().encode(msg)
    )
    //ok

//HMAC    
  } else if (algor=='hmac') {
    //default for verifying

    //check key if not obj, make it obj
    try {
      if (key.match(/^[0-9a-zA-Z/+=]+$/)) {
        //it's base64
        key = await xb.importKey(key,'hmac')
      }
    } catch {
      //it's not base64, assumes the correct key
    }
    

    return await crypto.subtle.verify(
      'HMAC',
      key,
      //xdev.base64ToBuffer(signature),
      hex2buf(signature),
      new TextEncoder().encode(msg)
    )
    //ok

  }
}


xb.help.verify = {
  about:'verify message & signature then return true if passed, false for failing',
  use:'await xb.verify(#MESSAGE, #SIGNATURE, #KEY, #ALGORITHM)',
  exam:'let passed = await xb.verify("thailand", sigVar, keyVar) ~default algorithm is hmac',
  note:'algorithm can be hmac, ecdsa'
}













//16----------------------------------------------------------
/*
xs.uuidx = function() {
  //gen special uuid which is simply a timestamp but no dup
  //to prevent dup, we take t2 not t1
  let t1 = t2 = Date.now()
  while (t2 == t1) { t2 = Date.now()}
  return t2
}//ok
*/

xb.uuidx = function() {
  // xdev.uuidx() ...get unique timestamp

  let t0 = Date.now()
  let t1 = Date.now()
  
  while (t1==t0) {
    t1 = Date.now()
  }

  let coding = t1.toString() 
  let id = coding.slice(0,-5) + '-' + coding.slice(-5)
  return id
  //output like: '16860282-70442' makes it easier to check by eyes
}//ok, m/20230606



//17---------------------------------------------
xb.utf8ToBuffer = function (msg) {
  return new TextEncoder().encode(msg)
}//ok



//18---------------------------------------------
xb.passKey = async function (passHash) {
  //generate AES-GCM key from a password, this key will be unexactable, and should be destroyed at unnecessarily.

  //key material
  const passHash_ = new TextEncoder().encode(passHash)
  const keyMat = await crypto.subtle.importKey(
    'raw',
    passHash_,
    'PBKDF2',
    false,
    ['deriveBits','deriveKey']
  )

  //key
  return crypto.subtle.deriveKey(
    { name:'PBKDF2',
      salt: xb.utf8ToBuffer('xTKrg5fX-9l_'), //fix this
      iterations: 100000,
      hash:'SHA-256'  
    },
    keyMat,
    {name:'AES-GCM', length:256},
    false, //true,
    ['encrypt','decrypt']
  )
  /*
    this f should take the hash-of-password as input and then produce the password-key. The key can be produce multiple time, as long as the password is corrected, then it can enc/dec same results.
  */
}//ok



//19----------------------------------------------
xb.promptKey = async function () {
  //gen an AES-GCM key from user prompt's password

  return await xb.passKey(
    await xb.hash(
      prompt('password:')
    )
  )
}//ok


//20------------------------------------------------
xb.promptHash = async function () {
  //prompt to get words and gen hash from it

  return xb.hash(
    prompt('words:')
  )
}

xb.help.promptHash = {
  about : 'show prompt and give hash from text you put in',
  use   : 'xb.promptHash( $USER_TEXT )',
  exam  : 'let h = await xb.promptHash()'
}




//21------------------------------------------------
//randomW is a random code tha containing only a-zA-Z nothing else
xb.randomWords = function (length=16) {
  //gen a js var style code contains only a-zA-Z

  let words = ''
  let allowedStrings = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (i=0; i<length; i++) {
    words += allowedStrings.charAt(
      Math.floor(
        Math.random() * 52
      )
    )
  }
  return words
}//ok


xb.random2 = function (length=24) {
  //gen a random code which includes a-z, A-Z, 0-9, - and _

  let words = ''
  let allowedStrings = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (i=0; i<length; i++) {
    words += allowedStrings.charAt(
      Math.floor(
        Math.random() * 62
      )
    )
  }
  return words
}




xb.help.randomWords = {
  about:'gen random words a-z and A-Z, default length is 16',
  use:'xb.randomWords( #LENGTH )',
  exam:'let code = xb.randomWords() or xb.randomWords(20)',
  note:'you can put any length'
}


//22--------------------------------------------
xb.password = function (length=12) {
  //gen random password from 92 characters

  let pass = ''
  for (i=0; i<length; i++) {
    pass += `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$!~-+-*/\|&%#@^.,:;<>(){}[]`.charAt(
      Math.floor(
        Math.random() * 89
      )
    )
  }
  return pass
}//ok

xb.help.password = {
  about:'gen password, default length is 12. The password contains wordly & symbols',
  use:'xb.password(#LENGTH)',
  exam:'let pwd = xb.password()'
}


xb.pin = function (length=8) {
  //gen random pin from A-Z and 0-9, default length is 8

  let pin = ''
  for (i=0; i<length; i++) {
    pin += `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`.charAt(
      Math.floor(
        Math.random() * 36
      )
    )
  }
  return pin
}//ok m2309280824

xb.help.pin = {
  about:'gen pin containing A-Z & 0-9, default length is 8, all capital',
  use:'xb.pin(#LENGTH)'
}





xb.xDateCode = function (vari) {
  //output is M 20-9-28 10:45
  //use with xb.pin() we can have code like: #ABXYS45F TH 23-9-28
  //to use in mobile screen which we need as short as possible to show code or something
  /* input can have 3 options
      1. put the date string like new Date().toString() - string
      2. put the timestamp, Date.now() - number type
      3. just blank it, it will take the time it runs */

  var newDate

  if (typeof vari == 'string') {
    newDate = vari
  } else if (typeof vari == 'number') {
    newDate = new Date(vari).toString()
  } else {
    newDate = new Date()
  }


  const mon = {
    jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12
  }

  let ar = newDate.toString().split(' ')
  let reformat = 
    ar[0].toUpperCase() + ' ' +          //day of week
    ar[3].slice(2) + '-' +            //year
    mon[ar[1].toLowerCase()] + '-' +  //month 
    ar[2] + ' ' +                     //date
    ar[4].slice(0,5)                  //time

  return reformat
  //tested ok, m2309281216
}







///////////////////////////////////////////////////////
//23---------------------------------------------
xb.vaultAdd = async function (x) {
  /**
   * xs.vaultAdd() v0.1 m20230613
   * 
   * This func creates and encrypted message from user's input and put in the xs.vault . After that user can get data back by using the xs.vaultGet(). These 2 func will prompt for password to use for encrypt/decrypt. User can continue to add more secret data into it and retrieve when she needs, by supplying the correct password.
   * 
   * xs.vaultAdd({name:'john', label:value, label:value, ...})
   * 
   * #devnote
   * - fixed bug on block 2: not work for number value, now fixed. 
   * - changed returning error to obj-based
   * m20230613
   *  
   */

  //check input must be obj and not blank, not array
  if (!x || typeof x != 'object' || !Object.keys(x).length
    || Array.isArray(x)) return {
      
      func:'xb.vaultAdd()',
      success: false,
      msg:"wrong input"
    }

  //reject if found any empty label 
  for (label in x) {
    if (x[label] == '') return {
      
        func:'xb.vaultAdd()', 
        success: false, 
        msg:"wrong label"
      }  
  }


  //get labels

  if (Object.keys(x).length > 1) {
    //has several labels-----------------------

    if (!xb.vault) {
      //firstly add
      xb.vault = await xb.enc(
        JSON.stringify(x), 
        await xb.promptHash() //prompt for pass and then hash it
      )

    } else {
      //more add if the xs.vault already exist

      let key = await xb.promptHash() //prompt for pass
      let gold = JSON.parse(
        await xb.dec(xb.vault, key)
      ) 

      for (label in x) {
        if (label in gold) {
          //this is dup, just skip
          console.log(`ERROR/vaultAdd: lebel '${label}' is already existed, skipped`)
        } else {
          gold[label] = x[label]
        }
      }

      xb.vault = await xb.enc(
        JSON.stringify(gold), 
        key
      )
    }

    

  } else {
    //has only 1 label-------------------------
     
    //if vault not already existed
    if (!xb.vault) {

      //firstly add
      xb.vault = await xb.enc(
        JSON.stringify(x),  
        await xb.promptHash()
      )

    } else {
      //if vault already existed
      let key = await xb.promptHash()
      
      let gold = JSON.parse(
        await xb.dec(xb.vault, key)
      ) 
      let label = Object.keys(x)

      if (label in gold) {
        //dup
        return {
          func:'xb.vaultAdd()',
          success: false,
          msg:'label already existed, skipped'
        }

      } else {
        //label not duplicated
        gold[label] = x[label]

        xb.vault = await xb.enc(
          JSON.stringify(gold), 
          key
        )
      }
    }
  }
 
}//ok



//24----------------------------------------------
xb.vaultGet = async function (label) {
  /**
   * xs.vaultGet() v0.1
   * 
   * This func gets data that encrypted by the xs.vaultAdd() and then prompt for the user's password. If password correct it returns the data of the label the user supplied.
   * 
   *  xs.vaultGet('label')
   * 
   *  label is the key of data that added by the func xs.vaultAdd()
   * 
   * #devnote
   * - finished some codes, change error to obj-base, tested. m20230613
   */

  if (!label || typeof label != 'string') return {
    func:'xb.vaultGet()',
    success: false,
    msg:'wrong input, nothing done'
  }

  let gold = JSON.parse(
    await xb.dec( 
      xb.vault, 
      await xb.promptHash()
    )
  ) 
  
  if (label in gold) {
    return gold[label]
  } else {
    return {
      func:'xb.vaultGet()',
      success: false,
      msg:'wrong label'
    } 
  }
}//ok

/* vault
everything should be fine. The vaultAdd() validates for no empty input as well as the empty labels. The duplicate label also not allowed.

can put the sophisticated obj in, and the f keeps right there in the vault. When do vaultGet() just get it back perfectly.

m/20230509

*/





// LOCAL DB ////////////////////////////////////////////////////////
//25----------------------------------------------
/* if put {people: {...} }   the people is the collection
 */
xb.db = function (x) {
  /**
   * xs.db() v0.1 20230613
   * 
   * This is very simple database utilizing the browser's localStorage to store data. It behaves like a data base so you can read and write data into it.
   * 
   * #sample
   *    
   *    xs.db()   ...this is the read of the whole db
   *    xs.db().goods   ...read and select for the 'goods' collection
   *    xs.db( {collection:{...}} )   ...this creates new collection and inserts obj data into it
   * 
   * 
   * #devnote
   * - review codes m20230613
   * 
   *  
   */

  var db = {} //this is main db v name

  if (x) {
    //add mode

    //admin works------------------------------------------
    if (Object.keys(x)[0].match(/^_\w+$/)) {
    
      let cmd = Object.keys(x)[0]

      if (cmd == '_delete') {
        // {_delete:'people'}  ..delete collection
        // {_delete:} 
        db = read()

        if (typeof x._delete == 'string') {
          //delete col
          delete db[x._delete]
          write()

        } else if (typeof x._delete == 'object') {
          //delete doc, eg {_delete:{ people:{name:'mutita'} }}
          let colName = Object.keys(x._delete)[0] //people
          let docKey = Object.keys(x._delete[colName])[0] //name

          let index = db[colName].findIndex(r => r[docKey] == x._delete[colName][docKey])

          db[colName].splice(index,1)
          write()

        } else {
          return 'invalid input'
        }
      }//ok



    } else {
      //non admin-----------------------------------------

      if (!dbExist() ) {
        //new db
  
        //let db = {}
        
        for (col in x) {
          db[col] = []
  
          if (Array.isArray(x[col])) { //many docs
  
            for (doc of x[col]) {
              doc._id = xb.uuidx() //assign id to each doc
              db[col].push(doc)
            }
  
          } else { //1 doc
            x[col]._id = xb.uuidx()
            db[col].push(x[col]) 
          }
        }
    
        write()
      
      } else {
        //existing db
        //x = {people: {name:'   ', ...}}    add 1 doc
        //x = {people: [{...},{...}, ...]}   add many docs 
        db = read()
  
        for (col in x) {
          if (col in db) {
            //already have this collection in the db, push new
  
            if (Array.isArray( x[col] )) {
              //add many docs to existing col
              for (doc of x[col]) {
                doc._id = xb.uuidx()
                db[col].push(doc) //push into existing col
              } 
  
            } else {
              //add 1 doc to existing col
              x[col]._id = xb.uuidx()
              db[col].push( x[col] )
            }
  
          } else {
            //new col
            db[col] = []
  
            if (Array.isArray( x[col] )) {
              //newly add many docs
  
              for (doc of x[col]) {
                doc._id = xb.uuidx()
                db[col].push(doc)
              }
  
            } else {
              //newly add 1 doc
              x[col]._id = xb.uuidx()
              db[col].push(x[col]) //make it in a
            }
          }
        }
        write()
      }


    }

    


  } else {
    //read mode-------------------------------------
    return read()
  }

  
  //helper func--------------------------
  function read() {
    return JSON.parse(
      localStorage.getItem('xdev_db')
    )
  }

  function write() {
    localStorage.setItem(
      'xdev_db',
      JSON.stringify(db) 
    )
  }

  function dbExist() {
    return localStorage.getItem('xdev_db')
  }


}




///////////////////////////////////////////////////////
//26--------------------------------------------------
xb.atime = function (same='hour') {

  let t = new Date()
  let y = t.getFullYear()
  let m = t.getMonth() >= 10 ? t.getMonth() : '0'+t.getMonth()
  let d = t.getDate() >= 10 ? t.getDate() : '0'+t.getDate()
  let hour = t.getHours() >= 10 ? t.getHours() : '0'+t.getHours()
  let min = t.getMinutes() >= 10 ? t.getMinutes() : '0'+t.getMinutes()

  let tcode = 0

  switch (same) {
    case 'min':
      tcode = Date.parse(`${y}-${m}-${d}t${hour}:${min}`)
      break

    case 'hour':
      tcode = Date.parse(`${y}-${m}-${d}t${hour}:00`)
      break

    case 'day':
      tcode = Date.parse(`${y}-${m}-${d}`)
      break

    case 'week':
      d = t.getDate() - t.getDay()
      d = d >= 10 ? d : '0'+d
      tcode = Date.parse(`${y}-${m}-${d}`) //sunday

    case 'month':
      tcode = Date.parse(`${y}-${m}`)
      break

    case 'year':
      tcode = Date.parse(`${y}`)
      break

    default:
      return 'wrong input'
  }

  return tcode
  

}



//27--------------------------------------------------
xb.acode = async function (t=24) {
  //this is another simple kind of certifying an html doc

  switch (t) {
    case 60:
      t = 'min'
      break

    case 24:
      t = 'hour'
      break

    case 31:
      t = 'day'
      break

    case 7:
      t = 'week'
      break

    case 12:
      t = 'month'
      break

    case 365:
      t = 'year'
      break

    default:
      t = 'hour' //or 24
  }

  return await xb.hash(
    document.body + xb.atime(t)
  )
}


///////////////////////////////////////////////////////
/*
xb.talk = async function (msg) {
  //send packet to xserver & get response
  //put the msg needed to send to xserver in this func and then it will create a packet for it, wrap, cert and then send out to the xserver.
  //keeps log in xb.talkLog 
  //msg must be obj
  
  if (!msg || !Object.keys(msg).length) {
    return false
  }

  let packet = new xb.Packet
  
  if (xb.active) {
    packet.state = 'active'
    //this case the xb.xserver.serverId should exist
  } else {
    packet.state = 'register'
    //serverId inexists
  }

  packet.msg = JSON.stringify(packet.msg)
  packet.msg = await xb.enc(
    packet.msg, 
    await xb.makeKey(packet)
  )
  
  packet.cert = await xb.cert(packet)
  xb.talkLog.reqs = packet

  let re = await fetch(
    xb.xserver.postUrl,
    {
      method:   'POST',
      headers:  {'Content-Type':'application/json; charset=utf-8'},
      body:      JSON.stringify(packet)
    }
  
  ).then( re => {
    return re.json() //make it json
  }).then( re => {
    //the re now is obj and ready to use now
    xb.talkLog.resp = re
    return re
  })

}






//28------------------------------------------
/*
xb.send = function (value, urlToSendTo=xb.xserver.postUrl) {
  //seal the data and wrap it and send to the server
  /**
   * xs.send() -- wraps obj and send to xserver in POST method. When get response from the xserver, it unwraps then return the msg out to the caller.
   * 
   * #use     let re = xs.send({...})
   * #test    OK, m20230628 
   * #note    use Promise inside the f to easier returning output
   * #staff   M
   */
/*
  return new Promise((resolve,reject) => {

    //A - check server post url
    if (urlToSendTo == '') {
      reject(
        {from:'xb.send()',
        success: false,
        msg:'Wrong input.'}
      ) 
    }

    //log
    xb.sendLog.req = value 
    xb.sendLog.resp = '' //reset the value of resp 


    //convert, wrap
    if (typeof value == 'object') value = JSON.stringify(value)
    
    xb.wrap(value).then(wrapped => {

      fetch(
        urlToSendTo,
        {
          method:   'POST',
          headers:  {'Content-Type':'application/json; charset=utf-8'},
          body:      JSON.stringify(wrapped)
        }
      
      ).then( re => {
        //console.log(resp) //resp obj
        return re.json() //make it json
      
      }).then( re => {
        //work on the resp here
        //xs._send.resp = resp
  
        if (re.wrap) {
  
          //XBROWSER.sendLog.resp = re
  
          xb.unwrap(re).then(msg => {
            //console.log(msg)
            xb.sendLog.resp = msg 
  
            if (msg.msg && msg.from) {
              //this is resp from xs.$set command
  
              alert(`Msg: ${msg.msg}\nFrom: ${msg.from}\nid: ${msg.id}\nTime: ${msg.time}`)
            
            } else {
              //this is resp from xs.$get command
              console.log("Got data from the server.")
            }
  
            resolve(msg)  //unwrapped msg
          })
  
  
        } else {
          xb.sendLog.resp = re 
          //if not wrap just put it in
          resolve(re) 
        }
  
      })/*.catch(
        reject({
          msg:      "Fail sending.",
          success:  false,
          from:     'xs.send()'
        })
      )*/
/*
    })

  })//promise block 
  
}//ok /m 20230512 
*/


/*
xb.send2 = async function (value) {
  /**
   * func: xs.send2() 
   * for: enhancing from xs.send() to include some data wrapping & encryption inside it.
   * staff: M
   * created: 20230615
   * 
   * #use
   *      xs.send2(formEl | any value)
   *      xs.send2(form1) 
   */
/*
  if (value instanceof HTMLFormElement) {
    let formx = xb.readForm2(value)

    let cipher = await xb.$({
      encrypt: JSON.stringify(formx),
      key:     XBROWSER.security.key
    })

    xb.send({wrap: cipher})

  }
} 
*/

/*
xb.wrap = async function(msg, key) {
  //wrap the packet.msg before sending to xserver
  //msg must be string
  //returns base64
  //#tested ok, m20230616

  if (!msg || !key) return false
  return await xb.enc(msg, key)
}


xb.unwrap = async function(wrappedMsg, key) {
  //unwrap wrapped-data
  //let uw = await xs.unwrap(wrapObj)
  //return data before wrapping, if it's obj it gives you obj
  //#tested ok, m20230616

  if (!wrappedMsg || !key) return false
  return await xb.dec(wrappedMsg, key)
}
*/




// OTHER PART ///////////////////////////////////////////////////


xb.isJson = function(sample) {
  //test if the sample Json or not, if yes returns true, not returns false
  //let check = xs.isJson(aVar)
  //#tested ok, m20230616

  try {
    let check = JSON.parse(sample)
    if (typeof check == 'object') return true 
    else return false 
  } catch {
    return false
  }
}

xb.help.isJson = {
  about:'check if it json',
  use:'xb.isJson(#INPUT)'
}



xb.isHex = function (sample) {
  //check if the input hex or not, returning true or false
  //#tested ok, m20230616

  if (typeof sample == 'string') {
    if (sample.match(/^[0-9a-f]+$/i)) {
      return true
    } else {
      return false 
    }

  } else {
    return false 
  }
}


xb.help.isHex = {
  about:'check if it is hex',
  use:'xb.isHex(#INPUT)'
}







/*
//29-----------------------------------------------------
xb.readForm = function (formid) {
  // v0.5 --read form's input then return x of all filled data

  //make it smarter by auto recog all input of the form, so just put the formid to this func and it does the rest
  /* 
    use:
      onclick="readForm2('#formid').then(obj => console.log(obj)"
  */ 
/*
  let formEl = document.querySelector(formid)
  let allinputs = formEl.elements 
  let outputObj = {}

  for (i = 0 ; i < allinputs.length ; i++) {

    if (allinputs[i].type == 'radio') { 
      
      if (allinputs[i-1].type != 'radio') { //if same, skip
        outputObj[ allinputs[i].name ] = 
          formEl[ allinputs[i].name ].value + validCheck()
      }

    } else if (allinputs[i].type == 'checkbox') {
      
      if (allinputs[i].checked) {

        if (outputObj[ allinputs[i].name ] == '' || 
            outputObj[ allinputs[i].name ] == undefined) 
        {
          outputObj[ allinputs[i].name ] = 
            allinputs[i].value 
        } else {
          outputObj[ allinputs[i].name ] += ',' + allinputs[i].value 
        }

      } else {
        //unchecked
        if (outputObj[ allinputs[i].name ] == undefined) {
          outputObj[ allinputs[i].name ] = ''
        }
      }
    } else {
      //this for ther types
      outputObj[ allinputs[i].name ] =   
        allinputs[i].value + validCheck()
    }
   
    function validCheck() {
      if (allinputs[i].hasAttribute('_invalid'))
        return '<invalid=' + allinputs[i].getAttribute('_invalid') + '>'
      else 
        return ''
    }
  }
  //console.log(outputObj)
  outputObj._valid = true 
  for (i of allinputs) {
    if (i.hasAttribute('_invalid')) {
      outputObj._valid = false  
    } 
  }

  return outputObj


  //done
  //done, added ...<invalid=.....> to each field that still be invalid, and put property _invalid:true into the outputObj
  //changed that every output from readForm2() will have _valid prop that contaning true or false so that further program can check its validity.


}//ok, m/20230512


/*
xb.readForm2 = function (el_s, validRule={}, noticeStyle='1px solid orange') {
  /**
   * xs.readForm2() upgrade the xs.readForm() 
   * version: 0.1
   * mutita.org@gmail.com
   * 
   * #input
   * @param {HTMLElement | string} el_s - element of the form 
   *    can be both el & string
   *    if it's html element, the func just take it
   *    if it's string, the func will use it to search for the el
   * 
   * @param {object} validRule - put the validation rule
   *    can be from the form ele's _validRule , or an obj
   *    noticeStyle is set with default but can be changed
   * 
   * #output
   *    {field1:--, field2:--, ...}
   *    if there's invalid will get ... name:'<invalid>' and the property outputObject._invalid:true will also added
   * 
   * #use
   *    xs.readForm2( document.querySelector('form') )
   *    xs.readForm2('#formid')
   * 
   * #devnote
   *    -tested ok, 
   *    -put the else block in work() to read all type el in the form and just put strait el.value. May need watching on this do we need to specify the type of input to work more rather than the radio, checkbox, submit? 
   * 
   * #bug
   *    -fixed wrong reading of radio, done /m20230614
   * 
   * #lastUpdate: 20230614.0809
   * #staff: M
   * 
   */
/*
  //init
  let outputx = {}

  //check input
  if (el_s instanceof HTMLFormElement) {
    //this is the ready el, just take it
    return work(el_s)     

  } else if (typeof el_s == 'string') {
    //this is string, so need to find the el first
    el_s = document.querySelector(el_s)
    return work(el_s)

  } else {

    let re = {
      func:'xb.readForm2',
      success: false,
      msg:'wrong input, must be string or html element'
    }

    XBROWSER.readFormLog = re //keep in log ...!not work
    return re
  }


  /**
   * Helps the xs.readForm2 to get value from the form.
   * @param {string | HTMLElement} el 
   * @returns {object} - containing form data as properties
   * @version 0.1
   * @author M 
   * @time 20230702.1116
   * @test OK, but working on enhancement
   */
  /*
  function work(el) {
    //get value from the input 'el' and put in 'outputx'

    if (Object.keys(validRule) == '' ) {
      eval('validRule =' + el.getAttribute('_validRule') )
      //if no user's validRule, get it from attribute, if both are none just keep it right there (output will be true if no rule)
    }

    if (validRule == null) validRule = {}


    for (e of el) { //loop form ele

      if (e.type == 'textarea') {
        outputx[e.name] = e.value

        if ( xb.validate(outputx[e.name], validRule[e.name]) ) {
          //pass
          if (e.style.border == noticeStyle) e.style.border = ''
        } else {
          //invalid
          outputx[e.name] += '<invalid>'
          e.style.border = noticeStyle
          outputx._invalid = true 
        }
      }  

      else if (e.type == 'radio') {
        if (e.name in outputx) {
          //skip if already get into the output
        } else {
          outputx[e.name] = el[e.name].value
          //this call get the: el.nameOfinput.value

          if ( xb.validate(outputx[e.name], validRule[e.name]) ) {
            //pass
            if (e.parentElement.tagName == 'DIV' && e.parentElement.hasAttribute('_input-frame')) {
              //there's a div box so we can give notice
              e.parentElement.style.border = '' //reset if any
            }

          } else {
            //invalid
            if (e.parentElement.tagName == 'DIV' && e.parentElement.hasAttribute('_input-frame')) {
              outputx[e.name] = '<invalid>' 
              e.parentElement.style.border = noticeStyle
              outputx._invalid = true
            }
             
          }
        }
      }//ok  
      
      else if (e.type == 'checkbox') {

        if (e.name in outputx) {
          if (e.checked) outputx[e.name].push(e.value)
          //this is existing checkbox name, so just add to the end
        } else {
          if (e.checked) {
            outputx[e.name] = [e.value]
          } else {
            outputx[e.name] = [] //put blank in
          }
          //this is new checkbox name
        }

        //check value in the checkbox
        let lastIndexOfCheckbox = el[e.name].length -1 

        if (e.value == el[e.name][lastIndexOfCheckbox].value) {
          //this is last ele of the checkbox group
          if ( xb.validate(outputx[e.name], validRule[e.name]) ) {
            //valid
            if (e.parentElement.tagName == 'DIV' && e.parentElement.hasAttribute('_input-frame')) {
              e.parentElement.style.border = ''
            }

          } else {
            //invalid
            if (e.parentElement.tagName == 'DIV' && e.parentElement.hasAttribute('_input-frame')) {
              outputx[e.name] = '<invalid'
              e.parentElement.style.border = noticeStyle
              outputx._invalid = true 
            }

          }
        }
      }

      else if (e.type == 'submit') {} //don't do thing

      else {
        //for all the rest of input types
        //the <select> is also in this block

        if (!e.disabled) { //if not disabled
          outputx[e.name] = e.value 

          if ( xb.validate(outputx[e.name], validRule[e.name]) ) {
            //pass
            if (e.style.border == noticeStyle) e.style.border = ''           
          } else {
            //invalid
            outputx[e.name] += '<invalid>'
            e.style.border = noticeStyle
            outputx._invalid = true
          }
        }
      }

    }
    return outputx

  }
}


*/



//30-----------------------------------------
xb.jsonify = function (x) {
  /**
   * make little shorter of the JSON.stringify()
   */

  if (typeof x != 'object') return false 
  return JSON.stringify(x)
}


//31-----------------------------------------
xb.jparse = function (j) {
  /**
   * little shorter JSON.parse()
   */

  try {
    let read = JSON.parse(j)
    if (typeof read == 'object') return read 
    else return false 
  } catch {
    return false 
  }
}

/**
 * xs.showData - show data in object or array to html elements.
 * @param {object} data - {name: ,age: ,sex: , ...}
 * @param {HTMLElement} toElement - table, ol, ul, select, ...
 * @param {object} opt - {tableHeader:'Name Age Sex'}
 * @returns html element that shows the input data
 * @version 0.1
 * @author M 
 * @tested OK m20230702.1722
 */
xb.showData = async function (data, toElement, opt) {
  /**
   * xs.showData() -- takes data in array or obj or any format and show it in the specified html element.
   * 
   * #test  OK for table now m-20230628.2245
   * #note  -auto make table header is done but needs enhance to make it Title case and in case the first x in a is not completed heading may need to do something to complete it.
   *        -the _table-header option for table is OK now, m20230629.1034
   */

  //create obj to keep some var
  if (!XBROWSER.showDataSpace) {
    XBROWSER.showDataSpace = {
      data: data,
      toElement: toElement,
      opt: opt,
      index: 0 //default starting pointer if data is array
    }
  } else {
    
  } 

  //so the input can be all blank and then the f will take from its space
  if (!data) data = XBROWSER.showDataSpace.data 
  if (!toElement) toElement = XBROWSER.showDataSpace.toElement 
  if (!opt) opt = XBROWSER.showDataSpace.opt 


  //each type of ele needs different format so each following blocks handle formats
  if (toElement.tagName == 'TABLE') {
    let htmlCode = ''
    var noPresetTableHeader 

    //make header ... opt = {tableHeader:'aaa bbb ccc'}
    if (opt && opt.tableHeader) {
      opt.tableHeader = opt.tableHeader.split(' ')
      htmlCode += '<tr>'

      opt.tableHeader.forEach(h => {
        htmlCode += '<th>' + h + '</th>'
      })
      
      htmlCode += '</tr>'
      toElement.innerHTML = htmlCode
    
    } else {
      //if not, will auto make header from the data
      noPresetTableHeader = true 
    }

    //make table body
    if (data) {
      if (noPresetTableHeader) {
        //make header from data
        htmlCode += '<tr>'
        for (k in data[0]) {
          htmlCode += '<th>' + xb.toTitleCase(k) + '</th>'
        }
        htmlCode += '</tr>'
      }

      //make table body
      data.forEach(d => {
        htmlCode += '<tr>'
        for (k in d) {
          htmlCode += '<td>' + d[k] + '</td>'
        }
        htmlCode += '</tr>'
      })
      toElement.innerHTML = htmlCode 
    }
  
  //select    
  } else if (toElement.tagName == 'SELECT') {
    let htmlCode = ''
    data.forEach(choice => {
      htmlCode += '<option>' + choice[Object.keys(choice)[0]] + '</option>'
    })
    toElement.innerHTML = htmlCode
  
  //list
  } else if (toElement.tagName?.match(/OL|UL/)) {
    let htmlCode = ''
    data.forEach(list => {
      htmlCode += '<li>' + list[Object.keys(list)[0]] + '</li>'
    })
    toElement.innerHTML = htmlCode 
  } 


  //form
  else if (toElement.tagName == 'FORM') {
    if (!XBROWSER.showDataSpace.index) {
      XBROWSER.showDataSpace.index = 0 //pointer to the obj in array
    } 
    let index = XBROWSER.showDataSpace.index //shorter

    

    if (Array.isArray(data)) {
      //the data is array, assuming that it is array of obj
      //start with the first obj, array[0]
    
      //top controller
      if (index < 0) {
        //cannot lower than 0
        XBROWSER.showDataSpace.index = 0
        return false 
      } else if (index > (data.length - 1)) {
        //cannot > max record
        XBROWSER.showDataSpace.index = data.length - 1 
        return false
      } else {
        //show index at the top controller
        _showDataIndex.value = index + '/' + (data.length - 1) 
      }
    
      //enable the < > controls
      _goLeft.disabled = _goRight.disabled = _goMostLeft.disabled = _goMostRight.disabled = false 

      //loop form's fields
      for (el of toElement) {
        if (el.type == 'submit') {/*skip*/}

        else if (el.type == 'date') {
          if (data[index][el.name]?.match(/^\d{4}-\d{2}-\d{2}/) ) {
            //data is iso date format, correct
            el.value = data[index][el.name]?.match(/^\d{4}-\d{2}-\d{2}/) //take only yyyy-mm-dd
          } else {
            //not iso date format, put null
            el.value = '' 
          }
        } else {
          //not submit & not date, most typical types
          el.value = data[index][el.name]
        }
      }


    } else if (typeof data == 'object') {
      //assumes that it is obj with fields, just fill obj fields to form

      _showDataIndex.value = '0/0' //only 1 obj shows
      //_goLeft.disabled = _goRight.disabled = true 

      for (el of toElement) {
        el.value = data[el.name]
      }
    } else {
      //wrong
      return false 
    }
            
  }


  //will show like simple obj in column way ...a very plain way
  else {
    let htmlCode = ''

    if (typeof data == 'object' && !Array.isArray(data)) {
      data = [data]
    }

    data.forEach(obj => { //loop the array
      htmlCode += '<table>'
      let count = 1
      var hideState = ''

      for (key in obj) { //loop each obj in each array index
        if (count == 1) {
          //we'll make first row 'bold' for clearer distinct each table
          htmlCode += `<tr ${hideState}><td style="width:25%"><b>` + key + '</b></td><td><b>' + obj[key] + '</b></td></tr>'
        } else {
          if (count > 5) hideState = 'hidden'
          htmlCode += `<tr ${hideState}><td style="width:25%">` + key + '</td><td>' + obj[key] + '</td></tr>'
        }
        count++
      }
      htmlCode += '</table><span style="font-size:20px;cursor:pointer;color:blue" onclick="xb.expandTable(this,this.previousSibling)" title="Click to expand or shrink this table.">+</span><br><br>'
    })

    toElement.innerHTML = htmlCode
  }
}


xb.expandTable = function(actor, tableEle) {
  /**
   * #brief
   * xs.expandTable -- helps xs.showData when the xs.showData shows data in table in a short-mode (collapsed more rows if if has many). So this func expands it.
   * 
   * #input
   * 'actor' is the element that user clicks on it, (uses symbol + & -- for user to click, below the table)
   * 'tableEle' is the table element to be expand or collapse.
   * 
   * #output -- the table will expand if it collapsed, and will collapse if it expanded.
   * 
   * #tested OK, m-20230701.1822
   */

  if (actor.innerText == '+') { //state = hide , symbol = +
    actor.innerText = '--'
    actor.style.backgroundColor = 'yellow'
    let ro = tableEle.querySelectorAll('[hidden]') 
    ro.forEach(r => r.hidden = false) //unhide
  
  } else if (actor.innerText == '--') { //state = show, -
    actor.innerText = '+'
    actor.style.backgroundColor = ''
    for (i=0; i < tableEle.rows.length; i++) {
      if (i > 4) tableEle.rows[i].hidden = true 
    }
  }
}


// autoFill ------------------------------------------------
/*
xb.autoFill = function() {
  /**
   * xs.autoFill() -- scans through the page and automatically fill datas into the element your specified.
   * 
   * #use   just put it in the script part at bottom of the page.
   * #tested OK, m-20230628.2240
   */
  /*
  const toFill = document.querySelectorAll('[_autofill]')

  toFill.forEach(ele => {
    let commandToGetContent = ele.getAttribute('_content')
    eval('command = ' + commandToGetContent)

    xb.$(command).then(dat => {
      //now got data, will show it on ele

      //check table option
      let opt = ''

      if (ele.tagName == 'TABLE') {
        let valu = ele.getAttribute('_table-header')
        if (valu) {
          opt = {tableHeader: valu} 
        }
      }

      xb.showData(dat,ele,opt)
    })
  })
}
*/



/////////////////////////////////////////////////////////////////////////
/* handle string & cases like space-to-camel, dash-to-camel, etc. */

// make Title case ----------------------------------------
xb.toTitleCase = xb.toTitle = function (strin) {
  //xs.makeTitleCase() -- make the input string a Title case, e.g., if gets 'thailand', makes it 'Thailand'
  //#tested OK, m20230628.1947
  //needs more enhance eg if have multi-words, make it from snake, camel, etc.

  let part = strin.split(' ')

  for (i=0; i < part.length; i++) {
    var firstChar = part[i].charAt(0).toUpperCase()
    part[i] = firstChar + part[i].slice(1)
  }
  return part.join('') 
}

xb.help.toTitleCase = {
  about:'make title case',
  use:'xb.toTitleCase( #STRING )',
  exam:'xb.toTitleCase("thailand is good") ~get ThailandIsGood '
}

// make camel case -------------------------------
/*xb.toCamelCase = xb.toCamel = function (strin) {
  //assumes input is multi words eg 'user name', makes it 'userName'
  //#tested OK, m20230628.2000

  let part = strin.split(' ')
  for (i=1; i < part.length; i++) {
    var firstChar = part[i].charAt(0).toUpperCase()
    part[i] = firstChar + part[i].slice(1)
  }
  return part.join('')
}
*/

// make snake case -------------------------------------
xb.toSnakeCase = xb.toSnake = function (strin) {
  //assumes input is multi-words or space separations
  //#tested OK, m20230628.2003

  return strin.replaceAll(' ','_')
}

xb.help.toSnakeCase = {
  about:'make snake case from input string',
  use:'xb.toSnakeCase( #STRING )',
  exam:'xb.toSnakeCase("thailand is good") ~get thailand_is_good'
}



//make dash case -----------------------------
xb.toDashCase = xb.toDash = function (strin) {
  return strin.replaceAll(' ','-')
}

xb.help.toDash = {
  about:'make dash case from string',
  use:'xb.toDash( #STRING )',
  exam:'xb.toDash("thailand is good") ~get thailand-is-good'
}




/* dash to camel */
xb.toCamel2 = xb.toCamel = function(i) {
  //input can be dash, snake, space will be converted to camel automatically
  var prep
  if (i.includes('-')) prep = i.split('-')
  else if (i.includes('_')) prep = i.split('_')
  else if (i.includes(' ')) prep = i.split(' ')
  else prep = i.toLowerCase() //like 1 word says 'thailand' so just make it small that's it

  var outp
  if (Array.isArray(prep)) {
    outp = prep[0].toLowerCase()
    for (i = 1; i < prep.length; i++) {
      outp += prep[i].charAt(0).toUpperCase() + prep[i].slice(1)
    }
  } else {
    outp = prep
  }

  return outp //2024-05-19 14:32, ok, m
} 


xb.help.toCamel = {
  about:'make camel case from string',
  use:'xb.toCamel( #STRING )',
  exam:'xb.toCamel("thailand is good") ~get thailandIsGood'
}












///////////////////////////////////////////////////////////////////////


/**
 * To validate the data against the rule.
 * @param {string} data - usually a string from an input field 
 * @param {object} rule - such as {name:'required;wordsOnly', ...}
 * @returns {boolean} - true is valid, false is invalid
 * @author M 
 * @version 0.1
 * @lastUpdate 20230702.1359
 * @note added notNone rule
 */
xb.validate = function(data, rule) {
  /**
   * xs.validate -- validates each data against the provided rules for that data. Returns true/false.
   * Will use this in the xdev server as well and to validate the mongodb inputting the data.
   * 
   * #input
   *    'data' -- string, usually from the form's input
   *    'rule' -- string language describing the rules such as: 'required;wordsOnly; ...'
   * 
   * #use   let isValid = xs.validate(data,'required;wordsOnly;length:4-20')
   * 
   * #output -- returns true if valid, false for invalid
   * 
   * #test  OK, for few basic features, m-20230629.1913
   */
  

  var validity = true //initialized, if any false happens, change this and return the false/invalid

  if (!rule) return true //{success:false, msg:"Wrong input.", from:'xs.validate'}
    //so if don't have rule just pass it (return true)

  let part = rule.split(';')

  part.forEach(ru => {
    ru = ru.trim()

    // required
    if (ru == 'required') {
      if (data == '' || !data) validity = false 
    } 
    
    // wordsOnly
    if (ru == 'wordsOnly') {
      if (!data.match(/^[a-zA-Z ]+$/)) validity = false  
    }

    // length:4-20
    if ( ru.match(/^length:(\d+)-(\d+)$/) ) {
      let ext = ru.match(/^length:(\d+)-(\d+)$/)
      if (data.length < Number(ext[1]) || data.length > Number(ext[2]) ) validity = false   
    }

    // value:18-60
    if ( ru.match(/^value:(\d+)-(\d+)$/) ) {
      let ext = ru.match(/^value:(\d+)-(\d+)$/)
      if (Number(data) < Number(ext[1]) || Number(data) > Number(ext[2]) ) validity = false 
    }

    // 1symbol
    if ( ru == '1symbol') {
      if ( !data.match(/[\-+*/._%^?\<\>\(\)$~!|\\= ]/) ) validity = false 
    }

    // noSymbol
    if ( ru == 'noSymbol') {
      if ( data.match(/[\-+*/._%^?\<\>\(\)$~!|\\= ]/) ) validity = false
    }

    // 1number
    if (ru == '1number') {
      if (!data.match(/\d/)) validity = false 
    }

    // numbersOnly
    if (ru == 'numbersOnly') {
      if (data.match(/\D/) ) validity = false 
    }

    // 1capital
    if (ru == '1capital') {
      if ( !data.match(/[A-Z]/) ) validity = false 
    }

    // capitalOnly
    if (ru == 'capitalOnly') {
      if (!data.match(/^[A-Z]+$/) ) validity = false 
    }

    // 1small
    if (ru == '1small') {
      if ( !data.match(/[a-z]/) ) validity = false 
    }

    // smallOnly
    if (ru == 'smallOnly') {
      if (!data.match(/^[a-z]+$/) ) validity = false 
    }

    // isoDate
    if (ru == 'isoDate') {
      let part = data.split('-')
      if (part.length != 3) validity = false
      if (part[0].length > 4) validity = false
      if ( Number(part[1]) > 12 ) validity = false
      if ( Number(part[2]) > 31 ) validity = false 
    }

    // noSpace
    if (ru == 'noSpace') {
      if ( data.match(/\s/) ) validity = false 
    }

    // 2decimal
    if (ru == '2decimal') {
      if (!data.match(/^\d+.\d{1,2}$/)) validity = false 
    }

    // notNone ...for select input, this is the same as 'required'
    if (ru == 'notNull') {
      if (data.match(/^$/i) ) validity = false 
    }

  })

  return validity   
}



xb.help.validate = {
  about:'take input & rule then return true/false based on your rule',
  use:'xb.validate( #VALUE, #RULE)'
}








/**
 * el(strin) - shorten the way to find an html element.
 * @param {string} strin -- like '#ele_id', any complies to document.querySelector
 * @returns {HTMLElement} -- the element that you can work further
 * @created 20230702.1639
 * @author m
 * @version 0.1
 * @tested OK 20230702.1645
 */
/*xb.el = function(strin) {
  return eval(`document.querySelector('${strin}')`)
}


/**
 * els(strin) - similar to el() but look for many elements.
 * @param {string} strin -- compliance to document.querySelectorAll
 * @returns {HTMLElement}
 * @created 20230702.1642
 * @author M
 * @version 0.1 
 * @tested OK 20230702.1645
 */
/*xb.els = function(strin) {
  return eval(`document.querySelectorAll('${strin}')`)
}
*/



/**
 * xs.tableCell(ele, row, col) - easier to point to a cell in the html table.
 * @param {HTMLElement} ele 
 * @param {string|number} row
 * @param {string|number} col
 * @returns {HTMLElement} - of the cell 
 */
xb.tableCell = function (ele, row, col) {
  return ele.rows[row].cells[col]
} 

xb.help.tableCell = {
  about:'pick row & column in the table and you can do things with it',
  use:'xb.tableCell(#TABLE_ELEM, #ROW_NUM, #COL_NUM)',
  exam:'let elem = xb.tableCell(tb_elem, 1, 3)'
}


/**
 * xb.tradeVal - makes a numbers string to the trade value format.
 * @param {string} strin - numbers in string type
 * @returns {string} - like '1,234,567.50'
 */
xb.tradeVal = function(numString) {
  let fullNum = []
  var allGood = true 
  var hasDecimal, num, deci 
  let outp = []

  //validate
  if (typeof numString != 'string') numString = numString.toString()
  
  if (numString.includes('.')) {
    fullNum = numString.split('.')
    if (fullNum[0].match(/^\d+$/) && fullNum[1].match(/^\d+$/) && fullNum.length == 2 ) {
      //perfect num & decimal value
      hasDecimal = true
      allGood = true 
      num = fullNum[0]
      deci = fullNum[1]
    } else {
      allGood = false 
    }

  } else {
    //doesn't have .

    if (numString.match(/^\d+$/)) {
      //perfect num but no decimal
      allGood = true
      hasDecimal = false 
      num = numString
    }
  }

  if (allGood) {
    while (num) {
      outp.unshift( num.slice(-3) )
      num = num.slice(0,-3)
    }

    if (hasDecimal) {
      if (deci.length == 1) {
        deci = deci.toString() + '0'
      } else {
        deci = deci.match(/^\d{2}/).toString()
      }

      return outp.toString() + '.' + deci

    } else {
      return outp.toString() + '.00'
    }

  } else {
    return false //all bad 
  }
  
}


xb.help.tradeVal = {
  about:'make number string in to ###,###.## format',
  use:'xb.tradeVal( #NUMBER )',
  exam:'let val = xb.tradeVal(1000000) ~will get "1,000,000"'
}






//get ip of this browser-----------------------------
xb.getIp = async function () {
  return fetch('https://api.ipify.org?format=json')
  .then(re => re.json())
  .then(output => {return output.ip})
}


xb.help.getIp = {
  about:'get ip of the browser',
  use:'await xb.getIp()'
}




// initialization------------------------------
//xb.getIp().then(re => xb.ip = re)


// sessionId



// PACKET HANDLING /////////////////////////////////////////////


xb.Packet = class {
  from =    xb.secure.sessionId
  to =      xb.xserver.serverId
  active =  xb.active 
  msg =     ''
  id =      xb.ip + '_' + Date.now() + '_' + xb.uuid()
  cert =    ''
}


xb.makeKey = async function (packet) {
  //make key from the packet

  if (!packet) return false

  if (typeof packet == 'object' && packet.from && packet.id) {
    return xb.hash(
      packet.from + packet.to + packet.id + xb.secure.masterSalt + xb.secure.salt 
    )

  } else {
    return false
  }
}

/*
xb.masterKey = async function () {
  //every session must have a masterKey for its security works
  return await xb.hash(
    xb.secure.sessionId.slice(7,23) 
    + xb.ip + xb.secure.defaultSalt
  )
}
*/

/*
async function init() {
  xb.ip = await xb.getIp()
}
init()
*/



/**
 * xb.passwordRealHash - makes the password hash more secure
 * @param {string} username 
 * @param {string/hex} passwordHash 
 * @returns hash/hex/sha256/64 digits
 */
xb.passwordRealHash = async function (username, passwordHash) {
  return xb.hash(
    username + passwordHash + "D+DHDqyDC~P9"
  )
  /* This func embeded the salt but will need to find ways to handle this more securely. */
  //this func will use in the server 
}



xb.readPacketMsg = async function (receivedPacket) {
  /*  get the received packet from the xb.send command and get the msg out from the packet */

  return xb.makeKey(receivedPacket).then(gotKey => {
    return xb.dec(
      receivedPacket.msg,
      gotKey
    )

  }).then(msgJson => {
    return JSON.parse(msgJson)
  })
}


xb.readPacket = async function (packt) {
  /* Certifies packet and read its msg. If not certified will return cert error. In case msg has modified it will fail from the certifying check. */

  if (await xb.cert(packt)) {
    try {
      return xb.readPacketMsg(packt)
    } catch {
      return {
        fail: true, success: false,
        msg: "Error of reading this packet."
      }
    }
  } else {
    return {
      fail: true, success: false,
      msg: "Packet not certified."
    }
  }

  //tested ok, 20231223.1820/m
}





// FILE HANDLING /////////////////////////////////////////////////



/*  Returns the text data url for the picture picked by user.
    how:  <input type="file" onchange="xb.readPicFileAsDataUrl(this).then(dataUrl => ...)">
    tested: ok, m20230830 
    -works with png, jpg, jpeg  /m20230904 
*/
xb.readPicFileAsDataUrl = async function (inputEl) {
  return new Promise((resolve,reject) => {
    //const getFile = event.target.files[0]
    const getFile = inputEl.files[0]
    const FR = new FileReader
    FR.readAsDataURL(getFile)

    FR.onloadend = () => {
      resolve(FR.result) 
    }

    FR.onerror = () => {
      reject(FR.error)
    }
  })
}
xb.getDataUrlFromFileInput = xb.readPicFileAsDataUrl


xb.help.readPicFileAsDataUrl = {
  about:'use html file input tag to get a pic file and this func reads it as data-url format',
  use:'onchange="durl = await xb.readPicFileAsDataUrl(#FILE_ELEMENT); show_pic.src = durl" '
}






/*  Returns text string from the text file picked by user.
    how:  <input type="file" onchange="xb.readTextFile(this).then(strin => ... )"
    tested: ok, m20230830   */
xb.readTextFile = async function (inputEl) {
  return new Promise((resolve,reject) => {
    let getFile = inputEl.files[0]
    let FR = new FileReader()
    FR.readAsText(getFile)

    FR.onload = () => {
      resolve(FR.result) 
    }

    FR.onerror = () => {
      reject(FR.error)
    }
  })
}

xb.help.readTextFile = {
  about:'get text from a file input element',
  use:'onchange="show_text.textContent = await xb.readTextFile(#FILE_ELEMENT)" '
}






xb.savePngFile = function (imgEle, fileName) {
  //get pic from tag <img> then download to file, only png 

  if (!imgEle) return {msg:"Wrong input.", success:false} 
  if (!fileName) fileName = Date.now() + '.png'
  if (!fileName.match(/\w+.png$/)) fileName = fileName + '.png'


  let canvas = document.createElement('canvas')
  canvas.width = imgEle.clientWidth
  canvas.height = imgEle.clientHeight
  let context = canvas.getContext('2d')
  context.drawImage(imgEle,0,0)

  canvas.toBlob( 
    blob => {
      let link = document.createElement('a')
      link.download = fileName
      link.href = URL.createObjectURL(blob)
      link.click()
      URL.revokeObjectURL(link.href)
    },
    'image/png' //png is default
  )
  /*  
  works ok, further work: need to handle multiple formats. m20230831
  changed to receive element from the onclick event, m20230904
  */
}

xb.help.savePngFile = {
  about:'save pic file from the img tag',
  use:'onclick="xb.savePngFile(#IMG_ELEM, #FILE_NAME)"'
}











xb.saveTextFile = function (text, fileName) {
  // save text to fileName

  if (!text) return {msg:"Wrong input.", success:false} 
  if (!fileName) fileName = Date.now() + '.txt'
  //if (!fileName.match(/\w+.txt$/)) fileName = fileName + '.txt'
  
  let link = document.createElement('a')
  link.download = fileName
  let blob = new Blob([text],{type:'text/plain'})
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
  /* note
  tested OK, m20230904
  */
}


xb.help.saveTextFile = {
  about:'save text input to a file',
  use:'xb.saveTextFile(#YOUR_TEXT, #FILE_NAME)'
}













// HTML ELEMENT TOOL /////////////////////////////////////////////

// 20231218 
/* 

This set of functions added after tested. They're mainly working on html elements. 

sample of the uses are:

    xb.sel('ol').selAll('li').add({style:{color:'red'} })
    xb.sel('table').fillTable(data)
    xb.newEl({tag:'img', src:'./pic.jpg'}).appendTo('body')
    xb.sort(ARRAY,'des','objectKey')


*/


/*
xb.sel = function (pattern) {
  /* This func shortens the document.querySelector and added more features so at the end the coding time is reduced a lot.

  xb.sel('div').selAll('button')[1]   //also works
  xb.sel('#anid').add({class:__, style:__, attri:__})

  */
/*
  var outpu = document.querySelector(pattern)

  //return
  outpu.sel      = xb.sel2
  outpu.selAll   = xb.selAll2
  outpu.add      = xb.add
  outpu.del      = xb.del
  outpu.hide     = xb.hide
  outpu.show     = xb.show
  outpu.toggle   = xb.toggle
  outpu.setHtml  = xb.setHtml
  if (outpu.tagName == 'TABLE') outpu.fillTable = xb.fillTable
  if (outpu.tagName == 'SELECT') outpu.fillSelect = xb.fillSelect
  if (outpu.tagName && outpu.tagName.match(/OL|UL/)) outpu.fillList = xb.fillList

  if (outpu.length) {
    for (elemen of outpu) {
      elemen.sel      = xb.sel2
      elemen.selAll   = xb.selAll2
      elemen.add      = xb.add
      elemen.del      = xb.del
      elemen.hide     = xb.hide
      elemen.show     = xb.show
      elemen.toggle   = xb.toggle
      elemen.setHtml  = xb.setHtml
      if (elemen.tagName == 'TABLE') elemen.fillTable = xb.fillTable
      if (elemen.tagName == 'SELECT') elemen.fillSelect = xb.fillSelect
      if (element.tagName && elemen.tagName.match(/OL|UL/)) elemen.fillList = xb.fillList
    }
  }

  return outpu
}

xb.selAll = function (pattern) {
  //optio can be 'all' only for now
  //findSubs is finds ele in the this, not from the document

  var outpu = document.querySelectorAll(pattern)

  //return
  outpu.sel     = xb.sel2
  outpu.selAll  = xb.selAll2
  outpu.add     = xb.add
  outpu.del     = xb.del
  outpu.hide    = xb.hide
  outpu.show    = xb.show
  outpu.toggle  = xb.toggle
  outpu.setHtml = xb.setHtml
  if (outpu.tagName == 'TABLE') outpu.fillTable = xb.fillTable
  if (outpu.tagName == 'SELECT') outpu.fillSelect = xb.fillSelect
  if (outpu.tagName && outpu.tagName.match(/OL|UL/)) outpu.fillList = xb.fillList

  if (outpu.length) {
    for (elemen of outpu) {
      elemen.sel      = xb.sel2
      elemen.selAll   = xb.selAll2
      elemen.add      = xb.add
      elemen.del      = xb.del
      elemen.hide     = xb.hide
      elemen.show     = xb.show
      elemen.toggle   = xb.toggle
      elemen.setHtml  = xb.setHtml
      if (elemen.tagName == 'TABLE') elemen.fillTable = xb.fillTable
      if (elemen.tagName == 'SELECT') elemen.fillSelect = xb.fillSelect
      if (elemen.tagName && elemen.tagName.match(/OL|UL/)) elemen.fillList = xb.fillList
    }
  }

  return outpu
}

xb.sel2 = function (pattern) {
  //optio can be 'all' only for now
  //findSubs is finds ele in the this, not from the document
  var outpu = this.querySelector(pattern)

  //return
  outpu.sel      = xb.sel2
  outpu.selAll   = xb.selAll2
  outpu.add      = xb.add
  outpu.del      = xb.del
  outpu.hide     = xb.hide
  outpu.show     = xb.show
  outpu.toggle   = xb.toggle
  outpu.setHtml  = xb.setHtml
  if (outpu.tagName == 'TABLE') outpu.fillTable = xb.fillTable
  if (outpu.tagName == 'SELECT') outpu.fillSelect = xb.fillSelect
  if (outpu.tagName && outpu.tagName.match(/OL|UL/)) outpu.fillList = xb.fillList

  if (outpu.length) {
    for (elemen of outpu) {
      elemen.sel      = xb.sel2
      elemen.selAll   = xb.selAll2
      elemen.add      = xb.add
      elemen.del      = xb.del
      elemen.hide     = xb.hide
      elemen.show     = xb.show
      elemen.toggle   = xb.toggle
      elemen.setHtml  = xb.setHtml
      if (elemen.tagName == 'TABLE') elemen.fillTable = xb.fillTable
      if (elemen.tagName == 'SELECT') elemen.fillSelect = xb.fillSelect
      if (elemen.tagName && elemen.tagName.match(/OL|UL/)) elemen.fillList = xb.fillList
    }
  }
  return outpu
}

xb.selAll2 = function (pattern) {
  //optio can be 'all' only for now
  //findSubs is finds ele in the this, not from the document

  var outpu = this.querySelectorAll(pattern)

  //return
  outpu.sel     = xb.sel2
  outpu.selAll  = xb.selAll2
  outpu.add     = xb.add
  outpu.del     = xb.del
  outpu.hide    = xb.hide
  outpu.show    = xb.show
  outpu.toggle  = xb.toggle
  outpu.setHtml = xb.setHtml
  if (outpu.tagName == 'TABLE') outpu.fillTable = xb.fillTable
  if (outpu.tagName == 'SELECT') outpu.fillSelect = xb.fillSelect
  if (outpu.tagName && outpu.tagName.match(/OL|UL/)) outpu.fillList = xb.fillList

  if (outpu.length) {
    for (elemen of outpu) {
      elemen.sel      = xb.sel2
      elemen.selAll   = xb.selAll2
      elemen.add      = xb.add
      elemen.del      = xb.del
      elemen.hide     = xb.hide
      elemen.show     = xb.show
      elemen.toggle   = xb.toggle
      elemen.setHtml  = xb.setHtml
      if (elemen.tagName == 'TABLE') elemen.fillTable = xb.fillTable
      if (elemen.tagName == 'SELECT') elemen.fillSelect = xb.fillSelect
      if (elemen.tagName && elemen.tagName.match(/OL|UL/)) elemen.fillList = xb.fillList
    }
  }
  return outpu
}

//add 

xb.add = function (addObj) {
  /* Adds classes, styles and attributes to selected elements. */
/*
  if (this.length) {
    this.forEach(elemen => {
      add(elemen)
    })
  } else {
    add(this)
  }

  //func
  function add(elemen) {
    if (addObj.class) {
    // xb.el('#aaa').add({ class:'aaaa bbbb cccc' })
    let part = addObj.class.split(' ')
    part.forEach(clas => elemen.classList.add(clas))
    }

    if (addObj.style) {
      // xb.el('#aaa').add({ style:{color:'red', font-size:'48px'} })
      for (ky in addObj.style) {
        elemen.style[ky] = addObj.style[ky]
      }
    }

    if (addObj.attri) {
      // xb.el('#aaa').add({ attri:{id:'yeah', name:'yoooh'} })
      for (ky in addObj.attri) {
        elemen.setAttribute(ky, addObj.attri[ky])
      }
    }
  }
}

//del
xb.del = function (delObjec) {
  /* Deletes classes, styles and attributes of selected elements. If not put delObjec will regard as deletion of this element. */
/*
  if (this.length) {
    this.forEach(elemen => {
      if (delObjec) del(elemen)
      else elemen.remove()
    })
  } else {
    if (delObjec) del(this)
    else this.remove()
  }

  //func
  function del(elemen) {
    if (delObjec.class) {
    // xb.el('#aaa').del({class:'aaa bbb ccc'})
    let part = delObjec.class.split(' ')
    part.forEach(clas => elemen.classList.remove(clas))
    }

    if (delObjec.style) {
      // xb.el('#aaa').del({style:'aaa bbb ccc'})
      let part = delObjec.style.split(' ')
      part.forEach(sty => elemen.style[sty] = '')
    }

    if (delObjec.attri) {
      // xb.el('#aaa').del({attri:'aaa bbb ccc'})
      let part = delObjec.attri.split(' ')
      part.forEach(att => elemen.removeAttribute(att))
    }
  }
}

//hide
xb.hide = function () {
  /* Hides selected elements. */
  //use with xb.sel(...).hide()
/*
  if (this.length) {
    this.forEach(elemen => {
      elemen.hidden = true
      elemen.style.display = 'none'
    })
  } else {
    this.hidden = true
    this.style.display = 'none'
  }
}

//show
xb.show = function () {
  /* Shows selected elements. */
  //use with xb.sel(...).show()
/*
  if (this.length) {
    this.forEach(elemen => {
      elemen.hidden = false
      elemen.style.display = ''
    })
  } else {
    this.hidden = false
    this.style.display = ''
  }
}

//toggle
xb.toggle = function () {
  /* Toggles show/hide of an element or all selected elements. */
  //use with xb.sel(??).toggle()
/*
  if (this.length) {
    this.forEach(elemen => {
      if (elemen.hidden == true) elemen.hidden = false
      else elemen.hidden = true
      if (elemen.style.display == 'none') elemen.style.display = ''
      else elemen.style.display = ''  
    })
  } else {
    if (this.hidden == true) this.hidden = false
    else this.hidden = true
    if (this.style.display == 'none') this.style.display = ''
    else this.style.display = 'none'
  }
}

//innerHTML
//same as xb.sel(??).innderHTML = ??
xb.setHtml = function (html) {
  if (this.length) {
    this.forEach(elemen => elemen.innerHTML = html)
  } else {
    this.innerHTML = html
  }
}


//createElement
xb.newEl = function (inp) {
  /* 
  xb.createEl({
    tag:    ___,
    class:  ___,
    style:  ___,
    css:    ___,
    html:   ___,
    attri:  ___,
    id:     ___,
    name:   ___,
    value:  ___,
    type:   ___,
    title:  ___,
    hidden: true|false,
  }) 
  */ /*
  if (!inp.tag) return false

  let el = document.createElement(inp.tag)
  if (inp.class) el.className = inp.class
  if (inp.html) el.innerHTML = inp.html
  if (inp.css) el.style.cssText = inp.css
  if (inp.id) el.setAttribute('id', inp.id)
  if (inp.name) el.setAttribute('name', inp.name)
  if (inp.value) el.setAttribute('value', inp.value)
  if (inp.hidden) el.setAttribute('hidden', inp.hidden)
  if (inp.type) el.setAttribute('type', inp.type)
  if (inp.title) el.setAttribute('title', inp.title)
  if (inp.src) el.setAttribute('src', inp.src)
  if (inp.attri) {
    for (ky in inp.attri) {
      el.setAttribute(ky, inp.attri[ky])
    }
  }
  if (inp.style) {
    for (ky in inp.style) {
      el.style[ky] = inp.style[ky]
    }
  }
/*
  if (inp.appendTo) { //these 2 cannot stay together
    xb.sel(inp.appendTo).append(el)
  } else if (inp.prependTo) {
    xb.sel(inp.prependTo).prepend(el)
  } 
*/
/*
el.appendTo = function (targetEl) {
    xb.sel(targetEl).append(el)
  }

  el.prependTo = function (targetEl) {
    xb.sel(targetEl).prepend(el)
  }

  return el
}



xb.fillTable = function (inp) {
  /* 
  inp = {
    head: 'Name Age Sex',
    data: [
      {name:__, age:__, sex:__},
      //
    ]
  } 
  */ 
 /*
  if (this.tagName == 'TABLE') {
    /* if the inp.head not provided, takes the data keys as head */
/*    let htmlCode = ''

    if (inp.head) {
      //inp.head provided
      htmlCode = '<tr>'
      let headKey = inp.head.split(' ')
      headKey.forEach(ky => {
        htmlCode += '<th>' + ky + '</th>'
      })
      htmlCode += '</tr>'
    } else {
      //inp.head not provided
      let makeHead = inp.data[0]
      htmlCode = '<tr>'
      for (ky in makeHead) {
        htmlCode += '<th>' + ky + '</th>'
      }
      htmlCode += '</tr>'
    }
    
    //data
    inp.data.forEach(row => {
      htmlCode += '<tr>'
      for (ky in row) {
        htmlCode += '<td>' + row[ky] + '</td>'
      }
      htmlCode += '</tr>'
    })

    this.innerHTML = htmlCode
  }
}


xb.fillSelect = function (inp) {
  /*

  inp = ['aaaaa','bbbbbbb','cccccccccccc', ]
  
  */
/*
  if (this.tagName == 'SELECT') {
    let htmlCode = ''
    inp.forEach(optio => {
      htmlCode += '<option>' + optio + '</option>'
    })
    this.innerHTML = htmlCode
  }
}


xb.fillList = function (inp) {
  /*

  inp = ['aaaaaaaaaaaaa','bbbbbbbbbb','cccccccccccccc']
  
  */
/*
  if (this.tagName && this.tagName.match(/OL|UL/)) {
    let htmlCode = ''
    inp.forEach(lis => {
      htmlCode += '<li>' + lis + '</li>'
    })
    this.innerHTML = htmlCode
  }
}


xb.sort = function (arry, way='asc', key='') {
  /*
      arry = [1000,1234,541354,11245, ...]
      arry = ['aaaa','bbbb','asdfasdfasdf', ...]
      arry = [
        {name:'john', age:23, sex:'male'},
        {...}
      ]

    use
      xb.sort(ARRAY) ......ascending sort on plain array
      xb.sort(ARRAY,'des') .....descending sort on plain array
      xb.sort(ARRAY,0,'name') ...ascending sort object array on key name
      xb.sort(array,'des','age') ...descending on object array
  */
/*
  if (!Array.isArray(arry)) return false

  arry.sort((a,b) => {
    if (way == 'asc') {
      if (key) {
        if (a[key] < b[key]) return -1
        if (a[key] > b[key]) return 1
        return 0
      } else {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      }
      
    } else if (way == 'des') {
      if (key) {
        if (a[key] < b[key]) return 1
        if (a[key] > b[key]) return -1
        return 0
      } else {
        if (a < b) return 1
        if (a > b) return -1
        return 0
      }
    }
  })
  return arry

  /* Tested OK, 20231218.1703 M */
/*}

*/

////////////////////////////////////////////////////////////////////////
xb.makeUp = function (x) {

  /*  WHAT IT DOES  
      fills template with variables
  
      OBJECTIVE   
      will use this program in the xserver project where the XS will send html to the XB. This program will fill variables into the template that is being used.
  
      EXAMPLE
      //js
      document.body = xtem({
        template: '<table>{{$customer (tag=tr;head=Name,Age,Sex)}}</table>',
        customer: [
          {name:'John', age:24, sex:'male'}, {...}
        ]
      })
  
      ABOUT
      version:        0.6.0
      releasedNote:   added multiple choices to option if, in = comparison
      released date:  2024-03-18 10:10
      devBy:          http://m.me/mutita.org
      license:        none
  
  */
  
  // ABOUT
  let about = {
    softwareName: 'makeUp',
    version:      '0.6.0',
    releasedTime: "2024-03-18",
    language:     'js',
    environment:  'node.js',
    brief:        'fills variables into the html template like: "<p>{{$someText}}</p>". This program will be used to prepare the html codes before sending to web browser so that we can make dynamics of the html, not purely static. The program has some features like option so we can generate the dynamic html easier. It can make list, table, select and also have conditional feature so in summary will make the dynamic html more easier.',
    example:     `xtem({template:'<p>{{$name}}</p>', name:'john'})`,
    webSite:      'not yet',
    sourceCodeRepository: '', 
    license:      'none',
    programmer:   [
      { codeName:'M', contact:'http://m.me/mutita.org', role:'design,dev,test'}
    ],
    update: [
      { note: 'Added feature to make variable value in if-option.',
        criticalLevel: 'normal',  // ['normal','major update','security threat']
        by: 'M', // codeName
        time: '2024-03-18'  //human readable
      }
    ]
  }
  
  if (x == 'about') return about


  // VALIDITY CHECK
  if (!x) return ''

  //START
  if (x.template && x.template != '') {
    //template prop must be provided and not blank

    let space = x.template.match(/{{(.+?)}}/g) //space is {{...}}
    let filled = x.template

    if (space) { // space is {{..space..}}

      space.forEach(sp => {
        let varName = sp.match(/(?<=\$)\w+/) //1 var per space only

        if (varName && varName in x) {
          //has var & exist in the x
          let opt = sp.match(/\((.+)\)/) // (..option..)

          if (opt) {
            //there's option

            let optSet = opt[1].split(';') //(tag=option;default=salad)
            let part = optSet[0].split('=') //(tag=li)

            if (part[0] == 'tag') {
              let tag = part[1] // tag=li so tag is li
              let htmlTrans = '' //translate to html

              if (Array.isArray(x[varName]) && tag.match(/^li$|^option$/)) {
                // for tag tr/li/option the var has to be array
                let tagHead = '<' + tag + '>'
                let tagEnd = '</' + tag + '>'

                //loop var to make each html element
                x[varName].forEach(v => {

                  if (tag == 'option' && optSet[1]) { // for <option>
                    let part = optSet[1].split('=')
                    if (part[0] == 'default' && part[1] == v) {
                      // default=salad
                      // if default matched we'll make it the default item
                      htmlTrans += '<option selected>' + v + '</option>'
                    } else {
                      htmlTrans += '<option>' + v + '</option>'
                    }

                  } else {
                    //not <option> and only 1 option
                    htmlTrans += tagHead + v + tagEnd
                  }
                })
                filled = filled.replace(sp, htmlTrans)

              } else if (Array.isArray(x[varName]) && tag.match(/^tr$/)) {
                // this to make a table
                htmlTrans += '<tr>'
                //make table head
                for (field in x[varName][0]) { //take first row as head
                  htmlTrans += '<th>' + field.slice(0,1).toUpperCase() + field.slice(1) + '</th>'
                  //make the header always title case like Title
                }
                htmlTrans += '</tr>'

                //make body
                x[varName].forEach(row => {
                  htmlTrans += '<tr>'
                  for (field in row) {
                    htmlTrans += '<td>' + row[field] + '</td>'
                  }
                  htmlTrans += '</tr>'
                })
                filled = filled.replace(sp, htmlTrans)

              } else {
                // the var & tag mismatch gives varName instead
                filled = filled.replace(sp, '$' + varName)
              }

            } else if (opt[1].match(/if .+/)) {
              //conditional option like {{(if $role=nonUser) disabled || null}}

              let condiOpt = opt[1].match(/if (.+)/)[1] // $varName=value

              if (condiOpt.includes('!=')) {
                // condition is 'not equal'
                let part = condiOpt.split('!=')
                let varName = part[0].slice(1)
                let value = part[1]
                let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                let contPart = cont.split('||')

                if (x[varName] != value) {
                  if (contPart[0].includes('$') && contPart[0].trim().slice(1) in x) {
                    //if the content for true is var so put var value
                    filled = filled.replace(sp, x[contPart[0].trim().slice(1)])
                  } else {
                    //if not var or no var in x just put as it is
                    filled = filled.replace(sp, contPart[0].trim() )
                  }
                } else {
                  if (!contPart[1] || contPart[1].trim() == 'null') {
                    filled = filled.replace(sp, '')
                  } else {
                    //if the content is var, puts var value
                    if (contPart[1].includes('$') && contPart[1].trim().slice(1) in x) {
                      filled = filled.replace(
                        sp, 
                        x[ contPart[1].trim().slice(1) ]
                      )
                    } else {
                      filled = filled.replace(sp, contPart[1].trim() )
                    }
                  }
                }

              } else if (condiOpt.includes('=')) {
                // condition is 'equal'
                let part = condiOpt.split('=')
                let varName = part[0].slice(1)
                let value = part[1]
                let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                let contPart = cont.split('||')

                //for case: (if $role=aaa|bbb|ccc)
                let matched = false
                if (value.includes('|')) {
                  let many = value.split('|')
                  matched = many.includes(x[varName])
                } else {
                  matched = x[varName] == value
                }

                if (matched) { //matched
                  if (contPart[0].includes('$') && contPart[0].slice(1).trim() in x) {
                    filled = filled.replace(
                      sp,
                      x[ contPart[0].slice(1).trim() ]
                    )
                  } else {
                    filled = filled.replace(sp, contPart[0].trim() )
                  }
                } else { //not matched
                  if (!contPart[1] || contPart[1].trim() == 'null') {
                    //if no content for false or put null, show blank
                    filled = filled.replace(sp, '')
                  } else {
                    //not null so fill with the provided content
                    if (contPart[1].includes('$') && contPart[1].trim().slice(1) in x) {
                      filled = filled.replace(
                        sp,
                        x[ contPart[1].trim().slice(1) ]
                      )
                    } else {
                      filled = filled.replace(sp, contPart[1].trim() )
                    }
                  }
                }

              } else if (condiOpt.includes('>')) {
                // 'more than'
                let part = condiOpt.split('>')
                let varName = part[0].slice(1)
                let value = part[1]
                let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                let contPart = cont.split('||')

                if (x[varName] > value) { //matched
                  if (contPart[0].includes('$') && contPart[0].trim().slice(1) in x) {
                    filled = filled.replace(
                      sp,
                      x[ contPart[0].trim().slice(1) ]
                    )
                  } else {
                    filled = filled.replace(sp, contPart[0].trim() )
                  }
                } else { //not matched
                  if (!contPart[1] || contPart[1].trim() == 'null') {
                    //if no content for false or put null, show blank
                    filled = filled.replace(sp, '')
                  } else {
                    //not null so fill with the provided content
                    if (contPart[1].includes('$') && contPart[1].trim().slice(1) in x) {
                      filled = filled.replace(
                        sp,
                        x[ contPart[1].trim().slice(1) ]
                      )
                    } else {
                      filled = filled.replace(sp, contPart[1].trim() )
                    }
                  }
                }

              } else if (condiOpt.includes('<')) {
                // 'less than'
                let part = condiOpt.split('<')
                let varName = part[0].slice(1)
                let value = part[1]
                let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                let contPart = cont.split('||')

                if (x[varName] < value) { //matched
                  if (contPart[0].includes('$') && contPart[0].trim().slice(1) in x) {
                    filled = filled.replace(
                      sp,
                      x[ contPart[0].trim().slice(1) ]
                    )
                  } else {
                    filled = filled.replace(sp, contPart[0].trim() )
                  }
                } else { //not matched
                  if (!contPart[1] || contPart[1].trim() == 'null') {
                    //if no content for false or put null, show blank
                    filled = filled.replace(sp, '')
                  } else {
                    //not null so fill with the provided content
                    if (contPart[1].includes('$') && contPart[1].trim().slice(1) in x) {
                      filled = filled.replace(
                        sp,
                        x[ contPart[1].trim().slice(1) ]
                      )
                    } else {
                      filled = filled.replace(sp, contPart[1].trim() )
                    }
                  }
                }

              } else {
                //out of these 4 conditions, just show the content of the 'true' case
                
                let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                let contPart = cont.split('||')
                filled = filled.replace(sp, contPart[0].trim() )
              }
            }

          } else {
            //no option, just a var
            filled = filled.replace(sp, x[varName])
          }

        } else if (varName && !(varName in x)) {
          //has var in tem but not in x, just give $varName
          filled = filled.replace(sp, '$' + varName)

        } else {
          //no var in tem, in x, just regard as text and show it
          filled = filled.replace(sp, sp.match(/{{(.+)}}/)[1] )
        }
      })

      return filled //once space is there, must give something out

    } else { //no space
      return x.template
    }
  }
  /*
    // START
    if (x.template && x.template != '') {
      //template prop must be provided and not blank
  
      let space = x.template.match(/{{(.+?)}}/g) //space is {{...}}
      let filled = x.template
  
      if (space) { // space is {{..space..}}
  
        space.forEach(sp => {
          let varName = sp.match(/(?<=\$)\w+/) //1 var per space only
  
          if (varName && varName in x) {
            //has var & exist in the x
            let opt = sp.match(/\((.+)\)/) // (..option..)
  
            if (opt) {
              //there's option
  
              let optSet = opt[1].split(';') //(tag=option;default=salad)
              let part = optSet[0].split('=') //(tag=li)
  
              if (part[0] == 'tag') {
                let tag = part[1] // tag=li so tag is li
                let htmlTrans = '' //translate to html
  
                if (Array.isArray(x[varName]) && tag.match(/^li$|^option$/)) {
                  // for tag tr/li/option the var has to be array
                  let tagHead = '<' + tag + '>'
                  let tagEnd = '</' + tag + '>'
  
                  //loop var to make each html element
                  x[varName].forEach(v => {
  
                    if (tag == 'option' && optSet[1]) { // for <option>
                      let part = optSet[1].split('=')
                      if (part[0] == 'default' && part[1] == v) {
                        // default=salad
                        // if default matched we'll make it the default item
                        htmlTrans += '<option selected>' + v + '</option>'
                      } else {
                        htmlTrans += '<option>' + v + '</option>'
                      }
  
                    } else {
                      //not <option> and only 1 option
                      htmlTrans += tagHead + v + tagEnd
                    }
                  })
                  filled = filled.replace(sp, htmlTrans)
  
                } else if (Array.isArray(x[varName]) && tag.match(/^tr$/)) {
                  // this to make a table
                  htmlTrans += '<tr>'
                  //make table head
                  for (field in x[varName][0]) { //take first row as head
                    htmlTrans += '<th>' + field.slice(0,1).toUpperCase() + field.slice(1) + '</th>'
                    //make the header always title case like Title
                  }
                  htmlTrans += '</tr>'
  
                  //make body
                  x[varName].forEach(row => {
                    htmlTrans += '<tr>'
                    for (field in row) {
                      htmlTrans += '<td>' + row[field] + '</td>'
                    }
                    htmlTrans += '</tr>'
                  })
                  filled = filled.replace(sp, htmlTrans)
  
                } else {
                  // the var & tag mismatch gives varName instead
                  filled = filled.replace(sp, '$' + varName)
                }
  
              } else if (opt[1].match(/if .+/)) {
                //conditional option like {{(if $role=nonUser) disabled || null}}
  
                let condiOpt = opt[1].match(/if (.+)/)[1] // $varName=value
  
                if (condiOpt.includes('!=')) {
                  // condition is 'not equal'
                  let part = condiOpt.split('!=')
                  let varName = part[0].slice(1)
                  let value = part[1]
                  let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                  let contPart = cont.split('||')
  
                  if (x[varName] != value) {
                    filled = filled.replace(sp, contPart[0].trim() )
                  } else {
                    if (!contPart[1] || contPart[1].trim() == 'null') {
                      filled = filled.replace(sp, '')
                    } else {
                      filled = filled.replace(sp, contPart[1].trim() )
                    }
                  }
  
                } else if (condiOpt.includes('=')) {
                  // condition is 'equal'
                  let part = condiOpt.split('=')
                  let varName = part[0].slice(1)
                  let value = part[1]
                  let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                  let contPart = cont.split('||')
  
                  //for case: (if $role=aaa|bbb|ccc)
                  let matched = false
                  if (value.includes('|')) {
                    let many = value.split('|')
                    matched = many.includes(x[varName])
                  } else {
                    matched = x[varName] == value
                  }
  
                  if (matched) { //matched
                    filled = filled.replace(sp, contPart[0].trim() )
                  } else { //not matched
                    if (!contPart[1] || contPart[1].trim() == 'null') {
                      //if no content for false or put null, show blank
                      filled = filled.replace(sp, '')
                    } else {
                      //not null so fill with the provided content
                      filled = filled.replace(sp, contPart[1].trim() )
                    }
                  }
  
                } else if (condiOpt.includes('>')) {
                  // 'more than'
                  let part = condiOpt.split('>')
                  let varName = part[0].slice(1)
                  let value = part[1]
                  let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                  let contPart = cont.split('||')
  
                  if (x[varName] > value) { //matched
                    filled = filled.replace(sp, contPart[0].trim() )
                  } else { //not matched
                    if (!contPart[1] || contPart[1].trim() == 'null') {
                      //if no content for false or put null, show blank
                      filled = filled.replace(sp, '')
                    } else {
                      //not null so fill with the provided content
                      filled = filled.replace(sp, contPart[1].trim() )
                    }
                  }
  
                } else if (condiOpt.includes('<')) {
                  // 'less than'
                  let part = condiOpt.split('<')
                  let varName = part[0].slice(1)
                  let value = part[1]
                  let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                  let contPart = cont.split('||')
  
                  if (x[varName] < value) { //matched
                    filled = filled.replace(sp, contPart[0].trim() )
                  } else { //not matched
                    if (!contPart[1] || contPart[1].trim() == 'null') {
                      //if no content for false or put null, show blank
                      filled = filled.replace(sp, '')
                    } else {
                      //not null so fill with the provided content
                      filled = filled.replace(sp, contPart[1].trim() )
                    }
                  }
  
                } else {
                  //out of these 4 conditions, just show the 'true code'
                 
                  let cont = sp.match(/{{\(.+\)(.+)}}/)[1].trim()
                  let contPart = cont.split('||')
                  filled = filled.replace(sp, contPart[0].trim() )
                }
              }
  
            } else {
              //no option, just a var
              filled = filled.replace(sp, x[varName])
            }
  
          } else if (varName && !(varName in x)) {
            //has var in tem but not in x, just give $varName
            filled = filled.replace(sp, '$' + varName)
  
          } else {
            //no var in tem, in x, just regard as text and show it
            filled = filled.replace(sp, sp.match(/{{(.+)}}/)[1] )
          }
        })
  
        return filled //once space is there, must give something out
  
      } else { //no space
        return x.template
      }
  
     
    }*/ 
  else { //no template or blank template
    return ''
  }
  
  /* DONE NOTE, 2024-02-24 12:17

  Everything done. It runs on:

    {{just a text}} //just show the text in the space
    {{$var}}        //just show the var value
    {{$var texttttt}}   //shows only the var value
    <ol>{{$food (tag=li)}}</ol>
    <select>{{$food (tag=option;default=salad)}}</select>
    <table>{{$customer (tag=tr)}}</table>   //auto show the table's head in Title case
    {{(if $role!=user) disabled || null}}   //if role isn't user put 'disabled'
    ^ can skip the null like: ....disabled}}    //and it done
    ^ the condition can do: =, !=, >, < these 4 logics are supported

    addition:
    {{(if $role=manager|staff|user) disabled}}  //so each of 3 roles will be matched. We can put as many as value to match with the data

  Run the program like:
    document.body.innerHTML = xtem({template: ,...})



  More feature to add:
    1. add {{(if $role=manager|staff|user) xxxxxxx}} //so can have multiple roles
      //done 2024-02-24 23:00 @m

    2. changed name to makeUp() as it's like we make up the html codes by filling the template with variables.


  2024-03-17  
    1. added feature to conditional option like: {{(if $role=admin) $aaa || $bbb }} ...now if true show the $aaa value, if false shows the $bbb value. Tested for all logics: =, !=, >, <

  */
  
}










// SESSION DATA HANDLING ///////////////////////////////////////

// NOT USE, use sess.js instead, m, 2024-9-25 7:49

/* Handle sessionStorage like a little db or like an object. This maybe litterally call a "session base" or sessb. We aim to use this little thing to keep some secret info in the sessionStorage.

  xb.sessb.r()              == read whole data
  xb.sessb.r('sessionId')   == read sessionId 
  xb.sessb.w({aaa: ___})    == writes data

  keeps data in json in the sessionStorage.sessb variable. Keeps data like this:

  sessionStorage.sessb = {
    aaa: ___, bbb: ___, ccc: ___, =and goes on=
  }

  * will encrypt the sessb too to make it secure
*/
/*
xb.sess = {}   //main object

xb.sess.r = async function (keyx='') {
  /* The read is doing 1-by-1 like 
      xb.sessb.r('name')
      xb.sessb.r('age')
      or to get whole data: xb.sessb.r()
  */
/*
  if (!keyx) {
    //if keyx == '' reads the whole data
    let readx = sessionStorage.getItem('sess')
    if (readx) {
      readx = JSON.parse(
        await xb.dec(
          readx, 
          await xb.masterKey()
        )
      )
      return readx
    } else {
      return null
    }

  } else if (typeof keyx == 'string') {
    //keyx is the key of object we need to find
    let readx = sessionStorage.getItem('sess')
    if (readx) {
      readx = JSON.parse(
        await xb.dec(
          readx,
          await xb.masterKey()
        )
      )

      if (keyx in readx) return readx[keyx]
      else return false
      
    } else {
      return null
    }

  } else {
    return false
  }
}

xb.sess.w = async function (obj='') {
  /* Writes data into the sessb:
        xb.sessb.w({name:'john', age:23, note:'this is good guy'})

    ! if we put a duplicated key, it will replace the existing one

  */
/*
  if (!obj || typeof obj != 'object') return false

  if (Array.isArray(obj)) {
    //don't accept array
    return false

  } else if (Object.keys(obj).length) {
    //object like {name:'john', age:23, note:'this is good guy'}
    let readx = sessionStorage.getItem('sess')

    if (readx) {
      readx = JSON.parse(
        await xb.dec(
          readx,
          await xb.masterKey()
        ) 
      )
      
      for (keyx in obj) {
        readx[keyx] = obj[keyx]
      }
      
      sessionStorage.setItem('sess', 
        await xb.enc(
          JSON.stringify(readx),
          await xb.masterKey()
        )
      )
      return true

    } else {
      //don't have existing sessdb so this is new write
      readx = {}

      for (keyx in obj) {
        readx[keyx] = obj[keyx]
      }
      
      sessionStorage.setItem('sess', 
        await xb.enc(
          JSON.stringify(readx),
          await xb.masterKey()
        )
      )
      return true
    }
  }
}


xb.sess.c = function () {
  /* To clear the sessb from sessionStorage */
/*  sessionStorage.removeItem('sess')
  if (!sessionStorage.getItem('sess')) return true
  else return false
}


/* everything works fine for all r,w,c functions. Now uses the xb.acode() for the key as temporarily. Will need to find more secured one. */




// SOME SECURITY ///////////////////////////////////////////////////

xb.masterKey = async function () {
  /* This generates a fixed key (sha256) for a session. So it can be used in security purposes within a session. ! The issue now is how to hide this code? */

  return await xb.hash(
    xb.secure.sessionId +
    navigator.userAgent +
    location.host +
    xb.secure.masterSalt
  )
}




// initialize somethings ///////////////////////////////////////

//xb.getIp().then(ip => xb.ip = ip)


/////////////////////////////////
xb.popup = function (x) {
  // controls the popup content
  // x = {state:'on|off', template:'<<$template>>', color:'<<$color>>'}
  // x.color must be w3.css color class

  if (x.state == 'on') {
    if (x.color) {
      popup.querySelector('[x-dim]').className = x.color
    } 

    popup.hidden = false
    
    if (x.html && x.html != '') {
      popup.querySelector('[x-popup-content]').innerHTML = x.html
    }
  } else if (x.state = 'off') {
    popup.hidden = true
  } else {
    // wrong input
  }
}


///////////////////////////////////
xb.message = function (x) {
  // controls the messageBox
  /* xb.message({
      state:  'on', 
      title:  'sssss', 
      message:'sssss',

    }) */

  if (x.state == 'on') {
    messageBox.hidden = false
  } else if (x.state == 'off') {
    messageBox.hidden = true
  }
}





///////////////////////////////////
/* xb.sync() -- every 5sec it sync data from xb.syncQueue to core$sync --> xs.mdb.update(?) */

xb.syncActive = false
xb.syncIntervalSet = 5000
xb.syncLog = []
xb.syncLogAllow = 20 //set how many logs we keep 

xb.sync = function (opt='') {
  xb.syncCode = undefined

  if (opt != 'stop') {
    xb.syncCode = setInterval(async () => {
      if (xb.syncQue != 0) {
        
        //log
        let log = {
          req: {
            doc: [],
            time: Date.now()
          }, 
          resp: {
            msg: '',
            time: ''
          }
        }
        xb.syncQue.forEach(d => log.req.doc.push(d._uuid))
        //record _uuid of requesting docs

        //run
        let resp = await xb.$({
          act:  '$sync', 
          data: xb.syncQue
        })

        //handle resp
        log.resp = {
          msg: resp,
          time: Date.now()
        }

        if (xb.syncLog.length >= xb.syncLogAllow) xb.syncLog.shift()
        xb.syncLog.push(log)

        xb.syncQue = [] //clear queue
        //console.log(resp)
        //return resp // how to handle this?, pending
      }
    }, xb.syncIntervalSet)
    
    xb.syncActive = true  //use this line instead of below
    //return 'xb.sync() started #' + xb.syncCode

  } else if (opt == 'stop') {
    clearInterval(xb.syncCode)
    xb.syncActive = false
    return 'xb.sync() stopped'

  } else {
    return false
  }

  /*
  time, note, by
  2024-05-12 11:37, added xb.syncLog fea and test-passed, m
  16:04, added xb.syncLog and fea that logging in format of req & resp ,m
  */
}
//xb.sync()


///////////////////////////////////
/* xb.update() -- every 5sec it send ?docs from xb.updateQueue to xs/core$checkUpdate > xs.mdb.check(?) and then respond back with newer ?docs */

xb.updateActive = false
xb.updateIntervalSet = 5000
xb.updateLog = []
xb.updateLogAllow = 20
xb.updateQueState = 'clear' // clear | requesting | responded
xb.updateQueNum = Date.now()
xb.updateQueEnable = true

xb.update = function (opt='') {
  xb.updateCode = undefined

  if (opt != 'stop') {
    xb.updateActive = true
    xb.updateCode = setInterval(async () => {

      if (xb.updateQue != 0) {

        //queue
        xb.updateQueState = 'requesting'
        xb.updateQueEnable = false 


        //log
        let log = {
          queNum: xb.updateQueNum,
          req:    xb.updateQue,
          resp: {
            msg: '',
          }
        }

        //run
        let resp = await xb.$({
          act:'$checkUpdate',
          data: xb.updateQue // [ ?updateReq, ???]
        })

        //open new queue
        xb.updateQueState = 'responded'
        xb.updateQueEnable = true
        xb.updateQueNum = Date.now()
        xb.updateQue = []
        xb.updateQueState = 'clear'
        
        //handle resp, all newer docs will be written to xb.browsDb
        log.resp = {
          msg:  resp,
          //time: Date.now()
        }

        //maintain log size
        if (xb.updateLog.length >= xb.updateLogAllow) {
          xb.updateLog.shift()
        }
        xb.updateLog.push(log)

        //if there's update, write to browsDb
        if (!resp.noUpdate) {
          xb.browsDb.write(resp) //20240511, test-passed, m
          console.log('got update')
        } 
      }
    }, xb.updateIntervalSet)

    return {
      program:  'xb.update', 
      active:   xb.updateActive, 
      msg:      'xb.update started'
    }

  } else if (opt == 'stop') {
    clearInterval(xb.updateCode)
    xb.updateActive = false

    return {
      program:  'xb.update',
      active:   xb.updateActive,
      msg:      'xb.update stopped'
    } 

  } else {
    return false
  }
 
}
//xb.update()



/////////////////////////////////////
xb.pushUpdateQue = function (xdoc='') {
  /* 
  put the {xdoc} into it and it pushes all xdoc into the [xb.updateQue] in format of: ?_uuid.?ts.?sha1 like '8b524e9c-db35-49ed-bfc1-a6012b136d28.1715772695849.57a96e02a2a7880fdef7b3d558c20a85cd8ec0f1'
  
  so this reduce bandwidth in the network

  output returns the xb.updateQueNum which is ?ts format
  */

  //if (xdoc == '' || !xdoc.length || !Object.keys(xdoc).length) return false

  if (xb.updateQueEnable) {

    if (typeof xdoc == 'object' && !Array.isArray(xdoc)) {
      xb.updateQue.push(
        xdoc._xd.collection + '_' + xdoc._uuid + '_' + xdoc._time + '_' + xdoc._xd.cert
      )

    } else if (Array.isArray(xdoc)) {
      xdoc.forEach(d => xb.updateQue.push(
        d._xd.collection + '_' + d._uuid + '_' + d._time + '_' + d._xd.cert
      ))

    } else {
      return false
    }
    return xb.updateQueNum

  } else {
    //if the queue disable, you have to loop and get back again yourself
    return {
      program: 'pushUpdateQue(?)',
      updateQueDisable: true
    }
  }

  /*
  time, note, by
  2024-05-12 21:53, test-passed / run this func and get queue#, m 
  2024-05-16 11:08, revising to use ?updateReq format rather than sendng the whole xdoc, m
  2024-05-16 11:59, above done, m


  */
}










//////////////////////////////////////
// xb.qs() - is shorten of querySelector()
// xb.qsa() - shorten of querySelectorAll()
xb.qs = function (el) {
  let found = document.querySelector(el)
  found.qs = found.querySelector
  found.qsa = found.querySelectorAll
  return found
}

xb.qsa = function (el) {
  let found = document.querySelectorAll(el)
  found.qs = found.querySelector
  found.qsa = found.querySelectorAll
  return found
}

//tested both ok, 20240508.1650


////////////////////////////////////
// xb.flat -- flattens the multi-levels object to 1 level
/*

  xb.flat.$( 
    { 
      aaa:{
        bbb:{
          ccc: 555
        }
      }
    }
  )

  output will return .... {'aaa.bbb.ccc': 555}

*/

xb.flat = {
  o: {},
  motherKey: '',
  motherOj: '',
  topLevel: true,
  levelInFamily: 0,
  activeFamily: '',
  family: {}
}

xb.flat.$ = function (i,upperKey=0,family=0) {
  
  if (typeof i == 'object' && !Array.isArray(i)) { //valid check
    
    //very start point
    if (!this.motherKey) {
      this.motherKey = Object.keys(i),
      this.motherOj = i
      this.o = {}
    } 

    let loopCount = 0

    for (key in i) {
      if (i == this.motherOj) {
        this.topLevel = true
        this.levelInFamily = 0
      }  
      if (upperKey == family) {
        this.levelInFamily = 0
      }

      //set family
      if (!this.activeFamily) {
        this.activeFamily = key //starts at first motherKey
        this.family[this.activeFamily] = []
      } else if (key != this.activeFamily && this.topLevel) {
        //key not same of activeFamily && this is topLevel =mean= change to new family
        this.activeFamily = key 
        this.family[this.activeFamily] = []
      }

      if (typeof i[key] == 'object' && !Array.isArray(i[key])) { 
        //if obj, goes down deeper
        if (this.topLevel) {
          this.levelInFamily = 0
          this.family[key].push(key)
        } else {
          this.levelInFamily++
          this.family[family].push(key)
        }
        this.topLevel = false
        this.$(i[key], key, this.activeFamily)  //recursive ***

      } else { //when reached this, it's bottom of the obj
        if (this.topLevel) {
          this.o[key] = i[key]
        } else {
          this.o[ this.family[family].slice(0,this.levelInFamily+1).join('.') + '.' + key] = i[key]
        }
      }

      //to ensure the levelInFamily down correctly
      loopCount++
      if (loopCount == Object.keys(i).length) {
        this.levelInFamily--
      } 

      //this is the end point of the whole process
      if (loopCount == this.motherKey.length && i == this.motherOj) {
        //reset all values
        this.motherKey = '',
        this.motherOj = '',
        this.topLevel = true,
        this.levelInFamily = 0,
        this.activeFamily = '',
        this.family = {}
        
        return this.o
      }
    }

  } else {
    //not obj or array
    //console.log(false)
    return false
  }
}









//////////////////////////////////////////////////////////////////////////
// xb.browsDb -- browser database

//NOT USE, use xarr.js or sess.js instead -- m,2024-9-25 7:53 +7

/* 
    xb.browsDb.write( ?xdbDoc | ?xdbDocSet ) ...write data
      ^ write only if the _time of input is newer & write only the fields provided by the input, not replacing whole doc

    xb.browsDb.read( ?uuid | {name: ?, age: ?} ) ...read

    xb.browsDb.update(?uuid | {queryKey:?}, {key:?, key1:?, key2:?})
      ^ may take this off as the Write already done this job

    xb.browsDb.delete(?uuid)

    every update must stamp the _time 

  #note
    20240510.0810, now the Write is doing good, can handle both ?doc & ?docSet and only write the files provied by the Input





*/
/*
xb.browsDb = {
  about: {
    programName:  'browsDb',
    brief:        'a database in the browser which is very simple memory db.',
    releasedDate: '2024-05-11',
    version:      '0.1',
    license:      'none',
    programmer:   'M, http://m.me/mutita.org',
    input:        'various types',
    output:       'depends on the command',
    syntax:       'let v = xb.browsDb.r( ?uuid )',
    install:      '<script src="xdev_b.js"></script>'
  },
  autoUpdateActive:   false,  //default
  autoUpdateInterval: 10000,   //check update every ?sec
  autoUpdateCode:     '',     //interval id
  tank:               []      //keep data here
}


/////////////////////////////////////
/*xb.browsDb.r = xb.browsDb.read = function (v='') {
  /* 
      xb.browsDb.read()             ...read all data
      xb.browsDb.read( ?uuid )      ...read only this uuid
      xb.browsDb.read( {key: ?} )   ...allows only 1 query
      xb.browsDb.read({ 'stat.lovecount': 10 })   ...multi-level key
      xb.browsDb.r(?)   ...short name

      ! the multi-level key allows only 2 levels like {'aaa.bbb': ?}
  *//*
  
  if (v == '') {
    return xb.browsDb.tank    //read all

  } else if (typeof v == 'string' && v.length == 36) {
    //assumes this is uuid
    let outp = xb.browsDb.tank.find(d => d._uuid == v)
    if (outp) return outp
    else return []
  
  } else if (typeof v == 'object' && !Array.isArray(v) && Object.keys(v).length) {
    //this is the query object
    // xb.browsDb.read( {name: 'john'} ) ...allows 1 query only

    let outp = ''
    let ky = Object.keys(v)[0]

    //if multi-level, take only 1 level
    let multi = ''
    if (ky.includes('.')) {
      multi = ky.split('.').slice(0,2).join('?.')
    }

    if (v[ky] instanceof RegExp) {
      //filter by regexp

      if (multi) {
        outp = xb.browsDb.tank.filter(
          d => eval(`d.${multi}`)?.toString().match(v[ky])
        )
      } else {
        outp = xb.browsDb.tank.filter(
          d => d[ky]?.toString().match(v[ky]) 
        )
      }

    } else {
      //just look for equal value
      
      if (multi) {
        outp = xb.browsDb.tank.filter(
          d => eval(`d.${multi}`) == v[ky]
        )
      } else {
        outp = xb.browsDb.tank.filter(d => d[ky] == v[ky])
      }
    }

    if (outp.length == 1) {
      return outp[0]
    } else {
      return outp
    }

  } else {
    //invalid
    return []
  }

  /* dev note
  time, note, by
  20240510.1524,  everything seems good now; nearly test-passed; ,m 
  18:43,  test-passed, m 
  *//*
}

*/

//////////////////////////////////////
/*
xb.browsDb.w = xb.browsDb.write = function (v='',opt='') {
  /* syntax
              xb.browsDb.write( ?doc | ?docSet )
              xb.browsDb.w( {?:?}, 'sync') ...also sync to xs.mdb
  */
  /* head note
  time, note, by
  20240510.1703, nearly test-passed, m
  ?, will check if no _uuid & _time, will not write
  2024-05-11 16:09, will add opt into this func so if it is 'sync' it will auto push to the xb.syncQueue, m



  */
/*
  if (Array.isArray(v)) {
    //this is ?xdbDocset

    if (xb.browsDb.tank.length == 0) {
      //if tank is empty, if no _uuid & _time, don't write it

      for (each of v) {
        if (each._uuid && each._time) {
          xb.browsDb.tank.push(each)
          if (opt == 'sync') xb.syncQue.push(each)
          else if (typeof opt == 'function') opt(each)
        }
      }

      if (xb.browsDb.tank.length) {
        return {
          program:  'xb.browsDb.write', 
          writeQty: xb.browsDb.tank.length,
          msg:      xb.browsDb.tank.length == v.length? "fully done" : "partly done"
        }
      } else {
        return {
          program:  'xb.browsDb.write', 
          writeQty: 0,
          msg:      "nothing done"
        }
      }

      

    } else {
      //tank not empty, push in 1 by 1
      let addedQty = 0

      for (each of v) {

        if (each._uuid && each._time) {
          let existedIndex = xb.browsDb.tank.findIndex(d => d._uuid == each._uuid)

          if (existedIndex > -1) {
            //existed, replaces the existing one
            if (each._time > xb.browsDb.tank[existedIndex]._time) {
              //use xb.flat to help updating only fields that the input has, not replacing all the target fields
              let flatEach = xb.flat.$(each)
              for (ky in flatEach) {
                xb.browsDb.tank[existedIndex][ky] = each[ky]
              }
              //xb.browsDb.tank[existedIndex] = each
              addedQty++

              if (opt == 'sync') {
                xb.syncQue.push( xb.browsDb.tank[existedIndex] )
              } else if (typeof opt == 'function') {
                opt(xb.browsDb.tank[existedIndex])
              } 
            }
  
          } else {
            //new, just push
            xb.browsDb.tank.push(each)
            addedQty++
            if (opt == 'sync') xb.syncQue.push(each)
            else if (typeof opt == 'function') opt(each)
          }
        } else {
          //if don't have _uuid & _time just skip
        }
      }

      let outputMsg = 'outputMsg'
      if (addedQty == 0) {
        outputMsg = "nothing done"
      } else if (addedQty > 0 && addedQty < v.length) {
        outputMsg = "partly done"
      } else if (addedQty == v.length) {
        outputMsg = "fully done"
      } else {
        outputMsg = "addeQty is wrongly counted"
      }

      return {
        program:  'xb.browsDb.write', 
        writeQty: addedQty,
        msg:      outputMsg
      }
    }
    

  } else if (Object.keys(v).length && v._uuid && v._time) {
    //this is ?xdbDoc

    let existedIndex = xb.browsDb.tank.findIndex(d => d._uuid == v._uuid)
    if (existedIndex > -1) {
      //this doc already existed, so let's update

      if (v._time > xb.browsDb.tank[existedIndex]._time) {
        //existed, flatten before update

        let flatV = xb.flat.$(v)
        for (each in flatV) {
          xb.browsDb.tank[existedIndex][each] = v[each]
        }

        if (opt == 'sync') xb.syncQue.push(
          xb.browsDb.tank[existedIndex]
        )
        else if (typeof opt == 'function') opt(xb.browsDb.tank[existedIndex])

        return {
          program:  'xb.browsDb.write', 
          writeQty: 1,
          msg:      "done"
        }

      } else {
        //_time is not newer so just skipp
        return {
          program:  'xb.browsDb.write', 
          writeQty: 0,
          msg:      "skip because input not newer"
        }
      }

    } else {
      //if not already existed just add
      xb.browsDb.tank.push(v)
      if (opt == 'sync') xb.syncQue.push(v)
      else if (typeof opt == 'function') opt(v)

      return {
        program:  'xb.browsDb.write', 
        writeQty: 1,
        msg:      "done"
      }
    }

  } else {
    return {
      program:  'xb.browsDb.write',
      writeQty: 0,
      msg:      "invalid input"
    }
  }

  /* dev note
  time, note, by
  20240510, test-passed, m
  */
/*}


//////////////////////////////////////
xb.browsDb.d = xb.browsDb.delete = function (v='') {
  /* head note

        xb.browsDb.delete( ?uuid )

        so only take ?uuid and deleting only 1 doc at a time

  */
/*
  if (!v || typeof v != 'string' || v.length != 36) return {
    program:  'xb.browsDb.delete',
    msg:      'invalid input'
  }

  let indexx = xb.browsDb.tank.findIndex(d => d._uuid == v)

  if (xb.browsDb.tank.length == 0) {
    return {
      program:    'xb.browsDb.delete',
      deletedQty: 0,
      msg:        'no data in xb.browsDb.tank'
    }

  } else if (indexx > -1) {
    xb.browsDb.tank.splice(indexx, 1)

    return {
      program:    'xb.browsDb.delete',
      deletedQty: 1,
      msg:        'done'
    }

  } else {
    return {
      program:    'xb.browsDb.delete',
      deletedQty: 0,
      msg:        'not found the doc you deleting'
    }
  }

  /* dev note
  time, note, by
  20240510.1622,  nearly test-passed, m
  1844, test-passed, m

  */
/*}



/////////////////////////////////////
/* xb.browsDb.update(?) -- start/stop the autoUpdate */
/*
xb.browsDb.autoUpdate = function (opt='start') {
  /* default of xb.browsDb will not autoUpdate until the user set it manually */

  //valid check

  //main for start 
/*
  if (opt == 'start' && !xb.autoUpdateActive && !xb.browsDb.autoUpdateCode && xb.browsDb.autoUpdateInterval) {

    xb.browsDb.autoUpdateCode = setInterval(() => {
      /*if (xb.updateQueEnable) {
        xb.browsDb.tank.forEach(d => xb.updateQue.push(d))
      }*/
/*     
      let resp = xb.pushUpdateQue( xb.browsDb.tank )
      // ^ push because we don't want to conflict with other module which may also pushing to the updateQueue as well
    }, xb.browsDb.autoUpdateInterval)

    xb.browsDb.autoUpdateActive = true

  } else if (opt == 'stop' && xb.browsDb.autoUpdateActive && xb.browsDb.autoUpdateCode) {

    clearInterval(xb.browsDb.autoUpdateCode)
    xb.browsDb.autoUpdateActive = false

  } else {
    //invalid
    return false
  }
}

//set xb.browsDb to autoUpdate
xb.browsDb.autoUpdate()






/* dev note for xb.browsDb

time, note, by
20240510.1651,  nearly test-passed, m 
1844, test-passed, m



*/






//////////////////////////////////////
// xb.definiteCopyJ -- copy object in the way that definitely cutting connection from the original object. So we can play anything with the copied one without affecting to the old one.
xb.copyCutJ = function (j) {
  return JSON.parse(
    JSON.stringify(j)
  )
}






//////////////////////////////////////
// xb.certVer(?) -- certify verify doc
/*

#input = ?xdoc

#algorithm
  certify by taking off the _xd and then stringify the doc and + _xd.updater + _xd.updateCode + generalSalt 

  cert = json(doc without _xd) + _xd.updater + _xd.updateCode + generalSalt

#output for ver = true|false, for cert = ?cert

the updater is the one who must certify the doc it updated

*/

xb.verCert = async function (doc='', opt='ver') {
  if (!doc._uuid || !doc._time || !doc._xd /*|| !doc._xd.updater || !doc._xd.updateCode*/ || !opt) {
    return false
  } else {
    //input valid

    if (opt == 'ver' || opt == 'verify') {
      if (!doc._xd.cert) return false
      let copyDoc = xb.copyCutJ(doc)
      delete copyDoc._xd

      let makeCert = await xb.hash(
        JSON.stringify(copyDoc) + doc._xd.updater + doc._xd.updateCode + xb.secure.generalSalt ,1 //sha-1
      )

      if (makeCert == doc._xd.cert) return true
      else return false
    
    } else if (opt == 'cert' || opt == 'certify') {
      let copyDoc = xb.copyCutJ(doc)
      delete copyDoc._xd

      let makeCert = await xb.hash(
        JSON.stringify(copyDoc) + doc._xd.updater + doc._xd.updateCode + xb.secure.generalSalt ,1
      )

      return makeCert
    }

  }
  /*
  time, note, by
  2024-05-17 13:57, test-passed, m
  
  */
}


///////////////////////////////////////////////////////////////////
// xb.elem(at?, act?) -- select html element and then act something
/*
  #selecting elements
    xb.elem('p')
    xb.elem(this)
    xb.elem([ '#view', '[x-card]', {all:'[x-field]'} ])
    xb.elem([ this, {goUpTo:'div'}, {goDownTo:'p'} ])

  #act something on the selected element
    xb.elem(this, {text: 'xyzzzzzzzzzzzzz'})
    xb.elem(this, {class: 'aaa bbb ccc'})
    xb.elem(this, {att: 'name="john" xyz="00000" '})
    xb.elem(this, {style: 'color:red; font-size:36px' })
    xb.elem('p', 'text|html|outer')
    xb.elem('p', {getAtt:'name'})

  #log
    2024-05-20 06:53, changed name to xb.at to make it shorter because we may use it a lot across codes.

  #idea
    may add option about browsDb like
      xb.at('p', {text:'i made changed'}, 'sync') ..sync to browsDb auto
*/


xb.at = xb.elem = function (at='', act='') {
  if (!at) return false
  let finalElement = ''

  if (at instanceof HTMLElement) {
    finalElement = at

  } else if (typeof at == 'string') {
    finalElement = document.querySelector(at)
  
  } else if (Array.isArray(at) && at.length) {
    // xb.elem([ '[x-card]','[x-love-icon]' ])
    // xb.elem([ this, 'small' ])
    
    let looop = []
    at.forEach( (item,index) => {
      if (index == 0) {
        //this is init stage
        looop.push( xb.elem( item ) )

      } else {
        //this is already in the loop
        if (looop[ index - 1] instanceof HTMLElement || looop[ index - 1] instanceof NodeList) {

          if (typeof item == 'string') {
            looop.push(
              looop[ index -1].querySelector(item)
            )
          } else if (typeof item == 'object' && Object.keys(item).length) {
            // xb.elem([ this, {all:'p'} ])
            // el.querySelectorAll('p')
            let key = Object.keys(item)
            if (key[0] == 'all') {
              looop.push(
                looop[ index -1 ].querySelectorAll(item.all)
              )
            } else if (key[0].toLowerCase() == 'godownto') {
              looop.push(
                looop[ index - 1 ].querySelector(item[ key[0] ])
              )
            } else if (key[0].toLowerCase() == 'goupto') {
              looop.push(
                looop[ index -1 ].closest( item[ key[0] ])
              )
            }
          }

        }
      }
    })
    finalElement = looop[looop.length -1]

  } else if (typeof at == 'object' && Object.keys(at).length) {
    // xb.elem( {all:'[x-card]'} )
    let key = Object.keys(at)
    if (key[0] == 'all') {
      finalElement = document.querySelectorAll(at[ key[0] ])
    } 

  } else {
    //invalid
    return false
  }

  // action part --------------------------------------------
  if (!act || finalElement instanceof NodeList) {
    
    //we don't allow for NodeList as it could destroy the page so right now allows only 1 element to do actions on it. But may review this policy after this

    return finalElement

  } else {
    //there's action part so we'll do some tasks here

    if (typeof act == 'string') {
      // xb.elem('p', 'text|html|outer') ...to get values of textContent,...
      switch (act) {
        case 'value':
          return finalElement.value
          break
          
        case 'text':
          return finalElement.textContent
          break

        case 'html':
          return finalElement.innerHTML
          break

        case 'outer':
          return finalElement.outerHTML
          break

        case 'class':
          return finalElement.classList
          break

        case '_uuid':
          return xb.puuid( finalElement.id.slice(1) )
          break

        case 'hide':
          return finalElement.hidden = true
          break

        case 'show':
          return finalElement.hidden = false
          break

        case 'json':
          //get json from the x-json attribute
          if (finalElement && finalElement.hasAttribute('x-json')) {
            return finalElement.getAttribute('x-json')
          }
          break

        case 'object':
          //get json from x-json att and then parse to object
          if (finalElement && finalElement.hasAttribute('x-json')) {
            return JSON.parse( finalElement.getAttribute('x-json'))
          }
          break

        default:
          return finalElement
      }

    } else if (typeof act == 'object' && Object.keys(act).length) {
      for (key in act) {
        switch (key) {
          case 'text':
            // {text: ???? }
            finalElement.textContent = act.text
            break

          case 'html':
            finalElement.innerHTML = act.html
            break

          case 'outer':
            finalElement.outerHTML = act.outer 
            break

          case 'getAtt':
            // xb.elem(?, {getAtt:'x-field'})
            return finalElement.getAttribute(act.getAtt)
            break

          case 'setAtt':
            // xb.elem(?, {setAtt: 'x-field="text" '})

            if (act.setAtt.includes(' ')) {
              //set many att in 1 line like {setAtt:'a="100" b="200" '}
              let attSet = act.setAtt.trim().split(' ')

              attSet.forEach(att => {
                let part = att.split('=')
                part.forEach((item,index) => part[index] = part[index].trim())
                part[1] = part[1].slice(1,-1)
                finalElement.setAttribute( part[0], part[1] )  
              })

            } else {
              // 1 att
              let part = act.setAtt.split('=')
              part.forEach((item,index) => part[index] = part[index].trim())
              part[1] = part[1].slice(1,-1)
              finalElement.setAttribute( part[0], part[1] )
            }
            break
            //test-passed

          case 'addClass':
            // xb.elem(?, {addClass: 'aaa bbb ccc'})
            if (act.addClass.includes(' ')) {
              let classSet = act.addClass.split(' ')
              classSet.forEach(c => finalElement.classList.add(c))
            } else {
              finalElement.classList.add(act.addClass)
            }
            break
            //test-passed

          case 'removeClass':
            // xb.elem(?, {removeClass: 'aaa bbb ccc'})
            if (act.removeClass.includes(' ')) {
              let classSet = act.removeClass.split(' ')
              classSet.forEach(c => finalElement.classList.remove(c))
            } else {
              finalElement.classList.remove(act.removeClass)
            }
            break //ok

          case 'hasClass':
            // xb.elem(?, {containClass: 'aaa'}) ...check only 1 class at a time
            return finalElement.classList.contains(act.hasClass)
            break //ok

          case 'toggleClass':
            finalElement.classList.toggle(act.toggleClass)
            break //ok, 1 class at a time only

          case 'setStyle':
            // xb.elem(?, {setStyle:'color:red; font-size:36px'})
            //use this to set multiple styles to elem for other use the native way should be enough

            let styleSet = act.setStyle.split(';')
            styleSet.forEach(sty => {
              let part = sty.split(':') //color:red
              finalElement.style[xb.toCamel2( part[0].trim() )] = part[1].trim()? part[1].trim() : ''
            })
            break //ok

          default:
            return finalElement
        }
      }
    }


  }
  /*
  time, note, by
  2024-05-18 23:48, done a lot esp for the at task / the act part also doing some, m
  2024-05-19 13:20, most of the things are going well / nearly test-passed for all, m
  2024-09-28 12:33 +7,added hide & show in the Action part,tested=ok,m

  */
}


xb.help.at = {
  about:'html element selection & action tool',
  use:'xb.at(#ELEMENT, #ACTION)',
  exam:'xb.at("p","text") ~get textContent from p element',
  exam1:'xb.at([ this, "p"], {text:12345} ~at this element and select p and then set textContent to 12345',
  note:'the selection is based on the querySelection method'
}








///////////////////////////////////////
//xb.convId -- converts _uuid to ?xElemId and vise versa
xb.convId = function (uu) {
  //in case the uu is _uuid, converts to xElemId
  if (typeof uu == 'string' && uu.length == 36 && uu.includes('-')) {
    return 'x' + xb.puuid(uu)
  } else if (typeof uu == 'string' && uu.length == 33 && uu.match(/^x/)) {
    //case uu is xElemId, converts to _uuid
    return xb.puuid( uu.slice(1) )
  } else {
    //invalid
    return false
  }

  /*
  time, note, by
  2024-05-24 17:11, test-passed, m
  */
}

xb.help.convId = {
  about:'convert uuid to x_elem_id which in form of x[--plain uuid--] so we can use it for id of the html elements. But it converts back from the x_elem_id to typical uuid as well',
  use:'let id = xb.convId( #UUID | #X_ELEM_ID )'
}





xb.goodUuid = function (UUID) {
  //check if the Input good UUID? Returns true or false

  if (!UUID || typeof UUID != 'string') return false
  
  let resul = UUID.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i)

  if (resul) return true
  else return false
}



//-----------------------------------------------------------------
//read all input & other fields from a form element, output is object


xb.readForm = function (FORM_ELEM) {
  if (!FORM_ELEM) return false
  if (!(FORM_ELEM instanceof HTMLElement)) FORM_ELEM = xb.at(FORM_ELEM)

  let allInputElem = xb.at([FORM_ELEM, {all:':is(input,textarea,select)'}])
  let formData = {}

  allInputElem.forEach(v => {
    if (v.type == 'radio') {
      formData[v.name] = FORM_ELEM[v.name].value
    
    } else if (v.type == 'checkbox') {
      if (v.name in formData) {
        //already have this checkbox value
        if (v.checked) formData[v.name].push(v.value)
      } else {
        //2nd onwards, of the checkbox
        if (v.checked) formData[v.name] = [v.value]
        else formData[v.name] = []
      }

    } else {
      formData[v.name] = v.value
    }
  })     

  return formData
}

xb.help.readForm = {
  about   :'reading data from a form, output is an object',
  use     :'xb.readForm(#FORM_ELEM)',
  exam    :'let formData = xb.readForm(xyz)',
  test    :'ok',
  updated :'Fri Oct 11 2024 09:21:20 GMT+0700 (Indochina Time)',
  by      :'@nex-era',
  version :'1.1',
  note:[
    { time:'2024-10-11 08:38',
      text:'need work to support checkbox input too',
      by:'@nex_era'
    },
    { time:'2024-10-11 09:18',
      text:'now all done, supporting checkbox & select & textarea as long as you put them in the form element',
      by:'@nex-era', 
      version:'1.1'
    },
    { time:'Fri Oct 11 2024 11:11:15 GMT+0700 (Indochina Time)',
      text:'password type also ok but may be in future we may do something like encrypt? not clear about this yet.',
      by:'@nex-era'
    }
  ]
}

xb.note.push({
  time  :'Fri Oct 11 2024 09:21:20 GMT+0700 (Indochina Time)',
  text  :'completely added the readForm() v1.1',
  by    :'@nex-era',
  test  :'ok'
})




//-------------------------------------------------------------------
//make <table>.... string from object array

xb.help.makeTableFrom = {
  about:'make table string from object-array input',
  use:'xb.makeTableFrom( #ARRAY_OBJ, #OPT_OBJ )',
  exam:'targetElem = xb.makeTableFrom([...])',
  note:'#OPT_OBJ can have {id:?, name:?, row:true}',
  test:'ok',
  by:'@nex-era'
}


xb.makeTableFrom = (OBJ_ARR, OPT={id:'', name:'', row: false}) => {
  
  if (!OBJ_ARR || !Array.isArray(OBJ_ARR) || OBJ_ARR == '' || typeof OBJ_ARR[0] != 'object') return false
  
  let space1 = space2 = ''

  //make <table ...> 
  if (OPT.id && OPT.id != '') {
    OPT.id = `id="${OPT.id}"`
    space1 = ' '
  } else OPT.id = ''

  if (OPT.name && OPT.name != '') {
    OPT.name = `name="${OPT.name}"`
    space2 = ' '
  } else OPT.name = ''

  let tbl = '<table' + space1 + OPT.id + space2 + OPT.name + '>'

  //make body string
  OBJ_ARR.forEach( (d,i) => {

    if (typeof d != 'object') return false

    if (i == 0) {
      //head
      tbl += '<tr>'

      if (OPT.row) {
        tbl += '<th>row</th>'
      }

      for (key in d) {
        tbl += '<th>' + key + '</th>'
      }
      tbl += '</tr>'

      //first row
      tbl += '<tr>'

      if (OPT.row) {
        tbl += '<td>' + (i + 1) + '</td>'
      }

      for (key in d) {
        tbl += '<td>' + d[key] + '</td>'
      }
      tbl += '</tr>'

    } else {
      //row 2nd onwards
      tbl += '<tr>'

      if (OPT.row) {
        tbl += '<td>' + (i + 1) + '</td>'
      }

      for (key in d) {
        tbl += '<td>' + d[key] + '</td>'
      }
      tbl += '</tr>'
    }
  })

  tbl += '</table>'
  return tbl
}



//-------------------------------------------------------------
//make <ol> or <ul>.... string from array of the list

xb.makeListFrom = (ARR, OPT={type:'ol', id:'', name:''}) => {

  if (!OPT.type) OPT.type = 'ol'
  if (!ARR || ARR == '' || !Array.isArray(ARR) || !OPT.type?.match(/^ol$|^ul$/) ) return false

  let idBlock = nameBlock = ''
  if (OPT.id && OPT.id != '')     idBlock   = ` id="${OPT.id}"` 
  if (OPT.name && OPT.name != '') nameBlock = ` name="${OPT.name}"`

  let lis = '<' + OPT.type + idBlock + nameBlock + '>'
  
  ARR.forEach(v => {
    lis += '<li>' + v + '</li>'
  })

  lis += '</' + OPT.type + '>'
  return lis
}

xb.help.makeListFrom = {
  about   :'put array of list into it and you get a list html string',
  use     :'xb.makeListFrom( #ARRAY_OF_LIST, #OPTIION )',
  exam    :'document.body.innerHTML = xb.makeListFrom(["thailand","laos","myanmar"],{type:"ul"})',
  note    :'if no option the default is ol',
  test    :'ok',
  by      :'@nex-era',
  updated :'Sat Oct 12 2024 10:21 GMT+0700'
}





//-------------------------------------------------------------
//make <select>... html string from list in array

xb.makeSelectFrom = (ARR, OPT={id:'', name:''}) => {

  
  if (!ARR || ARR == '' || !Array.isArray(ARR)) return false
  let idBlock = nameBlock = ''
  if (OPT.id && OPT.id != '') idBlock = ` id="${OPT.id}"`
  if (OPT.name && OPT.name != '') nameBlock = ` name="${OPT.name}"`

  let selec = '<select' + idBlock + nameBlock + '>'

  ARR.forEach(o => {
    selec += '<option>' + o + '</option>'
  })

  selec += '</select>'
  return selec
}

xb.help.makeSelectFrom = {
  about :'put option array into it and get html string in <select> format',
  use   :'xb.makeSelectFrom( #DATA_ARRAY, #OPTION )',
  exam  :'elem.innerHTML = xb.makeSelectFrom(["xxxx","yyy"],{id:4444,name:"zzz"})',
  note  :'',
  test  :'ok',
  by    :'@nex-era',
  updated:'Sat Oct 12 2024 10:39:59 GMT+0700'
}


//---------------------------------------------------------------
// convert csv to object array


xb.csvObj = (CSV) => {
  if (typeof CSV != 'string') return false

  let outpu = []
  let allKey = []
  let allRow = CSV.split('\n')

  if (allRow.length == 1) {
    //has only head row, no data rows we give an obj with keys but blank data
    let obj = {}
    allKey = allRow.toString().split(',')
    allKey.forEach(k => {
      obj[k] = ''
    })
    return obj
  }
  
  allRow.forEach( (row,i) => {
    let allField = row.split(',')
    if (i == 0) {
      allField.forEach(h => allKey.push(h))
    } else {
      let obj = {}
      allField.forEach( (d,i) => obj[ allKey[i] ] = d)
      outpu.push(obj)
    }
  })

  return outpu
}

xb.help.csvObj = {
  about:'put csv in and get object back',
  use:'xb.csvObj( #CSV )',
  exam:'let obj = xb.csvObj("name,age,sex\njohn,24,male\n...")',
  test:'ok',
  by:'@nex-era',
  updated:'Sat Oct 12 2024 11:12:54 GMT+0700'
}




//----------------------------------------------------------------
// convert object array to csv

xb.objCsv = (ARR) => {
  if (!Array.isArray(ARR) || ARR == '' || typeof ARR[0] != 'object' || !Object.keys(ARR[0]).length) return false

  let allKey = Object.keys(ARR[0])
  let csv = allKey.toString()

  ARR.forEach(doc => {
    let count = 0
    csv += '\n'

    for (key in doc) {
      count++
      if (count < allKey.length) csv += doc[key] + ',' 
      else csv += doc[key] 
    }
  })

  return csv
}

xb.help.objCsv = {
  about:'put object-array in and get csv out',
  use:'xb.objCsv( #OBJ_ARRAY )',
  exam:'let csvString = xb.objCsv([{xx:?, yy:?, zz:?}, ...])',
  test:'ok',
  by:'@nex-era',
  updated:'Sat Oct 12 2024 11:43:03 GMT+0700'
}

//----------------------------------------------------------------


xb.getStar = ( $NUM_OF_STAR ) => {
  /*
      use this to show star symbols on html
      so if you put 3 in this func, you get 3 black stars and 2 for white
      can use it for showing user score, product score, whatever
  */

  const code = ['&#9733;','&#9734;'] //left is blank star, right is white
  let strin = ''

  for (i = 1; i < 6; i++) {
    strin += (i <= $NUM_OF_STAR)? code[0] : code[1] 
  }

  return strin
}


//-----------------------------------------------------------------------
/*
    get random stuff so you can apply it to any of your dev
*/


xb.randomAz = () => {
  const list = 'abcdefghijklmnopqrstuvwxyz'
  return list.charAt(Math.floor(Math.random()*26))
} //released, tested, @m


xb.random09 = () => {
  return Math.floor(Math.random() * 10)
} //released, tested, @m


xb.randomSym = () => {
  const list = '+-*/!@#$%^&()[]{}<>|:;_~=' // 25 char
  return list.charAt(Math.floor( Math.random()*24) )
} //released, tested, @m


//----------------------------------------------------------------------


/* cookie handling




  test: [
    {mar14t0758:'xb.cookie.clear() tested=ok, all cookies cleared, @devster'}
  ]

-----------------------------------------------------------------------*/
xb.cookie = {
  about: {
    brief       :'let you work with cookie easier',
    version     : '0.1',
    status      : 'dev & test',
    createdTime : '07:53 Mar14/2025 +7',
    license     : 0,
    by          : '@devster/nex-era',
  },
  help: {
    clear: 'xb.cookie.clear() ...clears all cookies'
  }

}

xb.cookie.clear = (param) => {
  if (!param) {
    //no parameter means 'all', so clear all cookies
    document.cookie.split(';').forEach(xyz => {
      const [cookName] = xyz.split('=')
      document.cookie = `${cookName.trim()}=; max-age=0; path=/`
    })
    return document.cookie
    //tested=ok, @devster
  } else {
    // xb.cookie.clear('xsess') ...clear 1 cookie
    if (document.cookie.includes(param + '=')) {
      document.cookie = param + '=; max-age=0'
      return document.cookie
    } else {
      // not found the supplied cookie name
      return false
    }
    //delete 1 cookie test=ok, @devster
  }
}

xb.cookie.get = (param) => {
  //get a cookie value, if no param just give whole cookie
  if (param) {
    try {
      return document.cookie.match(eval('/' + param + '=(.+?)(;|$)/'))[1]
    } catch {
      return false
    }
  } else {
    return document.cookie
  }
  //tested=ok, @devster 12:08 mar14/2025 +7
}






/*  xb.pointer -------------------------------------------------------------
    handle pointer, first start with a longPress
    tested=ok 20:34 mar19/2025 +7
----------------------------------------------------------------------------*/

xb.pointer = {
  longPressSet: {
    howLong : 1000
  }
}

xb.pointer.longPress = ($elem, $runThis) => {

  let timer

  $elem.addEventListener('mousedown', event => {
    event.preventDefault()
    timer = setTimeout( f => $runThis(event), xb.pointer.longPressSet.howLong)
  })

  $elem.addEventListener('touchstart', event => {
    event.preventDefault() //prevent browser to select text
    timer = setTimeout( f => $runThis(event), xb.pointer.longPressSet.howLong)
  },{passive: false})

  //cancel if pointer up before the preset timer
  $elem.addEventListener('mouseup', f => clearTimeout(timer))
  $elem.addEventListener('mouseleave', f => clearTimeout(timer))
  $elem.addEventListener('touchend', f => clearTimeout(timer))
  $elem.addEventListener('touchcancel', f => clearTimeout(timer))
}





/*----------------------------------------------------------------
xb.page -- handles about page tracking, good for web monitoring


-----------------------------------------------------------------*/

xb.page = {
  for     : 'html page tracking stuff',
  created : 'apr14/2025',
  by      : '@devster'
}

xb.page.visitCount = async (_serverUrl, _dataToSend, _mode) => {
  /*  _mode can be simple until advance
      xb.page.loadCount('https://xyz.com/page-load-count')

      example use this to count visit of a page
      const resp = xb.page.loadCount(
        '/nex-web-visit-count',
        { page: location.pathname, lastVisit: Date.now() }
      )
  */
  if (!_serverUrl) return
  if (!_mode) _mode = 'simple'
  if (!_dataToSend) _dataToSend = {test: true}

  try {
    const svResp = fetch(_serverUrl, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json'},
      body    : JSON.stringify(_dataToSend) 
    })
/*
    if (!svResp.ok) {
      throw new Error(`! error: ${svResp.status} ${svResp.statusText}`)
    }
*/
    const svRespOj = await svResp.json()
    return svRespOj

  } catch (error) {
    return error
  }
}