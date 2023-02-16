const IDB = (function init() {
  let db = null;
  let objectStore = null;
  let DBOpenReq = indexedDB.open('MyceliRunDB', 2); 
  //DBOpenReq is asking to open the data base, the event listeners
  // are looking for the outcome of the request. 

  DBOpenReq.addEventListener('error', (err) => {
    //Error occurred while trying to open the database
    console.warn(err);
  })
  DBOpenReq.addEventListener('success', (ev) => {
    //Db is opened
    //db = ev.target.result; This returns the resuls of your 
    // request and we're saving it to a variavle called db
    db = ev.target.result;
    console.log('success', db)
    buildlist()
  })
  DBOpenReq.addEventListener('upgradeneeded', (ev) => {
    db = ev.target.result;

    let oldVersion = ev.oldVersion
    let newVersion = ev.newVersion || db.version
    console.log('DB updated from version', oldVersion, 'to', newVersion )
    console.log('upgrade', db)

    // ADDING OBJECTS TO THE STORE
    if (!db.objectStoreNames.contains('harvestData')) {
      objectStore = db.createObjectStore('harvestData', {keyPath: "id" });  
    }
 
    // DELETING OBJECTS 
  // THESE NEED TO BE CALLED WITHIN A UPGRADE FUNCTION OR
  // THE CODE WILL BE EXECUTED FIRST


  // if(db.objectStoreNames.contains('amountHarvested')) {
  //   db.deleteObjectStore('amountHarvested')
  //   console.log("Store Deleted!")
  // } if(db.objectStoreNames.contains('dateLogged')) {
  //   db.deleteObjectStore('dateLogged')
  //   console.log("2nd Store Deleted!")
  // } if(db.objectStoreNames.contains('speciesFarmed')) {
  //   db.deleteObjectStore('speciesFarmed')
  //   console.log("3ed Store Deleted!")
  // } if(db.objectStoreNames.contains('notesTaken')) {
  //   db.deleteObjectStore('notesTaken')
  //   console.log("ALl Stores Deleted!")
  // } 




})



document.getElementById('update-btn').addEventListener('click', (ev) => {
  ev.preventDefault();

  let dateLogged = document.getElementById('date-input').value.trim();
  let amountHarvested = document.getElementById('amount-harvested').value;
  let speciesFarmed = document.getElementById('species').value;
  let notesTaken = document.getElementById('notes').value.trim();

  let key = harvestTaskForm.getAttribute('data-key')
  if (key) {
    let harvest = {
      id: key,
      dateLogged: dateLogged,
      amountHarvested: amountHarvested,
      speciesFarmed: speciesFarmed,
      notesTaken: notesTaken
    }
    let tx = makeTX('harvestData', 'readwrite');
    tx.oncomplete = (ev)=> {
      console.log(ev)
      buildlist()
      clearForm()
    }
    tx.onerror = (err) => {
      console.warn(err);
    }
    let store = tx.objectStore('harvestData');
    let request = store.put(harvest)
  
    request.onsuccess = (ev)=> {
      console.log('sucessfully updated an object', ev)
      let updateBtn = document.getElementById('update-btn')
      updateBtn.classList.add('hidden')
    }
    request.onerror = (err) => {
      console.log('error inrequest to av', err)
  
    }  
  }

})

// document.getElementById('delete-btn').addEventListener('click', (ev) => {
//   ev.preventDefault();
// let key = document.harvestTaskForm.getAttribute('data-key')

let harvestTaskForm = document.getElementById("task-form")
harvestTaskForm.addEventListener('submit', (ev) => {
  var timeStamp = new Date().toISOString();
  ev.preventDefault();
  

  let dateLogged = document.getElementById('date-input').value.trim();
  let amountHarvested = document.getElementById('amount-harvested').value;
  let speciesFarmed = document.getElementById('species').value;
  let notesTaken = document.getElementById('notes').value.trim();


  let harvest = {
    id: timeStamp,
    dateLogged: dateLogged,
    amountHarvested: amountHarvested,
    speciesFarmed: speciesFarmed,
    notesTaken: notesTaken
  }

  let tx = db.transaction('harvestData', 'readwrite');
  tx.oncomplete = (ev)=> {
    console.log(ev)
    buildlist()
    clearForm()
  }
  tx.onerror = (err) => {
    console.warn(err);
  }
  let store = tx.objectStore('harvestData');
  let request = store.add(harvest)

  request.onsuccess = (ev)=> {
    console.log('sucessfully added an object', ev)
  }
  request.onerror = (err) => {
    console.log('error inrequest to av', err)

  }
})

function buildlist() {
  let formOne = document.getElementById("form-1")
  formOne.innerHTML = `<p> Your new recent froms will appear here</p>`
  let tx = makeTX('harvestData', 'readonly')
  tx.oncomplete = (ev) => {

  }
  let store = tx.objectStore('harvestData')
  let getReq = store.getAll();
  

  getReq.onsuccess = (ev) => {
    let request = ev.target; //request === getReq === ev.target
    console.log({request})
    // formOne.innerHTML = request.result.map(harvest => {
    //   return `<li data-key="${harvest.id}" ><span>${harvest.amountHarvested} </span> ${harvest.speciesFarmed}</li>`
    // }).join('\n')




    const result = request.result;
    let resultHtml = '';
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        resultHtml += `
        <div class="injected-html-div">
          <p class="result-text" data-key="${result[i].id}"> Date: <span class="result-test-results">  ${result[i].dateLogged} </span> 
          </p>
          <p class="result-text" data-key="${result[i].id}"> Harvested (kg's): <span class="result-test-results">  ${result[i].amountHarvested} </span> 
          </p>
          <p class="result-text" data-key="${result[i].id}"> Speacies Farmed: <span class="result-test-results">  ${result[i].speciesFarmed} </span> 
          </p>
          <p class="result-text" data-key="${result[i].id}"> Notes: <span class="result-test-results">  ${result[i].notesTaken} </span> 
          </p>
        </div>`;
      } 
      formOne.innerHTML = resultHtml;
    } 
    
    let totalAmountHarvested = 0;
    let totalAmountHarvestedEl = document.getElementById("total-amount-harvested")
    request.result.forEach(harvest => {
      totalAmountHarvested += parseFloat(harvest.amountHarvested);
    });
    totalAmountHarvestedEl.innerHTML =`Total Amount Harvested: ${totalAmountHarvested}KG's!`


//GETTING ALL DATA WAS SUCESSFUL
  }

  getReq.onerror = (err) => {
    console.warn(err);
  }
}

document.getElementById("form-1").addEventListener('click', (ev) => {
  let div = ev.target.closest('[data-key]')
  console.log(div);
  let id = div.getAttribute('data-key')
  console.log(div, id);
  let tx = makeTX('harvestData', 'readonly')
  tx.oncomplete = (ev) =>{
    console.log(id)
  }
  let store = tx.objectStore('harvestData')
  let req = store.get(id)
  req.onsuccess = (ev) => {
    let updateBtn = document.getElementById('update-btn')
    updateBtn.classList.remove('hidden')
    console.log("DIV CLICKED & DATA COLLECTED")
    let harvestTaskForm = document.getElementById("task-form")
    let request = ev.target
    let harvest = request.result
    document.getElementById('date-input').value = harvest.dateLogged
    document.getElementById('amount-harvested').value = harvest.amountHarvested
    document.getElementById('species').value = harvest.speciesFarmed
    document.getElementById('notes').value = harvest.notesTaken
    harvestTaskForm.setAttribute('data-key', harvest.id)

  }
  req.onerror = (err) => {
    console.log("THAT DIV DIDN'T CLICK")
  }
})

function clearForm() {
  const formEl = document.getElementById("task-form")
      const inputEls = formEl.getElementsByTagName("input");
      for (let i = 0; i < inputEls.length; i++) {
        inputEls[i].value = "";
      }
}

function makeTX(storeName, mode) {
  let tx = db.transaction(storeName, mode);
  tx.onerror = (err) => {
      console.warn(err)
  }
  return tx;
}
    
})() 


// UPGRADE NEEDED END HERE************

// )();






































































// const indexedDB =
//   window.indexedDB ||
//   window.mozIndexedDB ||
//   window.webkitIndexedDB ||
//   window.msIndexedDB;

// var timeStamp = new Date().toISOString();

// const request = indexedDB.open("harvestingDataBase", 1);

// request.onerror = function (event) {
//   console.error("An error, opps");
//   console.error(event);
// }

// request.onupgradeneeded = function () {
//   const db = request.result;
//   const store = db.createObjectStore("harvests", {keyPath: "id" })
//   store.createIndex("date_created", ["date"], {unique: false})
//   store.createIndex("amount_harvested_and_species", ["amount_harvested", "species"], {unique: false})
// };

// request.onsuccess = function () {
//   const db = request.result;
//   const transaction = db.transaction("harvests", "readwrite");
//   const store = transaction.objectStore("harvests");
//   const dateIndex = store.index("date_created");
//   const bestSpeciesIndex = store.index("amount_harvested_and_species");

// }

// document.getElementById("task-form").addEventListener("submit", function(event) {
//   event.preventDefault();

//   const request = indexedDB.open("harvestingDataBase", 1);

//   request.onsuccess = function(event) {
//     const date = (document.getElementById("date-input").value);
//     const notes = document.getElementById("notes").value;
//     const amount_harvested = document.getElementById("amount-harvested").value;
//     const species = document.getElementById("species").value;

  

//     console.log("DATA LOGGED, YOU FKN BEAUTY")

//     const harvests = {
//       id: timeStamp,
//       date: date,
//       notes: notes,
//       amount_harvested: amount_harvested,
//       species: species
//     };
    
//     const db = event.target.result;
//     if (db.objectStoreNames.contains("harvests")) {
//       const transaction = db.transaction("harvests", "readwrite");
//       const store = transaction.objectStore("harvests", {keyPath: "id"});
//       const request = store.put(harvests);

//     request.onsuccess = function() {
//     const getLatest = store.openCursor(null, 'prev');
//     getLatest.onsuccess = function(event) {
//       const formEl = document.getElementById("task-form")
//       const inputEls = formEl.getElementsByTagName("input");
//       for (let i = 0; i < inputEls.length; i++) {
//         inputEls[i].value = "";
//       }
    


//     const cursor = event.target.result;
//     const latestResult = cursor.value;
//     const seeFormEl = document.getElementById("see-forms-el");
//     seeFormEl.innerHTML = `
//     <p class="result-text">Date Submitted: <span class="result-test-results"> ${latestResult.date}</span> </p>
//     <p class="result-text">Amount Harvested: <span class="result-test-results"> ${latestResult.amount_harvested} (kg's) </span> </p>
//     <p class="result-text" >Species Farmed: <span class="result-test-results"> ${latestResult.species} </span> </p>
//     <p class="result-text" >Notes taken: <span class="result-test-results"> ${latestResult.notes} </span> </p>
    
    
//     `;
//   }
// }

// // let loggedTextEl = document.getElementById("logged-text");
// // loggedTextEl.innerHTML += `<p class="result-test"> From Submitted: ${date} </p> `;

// request.onerror = function(event) {
//   console.log("IndexedDB error: " + event.target.errorCode);
//   loggedTextEl.innerHTML += ` dev has cooked it, sorry :( `;
// }
//     } else {
//       console.error("The object store named 'harvests' was not found");
//     };
//   }})
