// copy this code to the first line of the <head>



const passUrl = ''
const failUrl = ''

//valid
const xcert = sessionStorage.getItem('projex')
if (!xcert || typeof xcert != 'string' || 
  !xcert.match( /^[0-9a-fA-F]{64}$/ )) return false

//work
try {
  const re = await fetch( '/verify-xcert',
    { method:   'POST', 
      headers:  { 'Content-Type':'application/json' },
      body:     { projex: sessionStorage.getItem('projex')}
    }
  )

  let pass = await re.json()
  
  if (pass) {
    if (passUrl) location.href = passUrl 
  } else {
    if (failUrl) location.href = failUrl
  }

} catch (error) {
  console.log( error )
}
  