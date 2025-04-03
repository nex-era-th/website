/* xfetch.js -- try to make the fetch simpler 
keep it as separate file as we can independently distribute to anyone
and maintaining only it. So it can be part of any bigger bigger programs

#guide

  let result = await xfetch('/')
  let result = await xfetch('/',{headers: {xyz:123456} })
  let result = await xfetch('/redis, {
    method:   'post', // get*|post
    content:  'json', // json|text*
    headers:  {something:'xyz'},
    data:     {name:'john',age:24,sex:'male'},
    outputAs: 'json' // text*|json|res ...res just send res object
  })

#tested = ok
#state = review
#released date = 2024-06-04 22:01

****************************************************************/

globalThis.xfetchLog = {
  request: '',
  response: '',
}


const xfetch = async (url, opt={
  method:   'get', // 'post'
  content:  'text', // 'json' 
  outputAs: 'text', // 'json' | 'res' this case just dump res
  headers:  {} //allow setting of headers
}) => {

  if (!url) return false

  /* below prevent defaults lost when there setting only opt.headers */
  if (!opt.method) opt.method     = 'get'
  if (!opt.content) opt.content   = 'text'
  if (!opt.outputAs) opt.outputAs = 'text'
  if (!opt.headers) opt.headers   = {}


  /* below allows to set method in lower-case */
  opt.method = opt.method.toUpperCase()

  /* handle headers */
  if (!Object.keys(opt.headers).length) {
    //no opt.headers set
    if (opt.content == 'text') {
      opt.headers['Content-Type'] = 'text/html;charset=utf-8'
    } else if (opt.content == 'json') {
      opt.headers['Content-Type'] = 'application/json;charset=utf-8'
    }

  } else {
    // has setting of opt.headers , the opt.headers is bigger opt.content
    if (!opt.headers['Content-Type']) {
      if (opt.content == 'text') {
        opt.headers['Content-Type'] = 'text/html;charset=utf-8'
      } else if (opt.content == 'json') {
        opt.headers['Content-Type'] = 'application/json;charset=utf-8'
      }
    } else {
      //if there's setting in opt.headers then don't touch it
    }
  }
   

  var resp 

  if (opt.method == 'GET') {

    xfetchLog.request = {
      url:      url,
      method:   opt.method,
      headers:  opt.headers,
    }
    xfetchLog.requestTime = Date.now()
    
    try {
      resp = await fetch( url ,
        {
          method: 'GET',
          headers: opt.headers
        }
      )
    } catch(error) {
      xfetchLog.request.error = error
      return error
    }
    

  } else if (opt.method == 'POST') {
    if (!opt.data) return false
    if (typeof opt.data == 'object') opt.data = JSON.stringify(opt.data)

    xfetchLog.request = {
      url:      url,
      method:   opt.method,
      headers:  opt.headers,
      body:     opt.data,
    }
    xfetchLog.requestTime = Date.now()

    try {
      resp = await fetch( url,
        { 
          method:   'POST',
          headers:  opt.headers,
          body:     opt.data
        }
      )
    } catch(error) {
      xfetchLog.request.error = error
      return error
    }
    
  
  } else {
    //this leaves for other method
  }

  //output
  xfetchLog.responseTime = Date.now()
  
  if (opt.outputAs == 'res') {
    //just dump the res out
    xfetchLog.response = resp
    return resp

  } else {
    //need translate the res
    try {
      let transformedResp = await eval(`resp.${opt.outputAs}()`)
      xfetchLog.response = transformedResp
      return transformedResp

    } catch (error) {
      console.log(error)
      return false
    }
     
  }
}






/*----------------------------------------------------------------
2024-06-04 18:58, tested=ok, M
22:04, now overall test = ok; now support on get & post only nothing else, M

{ time: '2024-06-07,
  note: 'add try-catch and xfetchLog',
  by:   'M'
}




*/