/*
func  : xarr.js
brief : a simple memory db running in the browser
use   : xarr.set({xxx: ###, yyy: ###, zzz: ### })
        let output = xarr.get({name:'john'})
        xarr.set({xxx:1000},{xxx: ###, yyy: ###})
        xarr.del({xxx:1000})
        xarr.get({}) or xarr.get() ... get all data
        xarr.del({}) ... delete all data
        xarr.init() ... init the db
*/


const xarr = {
  about : {
    brief   : 'a simple memory db in the browser',
    version : '0.0.1'
  },
  tank : [] //this is tank of data
}


//get data
//support only 1 key query and with == or RegExp style
// let got = xarr.get({name:'john'})
// let got = xarr.get({name:/j/i})
xarr.get = (quer) => {
  if (quer) {
    let key = Object.keys(quer)[0]
    if (quer[key] instanceof RegExp) {
      return xarr.tank.filter(
        x => x[key]?.toString().match(quer[key])
      )
    } else {
      return xarr.tank.filter(x => x[key] == quer[key])
    }
  } else {
    //if no quer just throw all out
    return xarr.tank
  }
}



//set data
// xarr.set({xyz: 123456}) ....add new obj
// xarr.set({...},{name:'john'}) ...change where name=='john' 
xarr.set = (dataa,quer) => {
  if ( dataa && quer ) {
    //change
    if (!Object.keys(dataa).length || !Object.keys(quer).length) return false
    let querKey = Object.keys(quer)[0]
    let docToChange = xarr.tank.find(x => x[querKey] == quer[querKey])
    if (docToChange) {
      for (daKey in dataa) {
        docToChange[daKey] = dataa[daKey]
      }
      return true
    } else {
      return false
    }
    
  } else if (dataa && !quer) {
    //set only, no change
    if (typeof dataa == 'object' && Object.keys(dataa).length && !Array.isArray(dataa)) {
      dataa._id = (Date.now() + Math.random()).toString()
      xarr.tank.push(dataa)
      return dataa._id
    } else {
      return false
    }
  } else {
    return false
  }
}



//delete data
// xarr.del( #ID ) ...accepts only _id string
xarr.del = (idd) => {
  if (idd) {
    let delThis = xarr.tank.findIndex(x => x._id == idd)
    if (delThis > -1) {
      xarr.tank.splice(delThis,1)
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}