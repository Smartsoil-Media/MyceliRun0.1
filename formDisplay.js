const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

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
  
  const cursor = store.openCursor();
  cursor.onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
      const date = cursor.value.date;
      const amountHarvested = cursor.value.amount_harvested;
      const species = cursor.value.species;
      
      // update the UI with the retrieved data
      const formOne = document.getElementById("form-1");
      const formTwo = document.getElementById("")
      formOne.innerHTML = `<p>Date: ${date}</p><p>Amount Harvested: ${amountHarvested}</p><p>Species: ${species}</p>`;
      document.getElementById("container").appendChild(element);

      cursor.continue();
    }
  };
};