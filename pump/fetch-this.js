const domain = 'http://localhost:4000';

async function fetchThis( data, api ) {
    
  let response = await fetch( domain + api, {
    method  : 'POST',
    headers : {'Content-Type':'application/json'},
    body    : JSON.stringify( data )

  })
  
  return response.json()

}