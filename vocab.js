
//get table and listheader variables
 var table = document.getElementById("myTable"), rIndex, cIndex;
//  var ListHeader = document.getElementById("ListHeader");
//  var term = document.getElementById("input1");
//  alert(term.value);
 //check for custom list title through cookies  
 if(document.cookie != ""){
    var header = getCookie("header");
    var term = getCookie("term");
    var def = getCookie("def");
}
 

if(document.cookie != ""){
    var header = getCookie("header");
    var term = getCookie("term");
    var def = getCookie("def");
    if(header!= ""){
        if(header != "WordList" || header != "undefined" || header != "header"  || header != ""|| header !=  null){
            ListHeader.innerHTML = header;
        }  
    }
    if(ListHeader.innerHTML == ""){
        ListHeader.innerHTML = "WordList"
    }
    if(term != "" || term != "undefined"){
        input1.value = term;
    }  
    if(def != "" || def != "undefined"){
        input2.value = def;
    }   
 }
 
 
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

if(localStorage.length == 0){
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);  
 }  
 
 
//restore the existing list from localstorage and construct the table
var m = localStorage.length;
for (var j = 0; j < m; j= j+2) { 
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);  
    //check for null items
    if(localStorage.getItem(j) == null){
        j = j+2; 
        m = m+2;
    }
    cell1.innerHTML = localStorage.getItem(j);
    cell2.innerHTML = localStorage.getItem(j+1);
  }
     
input1.onclick = function(e){
    document.body.onkeyup = function(e) {
      if (e.keyCode == 13 ) {
        newItem(); 
      }
    };
}; 

input2.onclick = function(e){
    document.body.onkeyup = function(e) {
      if (e.keyCode == 13 ) {
        newItem(); 
      }
    };
}; 

document.body.onkeyup = function(e) {
    if (e.keyCode == 46 || e.keyCode == 8) {
        checkrows(); 
      }
} 

   //track changes in the list title, update cookie if so
ListHeader.addEventListener("input", function(){
    document.cookie = "header=" + ListHeader.innerHTML;  
});
input1.addEventListener("input", function(){ 
    document.cookie = "term=" + input1.value; 
});
input2.addEventListener("input", function(){
    document.cookie = "def=" + input2.value; 
});

searchbar.addEventListener("input", function(){
    if(searchbar.value.length < 2){
        searchbar.value = "Define " + searchbar.value; 
    }
});
// searchbar.click(function(){
//     if(searchbar.value == ""){
//         searchbar.value = "Define " + searchbar.value; 
//         }
// });
  
// document.addEventListener("click", saveMousePos);

//helper function for reading the localstorage
function readmem(){ 
    alert("read");
    for (var i = 0; i < localStorage.length; i++)   {
        console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
        alert(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
    }
};

//function for adding a new entry to the list and local storage
function newItem() {
    var item = document.getElementById("input1").value;
    var item2 = document.getElementById("input2").value; 
    if((item != "" || item2 != "") && (item != null || item2 != null)){
      var row = table.insertRow(1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = item;
      cell2.innerHTML = item2;
   
      document.getElementById("input1").value = "";
      document.getElementById("input2").value = "";
  
      if(table.rows[table.rows.length-1].cells[0].innerHTML == "" && table.rows[table.rows.length-1].cells[1].innerHTML == "" ){
          table.deleteRow(table.rows.length-1);
      } 
      n = table.rows.length -2; 
      localStorage.setItem(2*n, cell1.innerHTML);
      localStorage.setItem(((2*n)+1), cell2.innerHTML); 
    } 
    document.cookie = "term=" + "";  
    document.cookie = "def=" + "";  
  } 
   

function checkrows(){
    var n = table.rows.length;
    for (var i = 1; i<n; i++){ 
        if((table.rows[i].cells[0].innerHTML == "<br>" || table.rows[i].cells[0].innerHTML == "" || table.rows[i].cells[0].innerHTML == "<br><br>") && 
        (table.rows[i].cells[1].innerHTML == "<br>" || table.rows[i].cells[1].innerHTML == "" || table.rows[i].cells[1].innerHTML == "<br><br>")
        &&(localStorage.length>2)){
            table.deleteRow(i);
            var m = n - i -1; 
            localStorage.removeItem(2*m);
            localStorage.removeItem((2*m)+1); 
        }
    }
}

 
//event listeners for the buttons
document.getElementById("clean").addEventListener("click", clean);
document.getElementById("download").addEventListener("click", download);
document.getElementById("save_edits").addEventListener("click", save_edits);

//clean function for the table and storage
function clean(){ 
    var x = document.getElementById("myTable").rows.length; 
    for (j = 1; j < x; j++) { 
        table.deleteRow(-1);
    } 
    localStorage.clear();   
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1); 
    document.cookie = "term=" + "";  
    document.cookie = "def=" + "";  
    document.cookie = "header=" + "";  
    location.reload();
} 

//download as csv helper function
function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink; 
    csvFile = new Blob([csv], {type: "text/csv"}); 
    downloadLink = document.createElement("a"); 
    downloadLink.download = filename; 
    downloadLink.href = window.URL.createObjectURL(csvFile); 
    downloadLink.style.display = "none"; 
    document.body.appendChild(downloadLink); 
    downloadLink.click();
}
function download(){ 
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    } 
    var title = document.getElementById("ListHeader").innerHTML
    downloadCSV(csv.join("\n"), title);
} 

//function to save edits
function save_edits(){
    var mytable = document.getElementById("myTable");
    var nrow = mytable.rows.length-1;   
    keys = nrow*2;
    p = 0;
    for (var i = nrow; i > 0; i--) {   
        var cell1 = mytable.rows[i].cells[0];
        var cell2 = mytable.rows[i].cells[1];    
        var myi = nrow-myi -1; 
        localStorage.setItem(p, cell1.innerHTML);
        localStorage.setItem(p+1, cell2.innerHTML);    
        p=p+2;
    }  
    location.reload();
    location.reload();
}


var t = '';
function gText(e) {
    t = (document.all) ? document.selection.createRange().text : document.getSelection();
    // alert(t);
	t = t.replace(/^\s+|\s+$/g,"");
	if(t && t.indexOf(' ') == -1){
	GM_xmlhttpRequest({
      method: "GET",
      url: "http://www.google.com/dictionary/json?callback=callback&q="+t+"&sl=en&tl=en&restrict=pr%2Cde&client=te",
      onload: function(response) {
		var data = eval("(" + response.responseText + ")");
        }
    });
    }
    // alert(response.responseText);
}

function callback(data,http,flag){
	var meaning = null;
	try{
		meaning = data.primaries[0].entries[1].terms[0].text;
		if(meaning) alert(meaning);
	}catch(e){
	}
}



document.addEventListener("mouseup",gText,false);