/* xsend.js

communicates between browser & mongodb atlas data api

use
  <script src="xsend.js"></script>

  let data = await xsend.$({act:'find', body:{collection:?, filter:{?:?}} })


*/

const xsend = {}

//default
xsend.act = 'find'
xsend.initUrl = ''
xsend.runUrl = ''
xsend.method = 'POST'

xsend.token = ''
xsend.tokenInitTime = ''

xsend.headers = {
  'Content-Type':'application/json',
  'Access-Control-Request-Headers':'*',
  'Authorization':'Bearer ' + xsend.token.access_token
}

xsend.initBody = {
  username:'',
  password:''
}

xsend.body = {
  collection: '',
  database:   '',
  dataSource: '',
  projection:  {},
  //filter: {},
  //sort: {},
  //limit: 0
}

xsend.re = ''

// internal tool --------------------------------------------

xsend.tokenValid = function () {
  //checks if the token valids or not
  if (xsend.token) {
    if (Date.now() - xsend.tokenInitTime >= 30*60*60*1000) {
      return false
    } else {
      return true
    }
  } else {
    xsend.token = JSON.parse(sessionStorage.getItem('token'))
    xsend.tokenInitTime = JSON.parse(sessionStorage.getItem('tokenTime'))
    if (Date.now() - xsend.tokenInitTime >= 30*60*60*1000) {
      return false
    } else {
      return true
    }
  }
}



// main func --------------------------------------------------
xsend.$ = async function (j={}) {

  //default
  //if (!xsend.act) xsend.act = 'find'
  if (!j.token) j.token = xsend.token.access_token
  if (!j.act) j.act = xsend.act? xsend.act : 'find'
  if (!j.url) j.url = xsend.runUrl
  if (!j.method) j.method = xsend.method
  if (!j.headers) j.headers = xsend.headers
  if (!j.body) j.body = xsend.body
  if (!j.body.database) j.body.database = xsend.body.database
  if (!j.body.dataSource) j.body.dataSource = xsend.body.dataSource
  if (!j.body.collection) j.body.collection = xsend.body.collection



  switch (j.act) {
    case 'init':
      // xsend.$({act:'init'})
      // normally we auto-init but keep this here incase it needs manual init

      if (xsend.token && Date.now() - xsend.tokenInitTime < 30*60*60*1000) {
        console.log('fail, token still valid')
        return false
      } else {
        xsend.token = sessionStorage.getItem('token')
        xsend.tokenTime = sessionStorage.getItem('tokenTime')
        if (xsend.token && Date.now() - xsend.tokenInitTime < 30*60*60*1000) {
          console.log('fail, token still valid')
          return false
        }
      }

      var re = await fetch(
        xsend.initUrl,
        {
          method:   'POST',
          headers:  {'Content-Type':'application/json'},
          body:     JSON.stringify(xsend.initBody)
        }
      )

      var msg = await re.json()
      xsend.token = msg
      xsend.tokenInitTime = Date.now()
      sessionStorage.setItem('token',JSON.stringify(msg))
      sessionStorage.setItem('tokenTime',xsend.tokenInitTime)
      console.log('xsend init done')
      return true
      break
      //OK, m/2024-04-16 23:04



    case 'find':
      // always do findMany
      // xsend.$({act:'find', body:{collection:?, filter:{?:?}} })

      if (!j.token) j.token = xsend.token.access_token
      var re = await fetch(
        j.url + j.act,
        { 
          method: j.method,
          headers: {
            'Content-Type':'application/json',
            'Access-Control-Request-Headers':'*',
            'Authorization':'Bearer ' + j.token
          },
          body: JSON.stringify(j.body)
        }
      )
    
      var msg = await re.json()

      if (msg.error) {
        console.log('! xsend find error')
        return false
      } else {
        //no error
        xsend.re = msg
        console.log(xsend.re)
        return true
      }

      break
      //OK, m/2024-04-26 23:04



    case 'insert':
      // insert either 1 or many docs 
      // xsend.$({act:'insert',body:{doc:[{$doc},{$doc}, ...]} })

      if (j.body.doc) {
        //has doc, good to go
        if (typeof j.body.doc == 'object' && !Array.isArray(j.body.doc)) {
          //this is 1 doc
          j.act = 'insertOne'
          j.body.document = j.body.doc
          delete j.body.doc
        } else if (Array.isArray(j.body.doc)) {
          //this is many docs
          j.act = 'insertMany'
          j.body.documents = j.body.doc
          delete j.body.doc
        }
        //xsend.act = j.act
        if (!j.token) j.token = xsend.token.access_token

        var re = await fetch(
          j.url + j.act,
          { 
            method: j.method,
            headers: {
              'Content-Type':'application/json',
              'Access-Control-Request-Headers':'*',
              'Authorization':'Bearer ' + j.token
            },
            body: JSON.stringify(j.body)
          }
        )
      
        var msg = await re.json()
  
        if (msg.error) {
          console.log('! xsend insert error')
          return false
        } else {
          //no error
          xsend.re = msg
          console.log(xsend.re)
          return true
        }

      } else {
        //no doc, = invalid
        console.log('! invalid input')
        return false
      }

      break
      // OK 2024-04-17 14:03 m works both single & multi docs



    case 'update':
      // xsend.$({act:'update',body:{collection:?, filter:?, update:?} })
      // always do updateMany

      if (j.body.filter && j.body.update) {
        //good to go
        if (!j.token) j.token = xsend.token.access_token
        var re = await fetch(
          j.url + 'updateMany',
          { 
            method: j.method,
            headers: {
              'Content-Type':'application/json',
              'Access-Control-Request-Headers':'*',
              'Authorization':'Bearer ' + j.token
            },
            body: JSON.stringify(j.body)
          }
        )
      
        var msg = await re.json()
  
        if (msg.error) {
          console.log('! xsend update error')
          return false
        } else {
          //no error
          xsend.re = msg
          console.log(xsend.re)
          return true
        }
  
      } else {
        //invalid
        console.log('! invalid input')
        return false
      }
      break
      // OK 2024-04-17 14:47 m



    case 'delete':
      //do only deleteOne
      // xsend.$({act:'delete', body:{filter:?, collection:?} })

      if (j.body.filter) {
        //valid
        if (!j.token) j.token = xsend.token.access_token
        var re = await fetch(
          j.url + 'deleteOne',
          { 
            method: j.method,
            headers: {
              'Content-Type':'application/json',
              'Access-Control-Request-Headers':'*',
              'Authorization':'Bearer ' + j.token
            },
            body: JSON.stringify(j.body)
          }
        )
      
        var msg = await re.json()
  
        if (msg.error) {
          console.log('! xsend delete error')
          return false
        } else {
          //no error
          xsend.re = msg
          console.log(xsend.re)
          return true
        }

      } else {
        //invalid
        console.log('! xsend delete invalid input')
        return false
      }
      break
      // OK 2024-04-17 16:43 m

    default:
      console.log('wrong command')
  }
  
}


// initialize ----------------------------------------------
xsend.$({act:'init'})



/*
20240416 21:58  now worked. Can find all docs in devnet.member. The token is expired in a period so that we have to take token time to time.

  22:58 added {act:'init'} and let the F embraces the switch command, all good. 

  -further dev : if we try to run a command and get resp 'unauthorized' shall we do init automatically or not?

  -19:12 has init, find, update, delete commands



*/