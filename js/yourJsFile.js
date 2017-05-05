
// contextmenu, buttons
var ediTable = new EdiTable("buttons");
// Set edit mode enabled
ediTable.editMode(true);
// set used for switched edit button
var set = false;


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
ediTable.onSaveBtn = callback;

 // Button "Edit Table"
var btnTableEdit = document.getElementsByClassName("btn-edit-container")[0];

btnTableEdit.addEventListener("click",function(e){
    var node = e.target.classList.item(0);
        if(node === "btn-edit"){
            console.log(set);
            ediTable.editMode(set);
            set = (set === true ? false : true);
        }   
});