// CREATING THE DATA BASES 


var harvestDB = window.indexedDB.open("harvests", 1);

harvestDB.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("harvests", { keyPath: "id", autoIncrement: false});

  objectStore.createIndex("notes", "idNotes", {unique: false});
  objectStore.createIndex("amountHavested", 1, {unique: false});
  objectStore.createIndex("speciesFarmered", "speciesName", {unique: false});
};


harvestDB.onerror = function (event) {
  console.error("An error occurred while creating harvest database:", event.target.errorCode);
};

var taskDB = window.indexedDB.open("tasks", 1);

taskDB.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("tasks", {keyPath: "id", autoIncrement: true});
  objectStore.createIndex("taskName", "taskName", {unique: false});
  objectStore.createIndex("timeSpents", "hrs", {unique: false});
  objectStore.createIndex("notes", "idNotes", {unique: false});
};


// END OF CREATING DATA BASES ************

