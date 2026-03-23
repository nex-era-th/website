/*ssm
file==pageCounter.js
for==quickly send visiting page (href) to nodex to count  
org==nex-era
by==@devster
version==1.0
created==2026-03-23 thai
*/

function xPageCounter() {
  try {
    fetch('https://node-x-qd6s.onrender.com/nex-web-visit-count', 
      {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json'},
        body    : JSON.stringify({ page: location.href }) 
      }
    )

  } catch (error) {
    console.error(error)
    return false
  }
}