
function getJSON(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("GET", url);
    req.onload = () => resolve(req.responseText);
    req.onerror = () => reject(req.statusText);
    req.send();
  })
}

//URLS de interes
let urlEventos = "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

//Lectura de URLs
let myEvents;
function leerEventos() {
  getJSON(urlEventos).then(response => {
    let eventos = response;
    myEvents = JSON.parse(eventos);
    displayTabla(myEvents, "table");
    var orgData = filterAndCount(myEvents);
    console.log("orgData ->" , orgData);
    displayTabla(orgData, "table2");
  })
}

//Mostrar tabla inicial
function displayTabla(list, id) {
  var cols = [];

  for (var i = 0; i < list.length; i++) {
    for (var k in list[i]) {
      if (cols.indexOf(k) === -1) {
        cols.push(k);
      }
    }
  }

  var table = document.getElementById(id);

  var tr = table.insertRow(-1);

  var theader = document.createElement("th");
  theader.innerHTML = "#";

  tr.appendChild(theader);

  for (var i = 0; i < cols.length; i++) {
    var theader = document.createElement("th");
    theader.innerHTML = cols[i];

    tr.appendChild(theader);
  }

  for (var i = 0; i < list.length; i++) {
    trow = table.insertRow(-1);
    if (list[i][cols[1]] == true) {
      trow.style.backgroundColor = "pink";
    }

    var cell = trow.insertCell(-1);
    cell.innerHTML = i + 1;

    for (var j = 0; j < cols.length; j++) {
      var cell = trow.insertCell(-1);

      cell.innerHTML = list[i][cols[j]];

    }
  }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function filterAndCount(data){
  var allEvents = [];
  for(var i = 0; i < data.length; i++){
    allEvents = allEvents.concat(data[i].events);
  }
  var uniqueEvents = allEvents.filter(onlyUnique);

  var corrIndex = [];
  for(var i = 0; i < uniqueEvents.length; i++){
    var uniqueValue = uniqueEvents[i];
    var tp = 0;
    var tn = 0;
    var fp = 0;
    var fn = 0;
    for(var j = 0; j < data.length; j++){
      var vals = data[j];
      var flag = false;
      for( var k = 0; k < vals.events.length; k++){
        var word = vals.events[k];
        if( word === uniqueValue){
          flag = true;
          if( vals.squirrel == true){
            tp++;
          }
          else{
            fn++;
          }
        }
      }
      if( flag === false){
        if( vals.squirrel == true){
          fp++;
        }
        else{
          tn++;
        }
      }
    }
    var calculation = (tp*tn-fp*fn)/(Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn)));
    corrIndex.push({"Event": uniqueValue, "Correlation": calculation});
  }
  corrIndex.sort(function (a,b){
    if(a.Correlation < b.Correlation)
    {
      return 1;
    }
    else if(a.Correlation > b.Correlation){
      return -1;
    }
    else{
      return 0;
    }
  });
  return corrIndex;
  
}

leerEventos();