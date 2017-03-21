 
var data = {tableData:[
        {th:"check",td:["true","true","false","true"],type:"string",sort:true},
        {th:"Numbers",td:[1,2,12,4],type:"number",sort:true},
        {th:"Name",td:["Piotr","Robert","Kamil","Marcin"],type:"string",sort:true},
        {th:"Surname",td:["Kowalski","Nowak","Noname","Dlugosz"],type:"string",sort:true},
        {th:"Position",td:["Programmer","Accountant","Police officer","Athlete"],type:"string"},
        {th:"Telephone",td:["699-399-234","324-567-901","",""],type:"string"},
]};

// contextmenu, buttons
var ediTable = new EdiTable(data,"buttons");  
var set = true;

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

ediTable.editMode(false);
ediTable.onSaveBtn(callback);

/*
 * Button "Edit Table"
 */
var btnTableEdit = document.getElementsByClassName("btn-edit-container")[0];
var table = document.getElementById("yourTable");
btnTableEdit.parentNode.insertBefore(btnTableEdit,table);

btnTableEdit.addEventListener("click",function(e){
    var node = e.target.classList.item(0);
        if(node === "btn-edit"){
            //console.log("btn-edit "+set);
            ediTable.editMode(set);
            set = (set === true ? false : true);
        }   
});