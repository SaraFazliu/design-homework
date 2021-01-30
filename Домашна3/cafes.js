// initialize Leaflet
var map = L.map('map').setView({lon: 21.4338, lat: 41.9987}, 15);

// add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    //attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

// show the scale bar on the lower left corner
L.control.scale().addTo(map);


function getLocation() {
    //if user's location settings is disabled this wont show marker
    map.locate({
        setView: false,
        enableHighAccuracy: true
    })
        .on('locationfound', function (e) {
            var marker = new L.marker(e.latlng);
            marker.addTo(map);
        });
}

/*function loadLocations(where) {
    $.ajax({
        url: 'kafe.csv',
        dataType: 'text',
    }).done(
        (data) => {
            var allRows = data.split(/\r?\n|\r/);

            for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
                var rowCells = allRows[singleRow].split(',');
                if(where !== rowCells[4]) continue;
                console.log(rowCells);
                L.marker([rowCells[1], rowCells[2]]).addTo(map)
                    .bindPopup(`<p style="color:black;">${rowCells[3]}</p>`)
            }
        });
}*/

//loadLocations(findGetParameter('where'));
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}


function showLocation(name){
    $.ajax({
        url: 'kafe.csv',
        dataType: 'text',
    }).done(find);
    function find(data){
        var allRows = data.split(/\r?\n|\r/);
        for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
            var rowCells = allRows[singleRow].split(',');
            console.log(name);
            if (rowCells[3] === name){
                let to = L.marker({lon: rowCells[2], lat: rowCells[1]}).getLatLng();
                let from = getLocation();
                console.log(from + ' ' + to);
                L.marker({lon: rowCells[2], lat: rowCells[1]}).addTo(map)
                    .bindPopup(`<p style="color:black;">${from.distanceTo(to) + ' km'}</p>`);

            }
        }
    }
}

parseData();
function parseData() {
    $.ajax({
        url: 'kafe.csv',
        dataType: 'text',
    }).done(successFunction);
}

function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    var table = '<table>';
    for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
        var rowCells = allRows[singleRow].split(',');
        if(findGetParameter('where') !== rowCells[4]) continue;
        table += '<tr>';
        table += '<td onclick="showLocation(this.innerText)">';
        table += rowCells[3] + '</td>';
        table += '<td>' + rowCells[5] + '<br>';
        table += '</td>';
        table += '</tr>';
    }
    table += '</tbody>';
    table += '</table>';

    document.getElementById("list").innerHTML=table;
}

function  searchbar(){
    var where = findGetParameter('where');
    var arr = [];
    var inp = document.getElementById('myInput');
    $.ajax({
        url: 'kafe.csv',
        dataType: 'text',
    }).done(
        (data) => {
            var allRows = data.split(/\r?\n|\r/);

            for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
                var rowCells = allRows[singleRow].split(',');
                if (where !== rowCells[4]) continue;
                arr.push(rowCells[3]);
            }

            inp.addEventListener("input", function(e) {
                var a, b, i, val = this.value;
                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) { return false;}
                currentFocus = -1;
                /*create a DIV element that will contain the items (values):*/
                a = document.createElement("DIV");
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                /*append the DIV element as a child of the autocomplete container:*/
                this.parentNode.appendChild(a);
                /*for each item in the array...*/
                for (i = 0; i < arr.length; i++) {
                    /*check if the item starts with the same letters as the text field value:*/
                    if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                        /*create a DIV element for each matching element:*/
                        b = document.createElement("DIV");
                        /*make the matching letters bold:*/
                        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                        b.innerHTML += arr[i].substr(val.length);
                        /*insert a input field that will hold the current array item's value:*/
                        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                        /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function(e) {
                            /*insert the value for the autocomplete text field:*/
                            inp.value = this.getElementsByTagName("input")[0].value;
                            showLocation(this.getElementsByTagName("input")[0].value);
                            /*close the list of autocompleted values,
                            (or any other open lists of autocompleted values:*/
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                }
            });

            function closeAllLists(elmnt) {
                /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != inp) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
            }
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        });
}
