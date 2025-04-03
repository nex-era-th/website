/*
  function  : xess.js
  brief     : handle data in browser like little db but stores in sessionStorage in json format.
  howToUse  : 
    let wholeData = xess.get()
    let queriedData = xess.get({_id: 1000 })
    let result = xess.get({name:/j/})
    let result = xess.get({age:'>20'})
    let result = xess.get({price:'<100', category:'food'})
    xess.set({name:'john', age: 24, sex:'male',address:'nakorn pathom'})
    xess.set([ @OBJECTS_ARRAY ])

  constrain: 
    has only 1 collection
    
*/


//definition
const xess = {
  //tank : [] //this tank keeps docs before saving into sessSto
  about: {
    brief     : 'this is a simple database-like program which saving data as json in the browser sessionStorage.',
    version   : '0.9',
    by        : 'M',
    updated   : '2024-07-22',
    license   : 'none'
  } 
}



/*
if don't put anything, it's get all data ==> xess.get()
put only 1 query ==> xess.get({aaa: ???})

2024-07-22 17:56 +7
now supports multiple query fields, we can do as many as we need
tested=ok, M

so query based on =, >, < and RegExp
*/
xess.get = function (queryy) {
  const tank = JSON.parse( sessionStorage.getItem('xess'))
  if (!tank) return false

  if (queryy) {
    let statemt = '', count = 0
    for (keyy in queryy) {
      if (count > 0) statemt += ' && ' //put && between each block

      if (queryy[keyy] instanceof RegExp) {
        statemt += `d.${keyy}?.toString().match(queryy.${keyy})`
        //RegExp
      } else if (typeof queryy[keyy] == 'string' && 
        queryy[keyy].match(/^>/)) {
          let valueToCompare = queryy[keyy].match(/^>(.+)$/)[1]
          statemt += `d.${keyy} > ${valueToCompare}`
          // >
      } else if (typeof queryy[keyy] == 'string' &&
        queryy[keyy].match(/^</)) {
          let valueToCompare = queryy[keyy].match(/^<(.+)$/)[1]
          statemt += `d.${keyy} < ${valueToCompare}`
          // <
      } else {
        statemt += `d.${keyy} == queryy.${keyy}`
        // =
      }

      count++
    }

    //now complete the statement
    return tank.filter(d => eval(statemt))
    
  } else {
    return tank
  }
}



/*
the SET has 2 modes, one is ADD and another is CHANGE
if we put only 1 input, it is ADD, like: xess.set({name:'john'})
but if we put 2 like xess.set({_id:??},{aaa:??, bbb:??, ccc:??}) then this is CHANGE mode
the CHANGE mode accepts only _id in the first input

*/
xess.set = function (inputt) {
  if (!inputt || typeof inputt != 'object' || !Object.keys(inputt).length) return false //invalid

  //load data
  let tank = JSON.parse( sessionStorage.getItem('xess'))
  if (!tank) tank = []

  if (!inputt._random) {
    // if no _id means this is ADD mode
  
    if (Array.isArray(inputt)) {
      //assumes its the @OBJECTS_ARRAY
      inputt.forEach( j => {
        j._random = Math.floor(Math.random()*100000)
        tank.push(j)
      })
      sessionStorage.setItem('xess',JSON.stringify(tank))
      return true
  
    } else {
      //this is @OBJECT
      inputt._random = Math.floor(Math.random()*100000)
      tank.push(inputt)
      sessionStorage.setItem('xess',JSON.stringify(tank))
      return true
    }

  } else {
    // if there is _id, this is CHANGE mode
    // xess.set({_id: ???, aaa: ??, bbb: ??, ...})
    // the inputt has to have the _id so we base on _id only to change things

    if (typeof inputt != 'object' || 
      !Object.keys(inputt).length) return false

    let found = tank.findIndex(d => d._random == inputt._random)
    if (found != -1) {
      for (key in inputt) {
        if (key != '_random') tank[found][key] = inputt[key]
        //don't change the _id, leave it as original
      }
      sessionStorage.setItem('xess',JSON.stringify(tank))
      return true
    } else {
      return false
    }
  }
}



/*
accepts only _id so we do like xess.del({_id: ???})
*/
xess.del = function(queryy) {
  let tank = JSON.parse( sessionStorage.getItem('xess'))
  if (!tank || !queryy || typeof queryy != 'object' || !Object.keys(queryy).length || !queryy._random ) return false

  let foundIndex = tank.findIndex(d => d._random == queryy._random)
  if (foundIndex != -1) {
    tank.splice(foundIndex,1)
    sessionStorage.setItem('xess',JSON.stringify(tank))
    return true
  } else {
    return false
  } 
}


/*
this clears the xess variable from the sessSto
*/
xess.clear = function () {
  sessionStorage.removeItem('xess')
  return true
}






/*
func  : getIndex()
brief : get index of an object comparing by a query
exam  : xess.getindex({name:'john'})
rule  : takes only 1 query key and with == comparison only
note  : this func might not be necessary but let's keep it
test  : ok
by    : M
updated : 2024-07-25 10:08 +7
*/
xess.getIndex = function (queryy) {
  if (!queryy || typeof queryy !== 'object' || !Object.keys(queryy).length) return false

  const tank = JSON.parse( sessionStorage.getItem('xess'))
  if (tank) {
    let keyy = Object.keys(queryy)[0] //take only first key
    let outputt = tank.findIndex(d => d[keyy] == queryy[keyy])
    return outputt > -1 ? outputt : false
  } else {
    return false
  }
}












/*
time: 2024-07-21
note: this stuff tested on all funcs and done well
by: M

time: 2024-07-22
note: considering to be GOOD-TO-USE version
by: M

*/