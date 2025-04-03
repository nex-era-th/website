/* projex.js
this is projex program in browser mode to handle things in this side

2024-07-03
all func in this package (means file) must defined by const and prefix with the 'x' like 

  const xAbcDef = (v) => {...}

will not use the px.abcDef pattern any more due to security concern. This way will protect the change of func in the browser to disfunction it.

2025-01-15
uses px as main object with all funcs put in as methods
so people can use px.xyz() to run the desired func



*/

const projex = {} //reserve

const px = {
  about: {
    programName : 'projex.js',
    version     : '2.1.3',
    brief       : 'powers browser side functionalities',
    lastUpdate  : '2025-02-11T12:12+0700',
    by          : '@devster',
    updateNote  : [
      'added px.input.make()',
      'completed px.switch for all .toggle, .get & .set funcs'
    ] 
  },
  help: {},
  devNote: {},
  testNote: {}
}




px.test = () => {
  alert('yo! this is projex.js a thing for browser side')
}




/*
px.logIn = async () => {

  if (!userName.value || !passwd.value) {
    alert('please completely provide data, thank you')
    return
  } 

  try {
    let pass = await xfetch('/log-in',
      {
        method:   'post',
        content:  'json',
        outputAs: 'json', 
        data: 
          { 
            userName: userName.value, 
            passwd:   px.passHash 
          }
      }
    )

    if (pass) {
      location.href = '/v1'
    } else {
      alert('we got rejected, please try again')
    }

  } catch(error) {
    console.log(error)
    alert('network error')
  }
} //tested=
*/



/* hash the password immediately after it's entered to protect privacy */
const xHashPasswd = () => {
  xb.hash( passwd.value ).then( sha256 => {
    px.passHash = sha256
    passwd.value = xb.random() //clear footprint
  })
} //tested=ok




px.verifyXCert = async (xcert) => {
/* verify the sessionCert which normally saved in sessStor and get true or false */
  if (!xcert) xcert = sessionStorage.getItem('projex')
  if (typeof xcert == 'string' && xcert.match(/^[0-9a-fA-F]{64}$/) ) {
    //the xcert exist and is sha256 format
    return await xfetch('/verify-xcert', {
      method:   'get',
      //content:  'json',
      outputAs: 'json',
      headers:  { projex: xcert }
    })  
  } else {
    //not the sha256 format
    return false
  }

  
} //tested=ok





px.logOut = async () => {
  /* send sessionCert to /log-out in POST */

  if (prompt("Please confirm again","OK")) {

    let resp = await xfetch('/log-out', {
      method:   'post',
      content:  'json',
      outputAs: 'json',
      data:     { projex: sessionStorage.getItem('projex') }
    })

    if (resp.done == true) {
      //clear sessionCert, goto /
      sessionStorage.removeItem('projex')
      location.href = '/'
    } else {
      //error
      alert("not log-out, there's error")
    }
  } else {
    //let user continue their works
  }
}




px.getPage = async (url) => {
  //go to the url with xcert in the headers
  /* response we need 
      { verifyPass:     ~ true | false,
        nextPageFormat: ~ html | url,
        nextPage:       ~ can be html or just '/url'
      }
  */
  try {
    document.documentElement.innerHTML = await xfetch( url,
      {
        method:   'get',
        outputAs: 'text',
        headers:  {projex: sessionStorage.getItem('projex')}
      }
    )
  } catch (error) {
    alert('connection problem, see detail in console.log')
    console.log(error)
  }
}


/* postForm(formId, url) -- will send form's data to URL */
px.postData = async (xdata, url) => {
  // just send data to a url and return the response
  // make a little bit simpler than composing xfetch yourself

  if (typeof xdata != 'object' || !Object.keys(xdata)[0] 
    || !url) return false

  try {
    document.documentElement.innerHTML = await xfetch(url,{
      method    :'post',
      content   :'json',
      outputAs  :'text',
      data      : xdata
    })

  } catch(error) {
    console.log(error)
    alert('network error')
  }

  
  /*
  { time:'2024-06-8, 
    note:'just handle basic which skipping validation and so on at least for now',
    test: 'ok',
    by:'M'
  }


  */
}

/*
px.xverified = async () => {
  let xcert = sessionStorage.getItem('projex')
  if (!xcert || typeof xcert != 'string' || !xcert.match(/^[0-9a-fA-F]{64}$/) ) return false //bad xcert, just reject

  try {
    return await xfetch('/verify-xcert',{
      method: 'post', content: 'json', outputAs: 'json',
      data: { projex: xcert }
    })
  } catch(error) {
    //fail
    console.log(error)
    return false 
  }
}
*/


/*-------------------------------------------------------------------
  {
    function  : 'xPostJson',
    brief     : 'fetch/post data in json and get json back',
    stage     : 'dev',
    updated   : '2024-06-17'
  }
*/
const xPostJson = async (url, data, XCERT='') => {
  if (!url || !data || typeof data != 'object' || !Object.keys(data).length) return false

  try {
    return xfetch( url, {
      headers   : { xcert: XCERT },
      method    : 'post',
      content   : 'json', 
      outputAs  : 'json', 
      data      : data
    })
    
  } catch (error) {
    return error
  }
}

px.postJson = xPostJson

px.help.postJson = {
  info:'send data to server url in POST method then get json back',
  use:"let v = await px.postJson('/xyz',{ .. }) "
}









// xIsSha256 -- check if it's SHA256 format
const xIsSha256 = (inp) => {
  if (inp && typeof inp == 'string' && inp.match(/^[0-9a-fA-F]{64}$/) ) {
    return true
  } else {
    return false
  }
}

px.goodSha = xIsSha256


// xGet -- fetch via get to a url but put xcert in the headers too
/*
    use       : xGet('/xyz')
    validity  : the xcert must be there in the sessionStor

const xGet = async (url) => {
  if (!url || typeof url != 'string') return false
  const xcert = sessionStorage.getItem('xcert')
  if (!xcert || !xIsSha256(xcert)) return false

  try {
    let getBack = await xfetch(url, {
      method: 'get',
      headers: { xcert: sessionStorage.getItem('xcert')}
    })
    // server response will be text/html
    //our job just attach xcert in the headers and then GET
    console.log( getBack)

  } catch(error) {
    console.log(error)
  }
}
*/


//get xcert 
const xGetCert = () => {
  return sessionStorage.getItem('xcert')
}


// xIsUser -- check if input is complied to standard _USER format
const xIsGoodUsername = xIsUser = (_USER) => {
  if (_USER && typeof _USER == 'string' && 
    _USER.match(/^[a-z0-9-_]{3,}$/)) {
    return true
  } else {
    return false
  }
}

// check if it complies to standard _PASSWD format
const xIsGoodPassword = (_PASSWD) => {
  if (!_PASSWD) return false
  const passwd = _PASSWD.toString()
  if (passwd.length < 10) return false //length from 10+
  if (!passwd.match(/\d/) ) return false //at least a number
  if (!passwd.match(/\W/) ) return false //at least a symbol
  if (!passwd.match(/[A-Z]/) ) return false //at lest a capital
  return true
}


const xGetEmbedData = () => {
  const outp = []
  const inp = xb.at({all:'[x-msg-card]'})
  inp.forEach(m => {
    const embed = JSON.parse( xb.at(m,{getAtt:'x-embed'}) )
    outp.push({
      _uuid       : xb.at(m,'_uuid'),
      _time       : embed._time,
      _collection : embed._collection
    })
  })
  return outp
}



/*
{
  "program"     :"px.viewThis",
  "about"       :"take input as object and show to the view",
  "use"         :"px.viewThis({_uuid: ????, loveCount: 888, ...})",
  "test"        :"ok",
  "by"          :"m",
  "updatedTime" :"2024-09-25 23:44 +7"
}
*/

px.viewThis = (DATA, OPT={
  mainViewElemId  : 'conten',
  containerField  : '_uuid', 
  xIdApplied      : true
}) => {
  // px.showThis({loveCount:100, ..})

  //validation .. DATA must be non-empty object only
  if (!DATA || typeof DATA != 'object' || !Object.keys(DATA).length || Array.isArray(DATA) || !DATA[OPT.containerField]) return false

  //start

  let makingXid = '#x'
  if (!OPT.xIdApplied) makingXid = '' 

  //get list of data elem
  let fieldList = xb.at(
    [
      '#' + OPT.mainViewElemId,
      makingXid + xb.puuid(DATA[ OPT.containerField]),
      {all:'[x-data]'} 
    ]
  )

  //if can't find element, error
  if (!fieldList) return false

  fieldList.forEach( el => {
    let elData = xb.at(el, {getAtt:'x-data'}).split('/')
    let elKey = elData[0]
    
    if (elKey in DATA) {
      let attToSet        = 'text'

      if (elData[1]       = 't') attToSet = 'text'
      else if (elData[1]  = 'h') attToSet = 'html'
      else if (elData[1]  = 'v') attToSet = 'value'

      xb.at(el, { [attToSet]: DATA[elKey] } )
    }
  })
  //if the fields provided not match the view's elements, just leave it. So not effec to the view.
}

px.help.viewThis = {
  about:'takes input object and show all fields on the view',
  use:"px.viewThis({_uuid: ????, loveCount:100, ...})"
}

px.testNote.viewThis = 'tested=ok, m, 2024-09-25 23:41 +7'




// for msg module
/*
func  : msg.getCardData()
brief : get all card data and put into array
use   : let xyz = msg.getCardData() | msg.getCardData(['aaa','bbb'])
test  : ok
by    : M
note  : now we can set neededField so we can take only some of fields. But if not give this, it will send back the whole data
update: 2024-07-31

*/
/*
const msg = {}
msg.getCardData = (neededField) => {
  let outPut = []
  let allMsg = xb.at({all:'[name="msgCard"]'})

  allMsg.forEach(m => {
    let dataa   = JSON.parse(m.getAttribute('x-json'))
    dataa._uuid = xb.convId(m.id)
  
    let allField = xb.at([m, {all:'[name]'} ])
    for (ea of allField) {
      let key   = ea.getAttribute('name')
      let getAs = xb.at(ea,{getAtt:'x-fillas'})

      if (!key.match(/^_/) ) {
        if (neededField) {
          //if there's neededField, take only fields that needed
          if (neededField.includes(key)) dataa[key] = ea[getAs]
        } else {
          //if no neededField specified, take whole
          dataa[key] = ea[getAs]
        }
      } 
    }
    outPut.push(dataa)
  })
  return outPut
}

*/


//-------------------------------------------------------------------

px.help.sync = {
  about:'auto sync sess db and xdb and then auto update the view',
  use:"px.sync()"
}

px.syncLoop = 10 * 1000 // 10 sec

px.sync = (LOOP) => {
  if (LOOP && LOOP != 'stop' && px.syncId) return false //already running
  else if (!LOOP) LOOP = px.syncLoop
  else if (LOOP == 'stop' && px.syncId) {
    clearInterval(px.syncId)
    return
  } 
  else if (LOOP == 'stop' && !px.syncId) return false //not run yet
  else if (LOOP && LOOP != 'stop' && typeof LOOP != 'number') return false

  //check the sess db
  //if (!sess.get()) sess.set()

  px.syncId = setInterval( async f => {
    
    let newer = await px.postJson('/sync', {
      data  : sess.get(),
      xcert : sessionStorage.xcert
    })

    if (newer.length) {
      //now change the view
      newer.forEach( doc => px.viewThis( doc))

      //change to sess db
      newer.forEach( doc => {
        sess.set(doc,{_uuid: doc._uuid})
      })
    } else {
      //get 0 from db, just leave it
    }
    

  }, LOOP)
}

//px.sync()



//---------------------------------------------------------------

px.viewJson = {
  get: ($ELEM, $FIELD_NAME) => {
    // px.viewJson( $ELEM, 'userName xyz')

    const dat = JSON.parse(xb.at($ELEM, {getAtt:'x-json'}) )
    
    if ($FIELD_NAME) {
      if ($FIELD_NAME.includes(' ')) {

        allField = $FIELD_NAME.split(' ')
        let output = {}
        
        allField.forEach(field => {
          output[field] = dat[field] // {xxx:1000, yyy:2000, ...}
        })
        
        return output
      
      } else return {[$FIELD_NAME]: dat[$FIELD_NAME]}
    
    } else return dat //if not field name, give whole doc
  },

  set: ($ELEM, $OBJ) => {
    // px.viewJson( $ELEM, {xyz: 1000, ...})

    const dat = JSON.parse(xb.at($ELEM, {getAtt:'x-json'}) )
    for (key in $OBJ) {
      dat[key] = $OBJ[key]
    }

    xb.at($ELEM).setAttribute('x-json', JSON.stringify(dat))
  }
}


px.help.viewJson = {
  info  :'handle json data that bundled in the x-json attribute',
  guide :'in some cases, we need to embed some data into an element of html so this func will get & set that embeded json data.',
  use   :`to get data ==> let data = px.viewJson.get( $ELEM, $FIELD_NAME )
  to set data ==> px.viewJson.set( $ELEM, {$FIELD: $VALUE, ...} )`,
  exam  :`let xyz = px.viewJson.get( elem, 'name age')
  output ==> {name:?, age:?}`,
  exam1 :`px.viewJson.set( elem, {name:?, age:?} )
  output ==> the name & age will be bundled in the x-json attribute`,
  note  :'in the get, you can have multiple fields by separating with a space', 
  test  : 'ok',
  by    : '@nex-era',
  created : '2024-10-15',
  updated : 'Tue Oct 15 2024 19:50:51 GMT+0700',
  version : '1.0',
  limit   : 'not support the dot-notation of object like if we look for "buy.prodName" we will not get it properly so just take the whole "buy" subset instead.'
}


px.getAvgBright = (IMG_EL,TEXT_EL) => {

  const img = IMG_EL
  const text = TEXT_EL

  // Create a canvas to get pixel data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image on the canvas
  ctx.drawImage(img, 0, 0);

  // Get text area dimensions
  const textRect = text.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();
  const x = Math.round(textRect.left - imgRect.left); // Relative to image
  const y = Math.round(textRect.top - imgRect.top);
  const width = Math.round(textRect.width);
  const height = Math.round(textRect.height);

  // Get all pixel data from the text area
  const pixelData = ctx.getImageData(x, y, width, height).data;

  // Calculate average brightness
  let totalBrightness = 0;
  let pixelCount = 0;

  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += brightness;
    pixelCount++;
  }

  const avgBrightness = totalBrightness / pixelCount;

  // Adjust text color based on average brightness
  //text.style.color = avgBrightness < 128 ? 'white' : 'black';
  return avgBrightness
}




px.getAvgBrightOfPic = (image) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match the image size
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw the image on the canvas
  ctx.drawImage(image, 0, 0, image.width, image.height);

  // Get pixel data for the entire image
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let totalBrightness = 0;
  const pixelCount = data.length / 4; // Each pixel is 4 values: R, G, B, A

  // Loop through all pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];     // Red
    const g = data[i + 1]; // Green
    const b = data[i + 2]; // Blue

    // Calculate brightness
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += brightness;
  }

  // Return the average brightness
  return totalBrightness / pixelCount;
}

// Example Usage:
const image = new Image();
image.src = 'example.jpg'; // Replace with your image source
image.onload = function () {
  const avgBrightness = getAverageBrightness(image);
  console.log('Average Brightness:', avgBrightness);
};




// SORT-ARRAY ----------------------------------------------------
px.sortArray = function (arrayIn, fieldToSort, option) {
  /*
    option can have: {ascending: false, dateSort: true}
    if don't put false to ascending, it's default true
    if don't put true to dateSort, it's default false
  */

  if (!option) option = {ascending: true}

  if (option.dateSort) {
    if (typeof option.ascending == 'undefined') option.ascending = true
    
    return arrayIn.sort((a, b) => {
      if (new Date(a[fieldToSort]) < new Date(b[fieldToSort]) ) return option.ascending? -1 : 1
      if (new Date(a[fieldToSort]) > new Date(b[fieldToSort]) ) return option.ascending? 1 : -1
      return 0
    })

  } else {
    
    return arrayIn.sort((a, b) => {
      if (a[fieldToSort] < b[fieldToSort]) return option.ascending ? -1 : 1;
      if (a[fieldToSort] > b[fieldToSort]) return option.ascending ? 1 : -1;
      return 0; // Equal values
    })
  }


  

  /*
      sorts array of objects by putting the object property
      tested=ok, @devster, 2024-12-18 7:47+7
      version=1.0
      license=0
  */
  /*
      {
        time    : '2024-12-24', 
        note    : 'changed option to object and taking ascending & dateSort; option defaults are ascending=true & dateSort=false; if you want descending just put {ascending: false} or if you sorting date just put {dateSort: true}',
        tested  : 'ok',
        by      : '@devster'
      }
  */
}




/*---------------------------------------------------------------------

  editor stuff using contenteditable <div> element
  version = 1.0

----------------------------------------------------------------------*/


// replace string by position
px.replaceStr = (STR,FROM,TO,WITH) => {
  /*
      this func replaces string from positon-1 to position-2 
      the position is based on js defi
  */

  return STR.slice(0,FROM) + WITH + STR.slice(TO)

  /*
      {
        "test"  : "ok", 
        "by"    : "@devster",
        "time"  : "2024-12-31T11:02+07:00"
      }
  */
}




// select-all text in an element
px.selectAll = (ELEM) => {
  /*
      select all text in the provided element
      it returns the selection object so you can simply do something more
      like: px.selectAll(ele_m).collapseToEnd()
  */

  let newRange = document.createRange()
  newRange.selectNodeContents(ELEM)
  let newSelection = getSelection()
  newSelection.removeAllRanges()
  newSelection.addRange(newRange)
  return newSelection

  /*
    {
      "test"  : "ok",
      "by"    : "@devster",
      "time"  : "2024-12-31T16:25+07:00"
    }
  */
}


// insert element at the cursor
px.insertElem = (ELEM) => {

  let selec = getSelection()
  if (selec.rangeCount > 0) {
    let range = selec.getRangeAt(0)
    range.collapse(true)
    range.insertNode(ELEM)

    let newRange = document.createRange()
    newRange.setStartAfter(ELEM)
    newRange.collapse(true)
    selec.removeAllRanges()
    selec.addRange(newRange)
  }

  // tested=ok, @devster
  // added: move cursor to end of new elem; tested=ok, @devster
}


// create element for the selected text
px.surroundSelec = (ELEM) => {

  // cover the selection with element and place cursor at the end

  let selec = getSelection()
  if (selec.rangeCount > 0 && !selec.isCollapsed) {
    let range = selec.getRangeAt(0)
    let selectedText = selec.toString()

    if (selectedText.length > 0) {
      range.surroundContents(ELEM)
      
      let newRange = document.createRange()
      newRange.setStartAfter(ELEM)
      newRange.collapse(true)
      selec.removeAllRanges()
      selec.addRange(newRange)
    }
  }

  // tested=ok, @devster
}


/* put cursor at the end of elem
px.putCursorAt = (POSI, ELEM) => {

  // put cursor at end or start of the element

  let newRange = document.createRange()
  let newSelec = getSelection()
  newRange.selectNodeContents(ELEM)
  newRange.collapse(POSI == 'end'? false : true) //cursor posi
  newSelec.removeAllRanges()
  newSelec.addRange(newRange)
  ELEM.focus()

  // tested=ok, @devster
}*/


// put cursor at an index
px.placeCursor = (INDEX, ELEM) => {

  // put cursor at the index of string in an element

  let thisText = ELEM.textContent
  ELEM.focus()

  if (INDEX == 'end' || INDEX > thisText.length) INDEX = thisText.length

  let newRange = document.createRange()
  newRange.setStart(ELEM.firstChild, INDEX)
  newRange.collapse(true)

  let selec = getSelection()
  selec.removeAllRanges()
  selec.addRange(newRange)

  // tested=ok, @devster
  // if INDEX is > length of text, put to end of text & we can put 'end' as index too
}
px.placeCursorAt = px.placeCursor



// insert text at cursor
px.insertText = (TEX) => {

  // insert text at cursor then place cursor at the end of inserted text

  let selec = getSelection()
  if (selec.rangeCount > 0) {
    let thisRange = selec.getRangeAt(0)
    thisRange.deleteContents()
    thisRange.insertNode(
      document.createTextNode(TEX)
    )

    //move cursor to end
    thisRange.setStart(thisRange.endContainer, thisRange.endOffset)
    thisRange.collapse(true)

    //update selection
    selec.removeAllRanges()
    selec.addRange(thisRange)
    selec.anchorNode.parentElement.focus()
  }

  // tested=ok, @devster
}


px.editor = { 
  about: {
    object: 'px.editor',
    description: 'for editor works',
    version: '0.1'
  }
}

px.editor.h1 = () => {
  px.surroundSelec(document.createElement('h1'))
}

px.editor.h2 = () => {
  px.surroundSelec(document.createElement('h2'))
}

px.editor.h3 = () => {
  px.surroundSelec(document.createElement('h3'))
}

px.editor.h4 = () => {
  px.surroundSelec(document.createElement('h4'))
}

px.editor.h5 = () => {
  px.surroundSelec(document.createElement('h5'))
}

px.editor.h6 = () => {
  px.surroundSelec(document.createElement('h6'))
}

px.editor.italic = () => {
  px.surroundSelec(document.createElement('i'))
}
px.editor.i = px.editor.italic

px.editor.bold = () => {
  px.surroundSelec(document.createElement('b'))
}
px.editor.b = px.editor.bold

px.editor.underline = () => {
  px.surroundSelec(document.createElement('u'))
}
px.editor.u = px.editor.underline

px.editor.mark = () => {
  px.surroundSelec(document.createElement('mark'))
}

px.editor.ul = () => {
  let elem = document.createElement('ul')
  elem.innerHTML = '<li>text..</li>'
  px.insertElem(elem)
  px.placeCursor('end',elem.firstChild)
}


px.editor.ol = () => {
  let elem = document.createElement('ol')
  elem.innerHTML = '<li>text..</li>'
  px.insertElem(elem)
  px.placeCursor('end',elem.firstChild)
}

px.editor.hr = () => {
  px.insertElem(document.createElement('hr'))
}

px.editor.code = () => {
  px.insertElem(document.createElement('code'))
}

px.editor.text = ($text) => {
  px.insertText($text)
}

px.editor.img = ($src) => {
  let elem = document.createElement('img')
  elem.style.width = '100%'
  elem.src = $src
  px.insertElem(elem)
}




px.editor.start = ($var) => {
  /*
      $var = {
        elem  : EDITOR_ELEMENT,
        title : default is 'WRITE NEW MESSAGE',
        tool  : 'h,i,b,u,ul,ol,...',
        button: 'SHARE',
        actFunc: '..script when click SHARE..',
        uturnFunc: '..script when click u-turn..',
        picPosition: 'default | freedom' 
      }

    REQUIRE

      xdev-b.js, projex.js, projex.css, material-x.css
  */

  //check
  if (!$var || !$var.elem) return false

  //start
  let templ = `<div xeditor-title class="mat-text-indigo4 roboto-light x-fz120">{{title}}</div>
  <div xeditor-tool style="display: flex;" class="x-background">
    <div style="flex-grow: 1" class="x-p8 x-pointer" onclick="px.editor.h4()"><img src="/xpic/icon/editor/heading.svg" class="x-wh24"></div>
    <div style="flex-grow: 1" class="x-pointer x-p8" onclick="px.editor.i()"><img src="/xpic/icon/editor/italic.svg" class="x-wh24"></div>
    <div style="flex-grow: 1" class="x-pointer x-p8" onclick="px.editor.b()"><img src="/xpic/icon/editor/bold.svg" class="x-wh24"></div>
    <div style="flex-grow: 1" class="x-pointer x-p8" onclick="px.editor.underline()"><img src="/xpic/icon/editor/underline.svg" class="x-wh24"></div>
    <div style="flex-grow: 1" class="x-pointer x-p8" onclick="px.editor.ul()"><img src="/xpic/icon/editor/list-ul.svg" class="x-wh24"></div>
    <div style="flex-grow: 1" class="x-pointer x-p8" onclick="px.editor.ol()"><img src="/xpic/icon/editor/list-ol.svg" class="x-wh24"></div>

    <div style="flex-grow: 1" class="x-pointer x-p8" onclick="document.querySelector('[xeditor-pic-file]').click()">
      <img src="/xpic/icon/editor/pic.svg" class="x-wh24">
      <input xeditor-pic-file type="file" hidden onchange="{{pic-position}}">
    </div>
  </div>

  <div xeditor-pic-box style="position: relative" hidden>
    <img xeditor-show-pic style="width: 100%">
    <div xeditor-clear-pic style="position: absolute; left: 0; bottom: 0; cursor: pointer; padding: 4px; background-color: rgba(255,255,255,0.2)" onclick="xb.at([this,{goUpTo:'[xeditor-pic-box]'},{goDownTo:'[xeditor-show-pic]'}]).removeAttribute('src'); xb.at('[xeditor-pic-box]').hidden=true; let picElem = xb.at([this,{goUpTo:'[xeditor-sect]'},{goDownTo:'[xeditor-pic-file]'}]); picElem.outerHTML=picElem.outerHTML"><img src="/xpic/icon/x.svg"></div>
  </div>

  <div xeditor-write contenteditable="true" class="x-fz140 x-mt24" style="border: none; outline: none">text..</div>

  <div xeditor-act style="display: flex; justify-content: space-between" class="x-mt32">
    <button xeditor-act-share class="w3-button w3-blue x-condensed x-plr8" onclick="${$var.actFunc}">{{button-label}}</button>
    <button xeditor-act-uturn class="w3-btn" onclick="${$var.uturnFunc}"><img src="/xpic/icon/u-turn.svg" class="x-wh24"></button>
  </div>`

  
  
  if (!$var.title) $var.title = 'WRITE MESSAGE'
  if (!$var.button) $var.button = 'SHARE'
  if (!$var.picPosition) $var.picPosition = 'default'

  templ = templ.replace('{{title}}', $var.title)
  templ = templ.replace('{{button-label}}', $var.button)

  if ($var.picPosition == 'default') {
    templ = templ.replace(
      '{{pic-position}}',
      "xb.getDataUrlFromFileInput(this).then(dUrl => xb.at([this,{goUpTo:'[xeditor-sect]'},{goDownTo:'[xeditor-pic-box]'}]).children[0].src= dUrl); xb.at('[xeditor-pic-box]').hidden=false"
    )
  } else if ($var.picPosition == 'freedom') {
    templ = templ.replace(
      '{{pic-position}}',
      `xb.getDataUrlFromFileInput(this).then(dUrl => px.editor.img(dUrl))`
    )
  }

  $var.elem.innerHTML = templ
}





// Thai number ------------------------------------------------------
px.getThaiNumFrom = (_engNum) => {

  /*
    - put arabic num into it and get Thai num back
    - by @devster, 2025-01-11T10:55+0700
    - tested=ok
    - version = v1.0

    NOTE
    - if you want to get from 0-leading num, you have to make it string by put in like: 

      let _output = px.getThaiNumFrom('0123456')

      because if you put in as number like: px.getThaiNumFrom(0123456) the js will take out the first 0 and then we won't get the first 0 conversion
  */

  const convertFrom =  ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙']
  let _output = ''
  
  for (_num of _engNum.toString()) {
    _output += convertFrom[_num]
  }

  return _output

  // tested=ok, @devster
}



// conver ol to Thai num -------------------------------------------
px.makeThaiNumListOn = (_olElem) => {

  /*
    -make the <ol> element listing in Thai numbers by just putting the element in
    -the list number always follow by . and a space so we got like: 
      ๑. sssssssss
      ๒. ssssssssssssss
      ๓. ssssss

    -version: v1.0
    -license: none
  */

  Array.from(_olElem.children).forEach( (li,index) => {
    li.style.listStyleType = 'none'
    li.style.counterIncrement = 'none'
    li.style.position = 'relative'
    li.style.paddingLeft = ''
    li.innerHTML = `<span>${px.getThaiNumFrom(index + 1)}. </span>${li.innerHTML}`
  })

  // tested=ok, @devster, 2025-01-11T11:42+0700
}


// convert rgb to hex
px.rgbHex = (rgb) => {

  /*
      -convert rgb(0,0,0) to #000000
      -input is 'rgb(0,0,0)'

      GUIDE
      let getHex = px.rgbHex('rgb(255,0,0)')
      and you get: #ff0000

      tested=ok, @devster 2025-01-14T13:57+0700

  */
  
  let parts = rgb.substring(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(',');
  let r = parseInt(parts[0].trim(), 10);
  let g = parseInt(parts[1].trim(), 10);
  let b = parseInt(parts[2].trim(), 10);

  // Convert each number to its hex equivalent and pad with 0 if necessary
  let hex = '#' + 
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0').toUpperCase();

  return hex;
}



//-------------------------------------------------------------------
px.slide = (  _x={
  slideEvery    : 4, //sec
  slidesToShow  : 3, // num of slides to show in the view
  transformTime : 3, //sec
  element       : null, 
  slideTo       : 'left', //has left|right
  hasControl    : false, //for future
  queue         : [] 
}) => {

  /*
    - slides elements horizontally
    - designed for mobile, default is 3 slides / view
    - firstly loops to the left and moving the first element
    to the end. So it looping these 3 slides along the time.
    - may put more func such as slide-to-right, controls, ...

    GUIDE
    - slideEvery = seconds you want them to move
    - slidesToShow = number of slides you want in the view
    - transformTime = seconds of the moving; slow or fast
    - element = the slide container element, usually <div> ; it should be flex

    ! the transformTime must be < slideEvery
      default: slideEvery=4sec , transformTime=3sec

    - you have to set your element width-equally, eg, if we have 3 slides/view, we set style="width: calc(100%/3)"

    INFO
    - license = none
    - dev = @devster, nex-era, Thailand
    - version = 1.0
    - lang = js
    - released date = 2025-01-08T09:03+0700
  */

  //validate & default setting
  if (!_x) return false
  else {
    if (!_x.element) return false
    if (!_x.slideEvery) _x.slideEvery = 4
    if (!_x.slidesToShow) _x.slidesToShow = 3
    if (!_x.transformTime) _x.transformTime = 3
    if (!_x.slideTo) _x.slideTo = 'left'
    if (!_x.hasControl) _x.hasControl = false
    if (!_x.queue) _x.queue = []
  }


  px._slide = _x
  
  px._slide.interval = setInterval(f => {
    _x.element.style.transition = `transform ${_x.transformTime}s ease-in-out`

    if (_x.slideTo == 'left') {
      _x.element.style.transform = `translateX(calc(-100%/${_x.slidesToShow}))`

      setTimeout(f => {
        let copy = _x.element.firstElementChild.cloneNode(true)
        copy.classList.add('x-fade-in')
        _x.queue.push(copy)
        _x.element.removeChild(_x.element.firstElementChild)
        _x.element.appendChild(_x.queue.shift())
        _x.element.style.transition = 'none'
        _x.element.style.transform = 'translateX(0)'
      }, _x.transformTime * 1000)  

    } else if (_x.slideTo == 'right') {
      _x.element.style.transform = `translateX(calc(100%/${_x.slidesToShow}))`

      setTimeout(f => {
        let copy = _x.element.lastElementChild.cloneNode(true)
        copy.classList.add('x-fade-in')
        _x.queue.push(copy)
        _x.element.removeChild(_x.element.lastElementChild)
        _x.element.prepend(_x.queue.shift())
        _x.element.style.transition = 'none'
        _x.element.style.transform = 'translateX(0)'
      }, _x.transformTime * 1000)
    }
    
    

  }, _x.slideEvery * 1000)

  /*
    - tested=ok, @devster, 2025-01-08T08:45+0700
    - now taking {slideTo: 'right'} option, tested=ok
  */
}



//-----------------------------------------------------------------
px.toggle = (_x) => {
  /*
    - toggle sign and show/hide elements
    - good for an on/off switch that do show/hide something
    - even write this kind of codes is not long but this func gives something little more easier
    - good for a simple toggle switch like on/off if more conditions you have to write own codes

    GUIDE

      <img id="xyz" onclick="px.toggle({
        check: 'xyz.src.includes(`off`)',
        ifTrue: {show: footer_th, hide: footer_en, sign: '/icon/on.svg'},
        else: {show: footer_en, hide: footer_th, sign: '/icon/off.svg'},
        signElement: xyz
      })"
  */

  let yes = eval(_x.check)
  if (yes) {
    _x.ifTrue.show.hidden = false
    _x.ifTrue.hide.hidden = true
    _x.signElement.src = _x.ifTrue.sign 
  } else {
    _x.else.show.hidden = false
    _x.else.hide.hidden = true
    _x.signElement.src = _x.else.sign
  }

  // tested=ok, @devster, 2025-01-08T18:06+0700
  // now v0.5 ; need more validation & default settings, ...
}


/*-----------------------------------------------------------------------  

    the px.switch aims just simply toggle the on-off signs 
    GUIDE 
    
      to toggle switch do this:
        onclick="px.switch.toggle(this)"

      to get state of the switch:
        let state = px.switch.get(ELEM) ...value is 'on' or 'off'

      to set state to the switch:
        px.switch.set('on',ELEM)
        px.switch.set('off',ELEM)

    TEST
      all funcs are tested = ok, @devster 12:11 Feb11/2025 +7
-----------------------------------------------------------------------*/

px.switch = {
  //these can be changed
  onSign: '/xpic/icon/humble/switch-on.svg',
  offSign: '/xpic/icon/humble/switch-off.svg'
}

px.switch.toggle = ($elem) => {
  // toggle on-off
  if ($elem.src.includes('switch-on')) $elem.src = px.switch.offSign
  else if ($elem.src.includes('switch-off')) $elem.src = px.switch.onSign
  else {}
}

px.switch.get = ($elem) => {
  // get state from px.switch returning 'on' or 'off'
  if ($elem.src.includes(px.switch.onSign)) return 'on'
  else if ($elem.src.includes(px.switch.offSign)) return 'off'
  else {}
}

px.switch.set = ($state, $elem) => {
  // set px.switch to 'on' or 'off'
  if ($state == 'on') $elem.src = px.switch.onSign
  else if ($state == 'off') $elem.src = px.switch.offSign
  else {}
}




/*  px.justToggle($elem) 
    if the $elem is hidden show it, if it's showing hides it
    this utilizes the .hidden property
--------------------------------------------------------------------------*/

px.justToggle = ($elem) => {
  if ($elem.hidden) $elem.hidden = false
  else $elem.hidden = true
}










//-----------------------------------------------------------------
px.moveAroundFreely = (_elem,_x=0,_y=0,_time=2,_distance=45) => {
  /*
    - move element around randomly & easily
    - this is simple method moving the el linearly and in straight direction
  */

  let newX = Math.random() < 0.5 ? _x - _distance : _x + _distance
  let newY = Math.random() < 0.5 ? _y - _distance : _y + _distance
  if (newX > innerWidth) newX = innerWidth
  if (newX < -_elem.offsetWidth) newX = -_elem.offsetWidth
  if (newY > innerHeight) newY = innerHeight
  if (newY < -_elem.offsetHeight) newY = _elem.offsetHeight

  _elem.style.transition = 'all ' + _time + 's linear'
  _elem.style.left = newX + 'px'
  _elem.style.top = newY + 'px'
  setTimeout(f => xMoveAroundFreely(_elem,newX,newY,_time,_distance), _time * 1000)

  // tested=ok, @devster, 2025-01-09T01:46+0700
}


//----------------------------------------------------------------
px.ifScroll = (_x) => {

  /*
    - set rule if scroll > the set % of page length, do something
    - we may have only 1 condition which is 'moreThan' and the input value is the %

    GUIDE

      ifScroll({ moreThan: 50,
        do: {show: _elem, hide: _elem, run: _func},
        else: {show: _elem, hide: _elem, run: _func}
      })

      the show/hide uses x-hide class so have to put this class on the elem you trying to handle

    INFO

      version = 1.0
      license = none
      by = @devster
      released = 2025-01-10T17:13+0700
  */

  // validate & default
  if (!_x) return
  if (!_x.do) return
  if (!_x.moreThan) _x.moreThan = 50

  addEventListener('scroll', f => {
    if (pageYOffset > document.documentElement.scrollHeight * (_x.moreThan/100) ) {
      if (_x.do.show) _x.do.show.classList.remove('x-hide')
      if (_x.do.hide) _x.do.hide.classList.add('x-hide')
      if (_x.do.run) eval(_x.do.run)
    } else {
      if (_x.else.show) _x.else.show.classList.remove('x-hide')
      if (_x.else.hide) _x.else.hide.classList.add('x-hide')
      if (_x.else.run) eval(_x.else.run)
    }
  })

  // first test=ok, @devster
  // v1.0 test=ok
  // thinking about how to remove this listener -- idea
}


//---------------------------------------------------------------
/* SECURITY PART

  these security funcs use GCM algorithm with no IV (or fixed IV) so we can use it to encrypt text and getting same output base64 everytime. May be we can use it as a key, or something that having fixed value

  GUIDE
    let encryptedText = await px.secure.encrypt('your text here', $key)
    let decryptedText = await px.secure.decrypt(encryptedText, $key)

    the $key must be exactly 16 characters (32 bytes)

  INFO
    version   : 1.0
    by        : @devster
    addedDate : 2025-01-1 11:47 +7
    license   : none
    test      : ok

*/

px.secure = {}

// Helper to convert string to ArrayBuffer
px.secure.str2ab = (str) => {
  return new TextEncoder().encode(str);
}

// Helper to convert ArrayBuffer back to string
px.secure.ab2str = (buf) => {
  return new TextDecoder().decode(buf);
}

// Fixed nonce - WARNING: DO NOT USE LIKE THIS IN PRODUCTION
px.secure.fixedNonce = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

px.secure.encrypt = async (plaintext, password) => {
  const data = px.secure.str2ab(plaintext);

  // Derive key (this is still very basic)
  const key = await window.crypto.subtle.importKey(
      "raw",
      px.secure.str2ab(password.slice(0, 16)), // Only 16 bytes for AES-128
      {name: "AES-GCM", length: 128},
      false,
      ["encrypt"]
  );

  // Encrypt with GCM, using our fixed nonce
  const encrypted = await window.crypto.subtle.encrypt(
      {
          name: "AES-GCM",
          iv: px.secure.fixedNonce, // Fixed nonce
          tagLength: 128 // Tag length in bits
      },
      key,
      data
  );

  // Convert to base64 for easy handling, including the authentication tag
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

px.secure.decrypt = async (encodedCiphertext, password) => {
  const ciphertext = Uint8Array.from(atob(encodedCiphertext), c => c.charCodeAt(0));

  const key = await window.crypto.subtle.importKey(
      "raw",
      px.secure.str2ab(password.slice(0, 16)),
      {name: "AES-GCM", length: 128},
      false,
      ["decrypt"]
  );

  // Decrypt, using the same fixed nonce
  try {
      const decrypted = await window.crypto.subtle.decrypt(
          {
              name: "AES-GCM",
              iv: px.secure.fixedNonce,
              tagLength: 128
          },
          key,
          ciphertext
      );
      return px.secure.ab2str(decrypted);
  } catch (error) {
      console.error("Decryption failed:", error);
      return null;
  }
}

/* Example usage
(async () => {
  const plaintext = "This is my secret message!";
  const password = "ThisIsASecretKeyThatIsExactly32Bytes";

  try {
      const encrypted = await encryptAESGCM(plaintext, password);
      console.log("Encrypted:", encrypted);

      const decrypted = await decryptAESGCM(encrypted, password);
      console.log("Decrypted:", decrypted);
  } catch (error) {
      console.error("An error occurred:", error);
  }
})();
*/


/*-------------------------------------------------------------------------

    use simpleTime() to make the date & time shorter, slimer so can fit in small space like card, etc.

    px.simpleTime($jsts) - to get the simple format of time
    px.simpleTim($simtim) - check whether it is simtim or not
    px.reverseSimpleTime($simtim) - reverse back to $jsts but we get here the minute-accuracy not seconds

    version = 1.0
    license = none
    by      = @devster/nex-era
    last update = 19:10 Jan29/2025 +7

------------------------------------------------------------------------*/


px.simpleTime = (JSMS) => {
  /* 
      makes time format shorter, good for mobile space
      JSMS is js milisec
      output is like: 11:00 Jan21 +7
      so if we show time in this year, it won't show the year
      excepts it shows time of other year then it show the year like:
      9:35 Feb15/2000 +7

      this func tries to eliminate confusion between formats in the world so we take the month name clearly of: Jan ... Dec not use number

      version: 1.0
      license: none
      by: @devster/nex-era
      date: 2025-01-22
  */

  //validate
  if (!JSMS.toString().match(/^-?\d+$/)) return false

  //start
  let makeTime = new Date(JSMS)
  let tStr = makeTime.toString()
  // after above line we get below line and will use it as base to reformat
  // Wed Jan 22 2025 09:43:52 GMT+0700 (Indochina Time)
  if (tStr == 'Invalid Date') return false
  let p = tStr.split(' ')

  //shorten time to 9:00 not 09:00
  let timE = p[4].slice(0,5)
  if (timE[0] == '0') timE = timE.slice(1) //take leading 0 out

  //shorten timezone to +7 not +0700
  let tz = p[5].slice(4)
  var tzHr
  if (tz.slice(0,2) == '00') {
    tzHr = 0
  } else {
    tzHr = (tz[0] == 0? '' : tz[0]) + tz[1]  
  }

  return timE + ' ' + 
    p[1] + Number(p[2]) + (new Date().getFullYear() != p[3] ? '/' + p[3] : '') + 
    ' ' + p[5].slice(3,4) + tzHr + (tz.slice(-2) == '00'? '' : tz.slice(-2) )

  //tested=ok, @devster
  //tested=ok, make date shorter by taking out the leading 0, so we got Jan1 instead of Jan01 now, @devster, 12:59 Jan29/2025 +7
}



px.simpleTimeCheck = ($simtim) => {
  // if its simpleTime format gives true, else false
  // good format = '9:00 Jan29 +7'
  if (typeof $simtim != 'string') return false
  if ($simtim.match(/^\d{1,2}:\d{2} \w{3}\d{1,2}(\/\d{4})? [+-]\d{1,2}(:\d{2})?$/)) return true
  else return false
}



px.reverseSimpleTime = ($simtim) => {
  // reverse simpleTime to jsts format
  // simtim = '9:00 Jan1/2024 +7'

  if (px.simpleTimeCheck($simtim)) {
    let p = $simtim.split(' ')

    let time = p[0]
    if (time.length < 5) time = '0' + time

    const getMonth = {jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'}
    let month = getMonth[ p[1].slice(0,3).toLowerCase() ]
    
    var date, year
    if (p[1].includes('/')) {
      year = p[1].split('/')[1] 
      date = p[1].split('/')[0].slice(3) //Jan1
      if (date.length == 1) date = '0' + date     
    } else {
      year = new Date().getFullYear()
      date = p[1].slice(3)
      if (date.length == 1) date = '0' + date
    }

    var timezone
    if (p[2].includes(':')) { //case +7:30
      let z = p[2].split(':')
      if (z[0].slice(1).length == 1) {
        let sign = z[0].slice(0,1) // the + or -
        z[0] = sign + '0' + z[0].slice(1)
      } 
      timezone = z[0] + ':' + z[1]
    } else { //case +7
      if (p[2].slice(1).length == 1) {
        let sign = p[2].slice(0,1)
        p[2] = sign + '0' + p[2].slice(1)
      }
      timezone = p[2] + ':00'
    }

    let outputStr = `${year}-${month}-${date}T${time}${timezone}`
    //console.log(outputStr)
    return new Date(outputStr).getTime()

  } else {
    return false
  }

}







/*  px.randomBetween($a,$b)
    simple random between 2 numbers ------------------------------------*/

px.randomBetween = ($a,$b) => {
  // get random integer between 2 values

  if ($a > $b) {
    [$a,$b] = [$b,$a]
  }

  return Math.floor(Math.random() * ($b - $a + 1)) + $a

  //tested=ok, @devster/nex-era 14:09 Jan27/2025 +7
}    







/*----------------------------------------------------------------------  

  table handling 
  gets value from table or set value to table
  so we have 3 funcs
    getTable() - to get data from table
    setTable() - to set data into it
    makeTable() - make table from array of objects

  GUIDE

    px.getTable(ELEM, [1,0]) ==>you get text content from row 1, column 0
    px.setTable(ELEM, [1,0], 'xyz........') ==>you set text xyz... to r1,c0
    TABLE_ELEM.innerHTML = px.makeTable( [{aaa:111, bbb:222, ...}] )

----------------------------------------------------------------------*/

px.getTable = ($elem, $position, $value) => {
  // $position = [row,col]
  // $value = text|html if no $value, default = 'text'
  // if not put $value it gives out the dom element

  //validate
  if (!$elem || !($elem instanceof HTMLElement)) return false
  if (!$position || !$position.length) $position = [0,0]
  else if ($position.length == 1) $position[1] = 0

  if (!$value) $value = 'textContent'
  else if ($value == 'text') $value = 'textContent'
  else if ($value == 'html') $value = 'innerHTML'
  else if ($value == 'dom') {}
  else $value = 'textContent'

  //start
  if ($value == 'dom') {
    return $elem.rows[$position[0]].cells[$position[1]]
  } else {
    return $elem.rows[$position[0]].cells[$position[1]][$value]  
  }

  //tested=ok, @devster/nex-era 13:22 Feb1/2025 +7
}


px.setTable = ($elem, $position, $value) => {
  // $elem is table element
  // $position is [row,column] like [1,0]
  // $value is like {text:'xyz.........'} or {html:'<b>....</b>'} default is html, if you put only (ELEM,[1,0],'<b>ssss</b>') default will be html

  //validate
  if (!$elem || !($elem instanceof HTMLElement)) return false
  if (!$position) return false
  else if ($position.length != 2) return false
  if (!$value) $value = ''

  //start
  if (typeof $value == 'object') {
    
    if ($value.text) $elem.rows[$position[0]].cells[$position[1]].textContent = $value.text
    else if ($value.html) $elem.rows[$position[0]].cells[$position[1]].innerHTML = $value.html
    else $elem.rows[$position[0]].cells[$position[1]].innerHTML = $value.html

  } else {
    //if just put like 'ssssssssss' or '<b>sssssssssss</b>' will regard as html
    $elem.rows[$position[0]].cells[$position[1]].innerHTML = $value
  }

  //tested=ok, @devster/nex-era 14:44 Feb1/2025 +7
}



px.makeTable = ($dataArray) => {
  //put array in and it makes table html for us
  // $dataArray should be [{aaa:??, bbb:??, ...}, ...]
  // output will be '<tr>......</tr>'

  //validate: must have input, must be array, at least 1 object in array
  if (!$dataArray || typeof $dataArray != 'object' || !Array.isArray($dataArray) || $dataArray.length == 0 || typeof $dataArray[0] != 'object') return false

  //start
  let headField = Object.keys($dataArray[0])
  let htmlStr = '<tr>'
  for (v of headField) {
    htmlStr += '<th>' + v + '</th>'
  }
  htmlStr += '</tr>'

  $dataArray.forEach(row => {
    htmlStr += '<tr>'
    headField.forEach(field => {
      htmlStr += '<td>' + row[field] + '</td>'
    })
    htmlStr += '</tr>'
  })

  return htmlStr

  //tested=ok, @devster/nex-era 21:46 Feb1/2025 +7
}









/*  make some other html elements 
    you have to have the mother element first then feed output from these
    funcs to its innerHTML

    18:52 Feb2/2025 +7
--------------------------------------------------------------------------*/

px.makeSelect = ($array) => {
  let htmlStr = ''

  $array.forEach(item => {
    htmlStr += '<option>' + item + '</option>'
  })

  return htmlStr
  //tested=ok, @devster
}

px.makeList = ($array) => {
  let htmlStr = ''

  $array.forEach(item => {
    htmlStr += '<li>' + item + '</li>'
  })

  return htmlStr
  //tested=ok, @devster
}






/*  make slide more easier
    syntax = px.slideElem( ELEM, 'LFE') --mean slide this element from left edge

    $way
    RFLE = x-slide-right-from-left-edge
    LTLE = x-slide-left-to-left-edge
-----------------------------------------------------------------------*/

px.slideElem = ($elem, $way) => {
  if ($way == 'RFLE') { // x-slide-right-from-left-edge
    if ($elem.classList.contains('x-slide-right-from-left-edge')) {
      $elem.classList.remove('x-slide-left-to-left-edge')
      $elem.hidden = false
    } else {
      $elem.classList.remove('x-slide-left-to-left-edge')
      $elem.classList.add('x-slide-right-from-left-edge')
      $elem.hidden = false
    } //tested=ok
  } else if ($way == 'LTLE') { // x-slide-left-to-left-edge
    if ($elem.classList.contains('x-slide-left-to-left-edge')) {
      $elem.hidden = false
    } else {
      $elem.classList.add('x-slide-left-to-left-edge')
      $elem.hidden = false
    } //tested=ok
    setTimeout(f => {
      $elem.hidden = true
      $elem.classList.remove('x-slide-left-to-left-edge')
    }, 1000)

  } else if ($way == 'UFBE') { // x-slide-up-from-bottom-edge
    if ($elem.classList.contains('x-slide-up-from-bottom-edge')) {
      $elem.classList.remove('x-slide-down-to-bottom-edge')
      $elem.hidden = false
    } else {
      $elem.classList.remove('x-slide-down-to-bottom-edge')
      $elem.classList.add('x-slide-up-from-bottom-edge')
      $elem.hidden = false
    }
  } else if ($way == 'DTBE') { // x-slide-down-to-bottom-edge
    if ($elem.classList.contains('x-slide-down-to-bottom-edge')) {
      $elem.hidden = false
    } else {
      $elem.classList.add('x-slide-down-to-bottom-edge')
      $elem.hidden = false
    }
    setTimeout(f => {
      $elem.hidden = true
      $elem.classList.remove('x-slide-down-to-bottom-edge')
    }, 1000)

  } else if ($way == 'LFRE') {
    if ($elem.classList.contains('x-slide-left-from-right-edge')) {
      $elem.classList.remove('x-slide-right-to-right-edge')
      $elem.hidden = false
    } else {
      $elem.classList.remove('x-slide-right-to-right-edge')
      $elem.classList.add('x-slide-left-from-right-edge')
      $elem.hidden = false
    }
  } else if ($way == 'RTRE') {
    if ($elem.classList.contains('x-slide-right-to-right-edge')) {
      $elem.hidden = false
    } else {
      $elem.classList.add('x-slide-right-to-right-edge')
      $elem.hidden = false
    }
    setTimeout(f => {
      $elem.hidden = true
      $elem.classList.remove('x-slide-right-to-right-edge')
    }, 1000)

  } else if ($way == 'DFTE') {
    if ($elem.classList.contains('x-slide-down-from-top-edge')) {
      $elem.classList.remove('x-slide-up-to-top-edge')
      $elem.hidden = false
    } else {
      $elem.classList.remove('x-slide-up-to-top-edge')
      $elem.classList.add('x-slide-down-from-top-edge')
      $elem.hidden = false
    }
  } else if ($way == 'UTTE') {
    if ($elem.classList.contains('x-slide-up-to-top-edge')) {
      $elem.hidden = false
    } else {
      $elem.classList.add('x-slide-up-to-top-edge')
      $elem.hidden = false
    }
    setTimeout(f => {
      $elem.hidden = true
      $elem.classList.remove('x-slide-up-to-top-edge')
    }, 1000)

  } else {
    return false //wrong way
  }
}





/*  px.inputPic()
    create customer file input for pic

    GUIDE
            <div id="xyz" x-pic-input></div>
            <script> px.picInput(xyz) </script>
-------------------------------------------------------------------------*/

px.inputPic = ($housingElem) => {
  let templat = `<div x-file-input onclick="xb.at([this,{goUpTo:'[x-file-input]'},{goDownTo:'[x-pic-input-back]'}]).click()" class="x-pointer">
            <input x-pic-input-back type="file" onchange="xb.readPicFileAsDataUrl(this).then(dataUrl => {xb.at([this,{goUpTo:'[x-pic-input]'},{goDownTo:'[x-pic-input-show-elem]'}]).src = dataUrl; xb.at([this,{goUpTo:'[x-pic-input]'},{goDownTo:'[x-pic-input-show]'}]).hidden=false; xb.at([this,{goUpTo:'[x-pic-input]'},{goDownTo:'[x-pic-input-face]'}]).hidden=true; })" style="overflow: hidden;" hidden>
            <img x-pic-input-face src="/xpic/icon/editor/pic.svg" class="x-wh32">
          </div>
          <div x-pic-input-show style="position: relative" hidden>
            <img x-pic-input-show-elem class="x-fullw">
            <img src="/xpic/icon/x.svg" class="x-pointer x-wh32" style="position: absolute; left: 0; bottom: 0; background-color: rgba(255,255,255,0.2);" onclick="xb.at([this,{goUpTo:'[x-pic-input]'},{goDownTo:'[x-pic-input-show]'}]).hidden=true; xb.at([this,{goUpTo:'[x-pic-input]'},{goDownTo:'[x-pic-input-back]'}]).outerHTML = xb.at([this,{goUpTo:'[x-pic-input]'},{goDownTo:'[x-pic-input-back]'}]).outerHTML; xb.at([this,{goUpTo:'[x-pic-input]'},{goDownTo:'[x-pic-input-face]'}]).hidden=false; xb.at([this,{goUpTo:'[x-pic-input]'},{goDownTo:'[x-pic-input-show-elem]'}]).removeAttribute('src')">
          </div>`

  if (!$housingElem.hasAttribute('x-pic-input')) $housingElem.setAttribute('x-pic-input',true)        

  $housingElem.innerHTML = templat          
}


px.inputNumber = ($housingElem) => {

  let temPlate = `<input x-input-number-elem type="number" class="w3-input" value="1">
  <button class="w3-btn" onclick="let downElem = xb.at([this,{goUpTo:'[x-input-number]'},{goDownTo:'[x-input-number-elem]'}]); if (downElem.value > 0) downElem.value = downElem.value - 1"><img src="/xpic/icon/minus.svg"></button>
  <button class="w3-btn" onclick="let upElem = xb.at([this,{goUpTo:'[x-input-number]'},{goDownTo:'[x-input-number-elem]'}]); upElem.value = Number(upElem.value) + 1"><img src="/xpic/icon/plus.svg"></button>`

  if (!$housingElem.hasAttribute('x-input-number')) $housingElem.setAttribute('x-input-number',true)

  $housingElem.setAttribute('style',"display: grid; grid-template-columns: auto auto auto;")

  $housingElem.innerHTML = temPlate
}




px.input = {
  about: { brief: 'this func makes input element', version: '1.0'}
}

px.input.make = () => {
  /*
      this func make input fields in x-style
      right now only making a switch input showing on-off switch icon

      GUIDE
        put your element like this:

        <img x-input-make="switch" x-input-value="on">

        then at the end of your page, under <script> tag you put:

        px.input.make()

        then the func will run through page to make inputs for you
        if you didn't put x-input-value="on" you'll get the 'off' switch as default

      NOTE
        right now makes only 'switch' input which you can use it instead of the 'checkbox' for modern style interface
  */

  let allSwitch = document.querySelectorAll('[x-input-make]')
  for (eaCh of allSwitch) {
    if (eaCh.getAttribute('x-input-make') == 'switch') {
      eaCh.src = "/xpic/icon/humble/switch-off.svg"
      eaCh.className = "x-wh32 x-pointer"
      eaCh.setAttribute('onclick',"px.switch.toggle(this)")
    }

    //in case there is default value == on, set it 'on'
    if (eaCh.getAttribute('x-input-value') == 'on') {
      px.switch.set('on',eaCh)
    } else {
      //the default is 'off' already so don't need to do anything
    }
  }
  //tested=ok, @devster/nex-era 11:09 Feb25/2025 +7
}




/*---------------------------------------------------------------------
  px.sessionId

  handle sessionId which will store in the sessionStorage. If the tab has no sessionId it will auto set for an id. So it makes sure that each tab has its own sessionId

  GUIDE
  run px.sessionId.set() in projex.js right away to ensure that each tab has id

  @devster/nex-era 10:13 Feb27/2025 +7
-----------------------------------------------------------------------*/

px.sessionId = {
  about: {
    brief         : 'handle sessionId for all browser that accessing to projex',
    version       : '1.0',
    license       : 'none',
    releasedTime  : '11:24 Feb27/2025 +7'
  }
}

px.sessionId.good = ($sessId) => {
  //check if it's good sessionId ; output = true|false
  //good sessionId = [uuid]_[timestamp]
  if (typeof $sessId == 'string' && $sessId.match(/^[0-9a-zA-Z]{24}$/)) {
    return true
  } else {
    return false
  }
}

px.sessionId.set = () => {
  //check if no sessionId for the tab, just set new one

  if (sessionStorage.getItem('sessionId') == null) {
    sessionStorage.setItem('sessionId', xb.random2() )
  } else {
    //it has sessionId in the sessionStorage but we need to check if it's good UUID or not, if not make new UUID
    if (!px.sessionId.good(sessionStorage.getItem('sessionId') )) {
      sessionStorage.setItem('sessionId', xb.random2() )
    }
  }
  //alert(sessionStorage.getItem('sessionId'))

  
  
}

//px.sessionId.set() //we run this from here so will effect every page




/* make element automatically----------------------------------------------

now making u-turn act first

how: 
  create shell element by:
  <div x-make="u-turn" x-href="URL YOU WANT"></div>

  at the bottom of page, put in <script>
  px.make.set()

  it will run through page to find the x-make shell elements and complete the element for you

------------------------------------------------------------------------*/
px.make = {
  uturn: {icon: '/website/icon/u-turn.svg'}
}

px.make.set = () => {
  let que = document.querySelectorAll('[x-make]')
  for (ea of que) {
    if (ea.getAttribute('x-make') == 'u-turn') {

      let temPlate = `<button class="w3-btn x-p8 x-round-2" 
    style="background-color: rgba(255,255,255,0.6);"
    onclick="location.href='{{x-href}}';"><img src="${px.make.uturn.icon}" width="32" height="32"></button>`

      temPlate = temPlate.replace('{{x-href}}', ea.getAttribute('x-href'))
      ea.setAttribute('style',"position: fixed; left: 0; bottom: 0;")
      ea.innerHTML = temPlate
    }
  }
}
