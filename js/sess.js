const sess = {
  about : {
    programName: 'sess',
    brief: 'a very very simple browser session-db',
    createdTime: '2024-9-21 19:26 +7',
    createdBy: 'M',
    updatedTime: '2024-9-27 19:09 +7',
    updatedBy: 'M',
    changeNote: 'added sess.pop & sess.shift',
    version: '1.0.3',
    license: 'none',
    fileName: 'sess.js',
    org: 'nex-era'
  },
  //coll: [] //keeps data here
}


sess.set = (inputData, CHANGE_QUERY) => {
  // sess.set({name:'john', ...})
  //we won't handle the _id stuff, so the data has to have its own id

  if (!inputData || typeof inputData != 'object') return false

  //load data
  let sessData = JSON.parse(sessionStorage.getItem('sessData'))
  if (!sessData) sessData = []

  if (!CHANGE_QUERY) {
    //add mode, make input to array so we can loop
    if (Array.isArray(inputData)) {} 
    else inputData = [inputData] 

    // add mode
    inputData.forEach(da => {
      //da.SESS_ID = Math.floor(Math.random()*(9999-1000)+1000) + '-' + Date.now()
      //take out the SESS_ID as seems useless, we mainly use _uuid
      
      sessData.push(da)
    })
  
    sessionStorage.setItem('sessData', JSON.stringify(sessData))
    return true

  } else {
    // change mode
    // accepts only 1 field, uses the sess.get()

    //change mode, input has to be obj only
    if (Array.isArray(inputData)) return false

    //so we'll add Change to whole db like
    // sess.set({xyz:4444, ..},{}) 
    // this will change the entire db

    if (Object.keys(CHANGE_QUERY).length == 0) {
      //entire change
      let changeTime = Date.now()

      sessData.forEach( doc => {
        for (key in inputData) {
          doc[key] = inputData[key]
        }

        doc._time = changeTime
      })

      sessionStorage.setItem('sessData', JSON.stringify(sessData))
      return true

    } else {
      //single change
      let qKey = Object.keys(CHANGE_QUERY)[0]
      let pattern = eval('/' + CHANGE_QUERY[qKey] + '/')
  
      let indx = sessData.findIndex( d => d[qKey]?.toString().match(pattern))
  
      for (iKey in inputData) {
        sessData[indx][iKey] = inputData[iKey]
      }
  
      sessData[indx]._time = Date.now()
      sessionStorage.setItem('sessData', JSON.stringify(sessData))
      return true
    }
  }
}




sess.get = (queryy) => {
  // sess.get({name:'john'}) --if there're many docs, will give all
  // sess.get({name:'!john'}) ~means find not-john

  let sessData = JSON.parse(sessionStorage.getItem('sessData'))
  if (!sessData) { //if no data yet, will take it as init
    sessionStorage.setItem('sessData','[]')
    return []
  }

  //data exists
  if (!queryy || !Object.keys(queryy).length) {
    //throw all out
    return sessData
  } else {
    //has query

    if (typeof queryy == 'object' && !Array.isArray(queryy) && Object.keys(queryy).length) {
      let key = Object.keys(queryy)[0]

      // logic-not
      if (queryy[key].toString().match(/^!.+/) ) {
        let pattern = eval('/' + queryy[key].toString().slice(1) + '/i')

        let outputt = sessData.filter(da => !da[key]?.toString().match(pattern) && da[key])

        return outputt

      // normal
      } else {
        let pattern = eval('/' + queryy[key] + '/i')
        
        let outputt = sessData.filter(da => da[key]?.toString().match(pattern))
        
        return outputt
      }
    }
  }
}



sess.del = (queryy) => {
  // sess.del({name:'john'})
  // only delete 1 doc/time, to prevent huge data loss
  // only 1 field query supported

  if (!queryy || typeof queryy != 'object' || !Object.keys(queryy).length) return false

  let sessData = JSON.parse(sessionStorage.getItem('sessData'))

  if (sessData) {
    let key = Object.keys(queryy)[0]
    let indx = sessData.findIndex( x => x[key] == queryy[key])

    if (indx >= 0) {
      sessData.splice(indx,1)
      sessionStorage.setItem('sessData', JSON.stringify(sessData))
      return true
    } else {
      return false
    }

  } else {
    return false //no data to delete
  }
}



sess.clear = () => {
  //clear all data
  sessionStorage.removeItem('sessData')
  return true
}



sess.pop = () => {
  //take out the last doc
  const sessData = JSON.parse(sessionStorage.getItem('sessData'))
  let popDoc = sessData.pop()
  sessionStorage.setItem('sessData', JSON.stringify(sessData))
  return popDoc
}


sess.shift = () => {
  //take data out from the first doc
  const sessData = JSON.parse(sessionStorage.getItem('sessData'))
  let shiftDoc = sessData.shift()
  sessionStorage.setItem('sessData', JSON.stringify(sessData))
  return shiftDoc
}


/*
sess.unshift = (UNSHIFT_DOC) => {
  //put in data at first position

  if (typeof UNSHIFT_DOC != 'object' || !Object.keys(UNSHIFT_DOC).length || Array.isArray(UNSHIFT_DOC)) return false

  
  const sessData = JSON.parse(sessionStorage.getItem('sessData'))
  sessData.unshift(UNSHIFT_DOC)
  sessionStorage.setItem('sessData', JSON.stringify(sessData))
  return true
}

unshift we take out as there'll be no SESS_ID as in the sess.set()
*/


// help
sess.help = {
  set: {
    about:'save data to session db; supports [..] as input',
    use:'sess.set({name:"john", ..}) OR sess.set([...]) ; if you do Change, do this sess.set({ CHG_DATA },{ QUERY }) like sess.set({age:24, ..},{name:"john"}) OR sess.set({..},{}) to change all data'
  },
  get: {
    about:'find data; only 1 key supported; if you put sess.get({xyz:""}) you get all docs that having the field xyz; If you do sess.get({name:"!john"}) you get all docs that name is not john.',
    use:'let found = sess.get({name:"john"}) OR sess.get() OR sess.get({name:"!john"}) OR sess.get({}) to get all data'
  },
  del: {
    about:'delete data; only 1 key supported',
    use:'sess.del({name:"john"})'
  },
  clear: {
    about:'clear all data',
    use:'sess.clear()'
  },
  pop: {
    about:'take the last data out',
    use:'sess.pop() ~it returns the doc that taking out'
  },
  shift: {
    about:'take out the first doc',
    use:'sess.shift() ~returns the first doc that already out'
  }
}





/* dev-note
[
  {
    "time":"2024-09-22 15:11 +7",
    "note":"mostly done here",
    "test":"ok",
    "by":"m"
  },
  {
    "time":"2024-09-22 17:17 +7",
    "note":"should name it v1.0; everything is seeming good.",
    "test":"ok",
    "by":"m"  
  }

]
*/