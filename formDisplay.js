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
              <div class="injected-html">
                <p class="result-text"> Date: <span class="result-test-results">  ${result[i].dateLogged} </span> 
                </p>
                <p class="result-text"> Harvested (kg's): <span class="result-test-results">  ${result[i].amountHarvested} </span> 
                </p>
                <p class="result-text"> Speacies Farmed: <span class="result-test-results">  ${result[i].speciesFarmed} </span> 
                </p>
                <p class="result-text"> Notes: <span class="result-test-results">  ${result[i].notesTaken} </span> 
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
  
