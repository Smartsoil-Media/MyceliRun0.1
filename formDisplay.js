const IDB = (function init() {
    let db = null;
    let objectStore = null;
    let DBOpenReq = indexedDB.open('MyceliRunDB', 2); 
    
    DBOpenReq.addEventListener('error', (err) => {
      console.warn(err);
    })
  
    DBOpenReq.addEventListener('success', (ev) => {
      db = ev.target.result;
      console.log('success', db);
  
      let tx = db.transaction('harvestData', 'readwrite');
      let store = tx.objectStore('harvestData');
      let getReq = store.getAll();
  
      getReq.onsuccess = (ev) => {
        let request = ev.target;
        console.log({request});
  
        const result = request.result;
        let resultHtml = '';
        let formOne = document.getElementById("form-1")
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            resultHtml += `
              <div class="injected-html" id="injected-html">
                <p class="result-text" data-key="${result[i].id}" > Date: <span class="result-test-results">  ${result[i].dateLogged} </span> 
                </p>
                <p class="result-text" data-key="${result[i].id}" > Harvested (kg's): <span class="result-test-results">  ${result[i].amountHarvested} </span> 
                </p>
                <p class="result-text" data-key="${result[i].id}" > Speacies Farmed: <span class="result-test-results">  ${result[i].speciesFarmed} </span> 
                </p>
                <p class="result-text" data-key="${result[i].id}" > Notes: <span class="result-test-results">  ${result[i].notesTaken} </span> 
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
      };
  
      getReq.onerror = (err) => {
        console.warn(err);
      };
    });
    
      document.getElementById('update-btn').addEventListener('click', (ev) => {
      ev.preventDefault();
    
      let dateLogged = document.getElementById('date-input').value.trim();
      let amountHarvested = document.getElementById('amount-harvested').value;
      let speciesFarmed = document.getElementById('species').value;
      let notesTaken = document.getElementById('notes').value.trim();
      let updateForm = document.getElementById('update-form')
    
      let key = updateForm.getAttribute('data-key')
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
        }
        tx.onerror = (err) => {
          console.warn(err);
        }
        let store = tx.objectStore('harvestData');
        let request = store.put(harvest)
      
        request.onsuccess = (ev)=> {
          console.log('sucessfully updated an object', ev)
          let updateBtn = document.getElementById('update-btn')
          reloadpage()
          updateBtn.classList.add('hidden')
        }
        request.onerror = (err) => {
          console.log('error inrequest to av', err)
      
        }  
      }
    
    })
  
document.getElementById('for-page-container').addEventListener('click', (ev) => {
  ev.preventDefault();

  
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
      console.log("DIV CLICKED & DATA COLLECTED")
      let updateForm = document.getElementById("update-form")
      updateForm.classList.remove("hidden");


      let request = ev.target
      let harvest = request.result
      document.getElementById('date-input').value = harvest.dateLogged
      document.getElementById('amount-harvested').value = harvest.amountHarvested
      document.getElementById('species').value = harvest.speciesFarmed
      document.getElementById('notes').value = harvest.notesTaken
      updateForm.setAttribute('data-key', harvest.id)
  
    }
    req.onerror = (err) => {
      console.log("THAT DIV DIDN'T CLICK")
    }
  })

  function makeTX(storeName, mode) {
    let tx = db.transaction(storeName, mode);
    tx.onerror = (err) => {
        console.warn(err)
    }
    return tx;
  }

  function reloadpage(){
    var returnURL = "https://stately-buttercream-702f49.netlify.app/" + Math.random() * 100;

    setTimeout(function() 
    {
        window.location=returnURL; 
    }, 50 );


}
  


    DBOpenReq.addEventListener('upgradeneeded', (ev) => {
      db = ev.target.result;
      let oldVersion = ev.oldVersion;
      let newVersion = ev.newVersion || db.version;
      console.log('DB updated from version', oldVersion, 'to', newVersion );
      console.log('upgrade', db);
    
      if (!db.objectStoreNames.contains('harvestData')) {
        objectStore = db.createObjectStore('harvestData', {keyPath: "id" });  
      }
    });
  })();
  
