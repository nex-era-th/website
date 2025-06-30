/*
file: xchat-b.js
for: handle xchat functions in browser


*/


const xchat = {
  about: 'xchat module for browser',
}




//chat with a member-------------------------------------------------
xchat.chatWith = ( MEMBER ) => {

  //at this point the user must already have log-in and all data are available: loginProfile, jwt

  const xwt = nodex.getXwt( 
    sessionStorage.loginProfile, sessionStorage.getItem('jwt')
  ) 
  // ^ this is caller

  if (xwt) {
    location.href = conf.nodexUrl + '/xchat/@' + MEMBER + '?xwt=' + xwt

  } else {
    //location.href = conf.nodexUrl + '/xchat/@' + MEMBER
    // ^ this is for guest but right now we might now allow guest to chat with user, she must sign-up to get a userName first

    alert('Please log-in first')
  }
}