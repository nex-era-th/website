/*const domain = 'http://localhost:4000';

async function fetchThis( data, api ) {
    
  let response = await fetch( domain + api, {
    method  : 'POST',
    headers : {'Content-Type':'application/json'},
    body    : JSON.stringify( data )

  })
  
  return response.json()

}
*/


async function fetchThis( data, api, method = 'POST' ) {
  /*
      works on GET, POST only
  */ 

  method = method.toUpperCase()

  if (method == 'GET') {

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