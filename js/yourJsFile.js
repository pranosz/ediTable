 // Table in JSON format
var data = {tableData:[
        {th:"Text header 1",td:["cell1","cell2","cell3","cell4"],type:"string",sort:true},
        {th:"Text header 2",td:[1,2,12,4],type:"number",sort:true},
        {th:"Text header 3",td:["cell1","cell2","cell3","cell4"],type:"string",sort:true},
        {th:"Text header 4",td:["cell1","cell2","cell3","cell4"],type:"string",sort:false},
        {th:"Text header 5",td:["cell1","cell2","cell3","cell4"],type:"string",sort:false},
        {th:"Text header 6",td:["cell1","cell2","cell3","cell4"],type:"string",sort:true},
]};

// contextmenu, buttons
var ediTable = new EdiTable(data,"buttons");  
// set used for switched edit button
var set = true;


// Callback function for save button
function callback(){
    var savedData = ediTable.savedData();
    var item = document.getElementsByClassName("btn-save-container")[0];
    var nodetext = document.createTextNode(savedData);
    var divJson = document.createElement("pre");
    divJson.className = "display-json";
    if(item.childNodes[1]){
        item.removeChild(item.childNodes[1]);
    }
    divJson.appendChild(nodetext);
    item.appendChild(divJson);
}
// Button "Save"
ediTable.onSaveBtn(callback);

 // Button "Edit Table"
var btnTableEdit = document.getElementsByClassName("btn-edit-container")[0];
var table = document.getElementById("yourTable");
btnTableEdit.parentNode.insertBefore(btnTableEdit,table);

btnTableEdit.addEventListener("click",function(e){
    var node = e.target.classList.item(0);
        if(node === "btn-edit"){
            ediTable.editMode(set);
            set = (set === true ? false : true);
        }   
});