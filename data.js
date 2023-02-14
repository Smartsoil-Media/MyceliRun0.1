const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

var timeStamp = new Date().toISOString();

const request = indexedDB.open("harvestingDataBase", 1);

request.onerror = function (event) {
  console.error("An error, opps");
  console.error(event);
}

request.onupgradeneeded = function () {
  const db = request.result;
  const store = db.createObjectStore("harvests", {keyPath: "id" })
  store.createIndex("date_created", ["date"], {unique: false})
  store.createIndex("amount_harvested_and_species", ["amount_harvested", "species"], {unique: false})
};

request.onsuccess = function () {
  const db = request.result;
  const transaction = db.transaction("harvests", "readwrite");
  const store = transaction.objectStore("harvests");
  const dateIndex = store.index("date_created");
  const bestSpeciesIndex = store.index("amount_harvested_and_species");

}

document.getElementById("task-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const request = indexedDB.open("harvestingDataBase", 1);

  request.onsuccess = function(event) {
    const date = (document.getElementById("date-input").value);
    const notes = document.getElementById("notes").value;
    const amount_harvested = document.getElementById("amount-harvested").value;
    const species = document.getElementById("species").value;

  

    console.log("DATA LOGGED, YOU FKN BEAUTY")

    const harvests = {
      id: timeStamp,
      date: date,
      notes: notes,
      amount_harvested: amount_harvested,
      species: species
    };
    
    const db = event.target.result;
    if (db.objectStoreNames.contains("harvests")) {
      const transaction = db.transaction("harvests", "readwrite");
      const store = transaction.objectStore("harvests", {keyPath: "id"});
      const request = store.put(harvests);

    request.onsuccess = function() {
    const getLatest = store.openCursor(null, 'prev');
    getLatest.onsuccess = function(event) {
      const formEl = document.getElementById("task-form")
      const inputEls = formEl.getElementsByTagName("input");
      for (let i = 0; i < inputEls.length; i++) {
        inputEls[i].value = "";
      }
    


    const cursor = event.target.result;
    const latestResult = cursor.value;
    const seeFormEl = document.getElementById("see-forms-el");
    seeFormEl.innerHTML = `
    <p class="result-text">Date Submitted: <span class="result-test-results"> ${latestResult.date}</span> </p>
    <p class="result-text">Amount Harvested: <span class="result-test-results"> ${latestResult.amount_harvested} (kg's) </span> </p>
    <p class="result-text" >Species Farmed: <span class="result-test-results"> ${latestResult.species} </span> </p>
    <p class="result-text" >Notes taken: <span class="result-test-results"> ${latestResult.notes} </span> </p>
    
    
    `;
  }
}

// let loggedTextEl = document.getElementById("logged-text");
// loggedTextEl.innerHTML += `<p class="result-test"> From Submitted: ${date} </p> `;

request.onerror = function(event) {
  console.log("IndexedDB error: " + event.target.errorCode);
  loggedTextEl.innerHTML += ` dev has cooked it, sorry :( `;
}
    } else {
      console.error("The object store named 'harvests' was not found");
    };
  }})
