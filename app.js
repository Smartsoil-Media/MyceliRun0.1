const loggedTextEl = document.getElementById("logged-text")



// ADDING DATA TO DATABASES

document.getElementById("task-form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    var date = new Date(document.getElementById("date-input").value);
    var taskDesc = document.getElementById("task-desc").value;
    var amountHarvested = document.getElementById("amount-harvested").value;
    var speacies = document.getElementById("speacies").value;
  
    var id = new Date().toISOString();
    var harvest = {
      id: id,
      date: date,
      taskDesc: taskDesc,
      amountHarvested: amountHarvested,
      speacies: speacies
    };
  
    var request = window.indexedDB.open("harvests", 1);
  
    request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction("harvests", "readwrite");
      var objectStore = transaction.objectStore("harvests");
      var request = objectStore.add(harvest);
      loggedTextEl.innerHTML = ""
      loggedTextEl.innerHTML += ` New form submitted at ${id} `
  
      request.onsuccess = function(event) {
        console.log("Data has been added to the database");
      };
  
      request.onerror = function(event) {
        console.log("Data could not be added to the database");
        loggedTextEl.innerHTML += ` you have had an eroor, sorry :( `
      };
    };
  
    request.onerror = function(event) {
      console.log("IndexedDB error: " + event.target.errorCode);
    };
});


// ADDING DATA TO DATABASES