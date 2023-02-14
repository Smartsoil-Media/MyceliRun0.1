const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || { open: function() { throw new Error("IndexedDB not supported"); } };

// CREATING THE DATA BASES

var harvestDB = window.indexedDB.open("harvests", 1);

harvestDB.onupgradeneeded = function(event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("harvests", {
    keyPath: "id",
    autoIncrement: false
  });

  objectStore.createIndex("taskDesc", "taskDesc", { unique: false });
  objectStore.createIndex("amountHarvested", "amountHarvested", { unique: false });
  objectStore.createIndex("species", "species", { unique: false });
};

harvestDB.onsuccess = function(event) {
  var db = event.target.result;
  if (db.objectStoreNames.contains("harvests")) {
    let loggedTextEl = document.getElementById("logged-text");
  }
};

var taskDB = window.indexedDB.open("tasks", 1);

taskDB.onupgradeneeded = function(event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("taskName", "taskName", { unique: false });
  objectStore.createIndex("timeSpents", "hrs", { unique: false });
  objectStore.createIndex("notes", "idNotes", { unique: false });
};

// END OF CREATING DATA BASES ************

// ADDING DATA TO DATABASES

document.getElementById("task-form").addEventListener("submit", function(event) {
  event.preventDefault();

  var date = new Date(document.getElementById("date-input").value);
  var taskDesc = document.getElementById("task-desc").value;
  var amountHarvested = document.getElementById("amount-harvested").value;
  var species = document.getElementById("species").value;

  var id = new Date().toISOString();
  var harvest = {
    id: id,
    date: date,
    taskDesc: taskDesc,
    amountHarvested: amountHarvested,
    species: species
  };

  var request = window.indexedDB.open("harvests", 1);

  request.onsuccess = function(event) {
    var db = event.target.result;
    if (db.objectStoreNames.contains("harvests")) {
      var transaction = db.transaction("harvests", "readwrite");
      var objectStore = transaction.objectStore("harvests");
      var request = objectStore.add(harvest);

      let loggedTextEl = document.getElementById("logged-text");
      loggedTextEl.innerHTML += ` New form submitted at ${id} `;

      request.onerror = function(event) {
        console.log("IndexedDB error: " + event.target.errorCode);
        loggedTextEl.innerHTML += ` dev has cooked it, sorry :( `;
      };
    } else {
      console.error("The object store named 'harvests' was not found");
    }
  };
});
