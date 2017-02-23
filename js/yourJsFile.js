 
var data = {tableData:[
        {th:"check",td:["true","true","false","true"],type:"string",sort:true},
        {th:"Num",td:[1,2,3,4],type:"number",sort:true},
        {th:"Name",td:["Piotr","Robert","Kamil","Marcin"],type:"string",sort:true},
        {th:"Surname",td:["Kowalski","Nowak","Noname","Długosz"],type:"string",sort:true},
        {th:"Position",td:["Programista","Księgowy","Sportowiec","Sportowiec"],type:"string"},
        {th:"Telephone",td:["699-399-234","324-567-901","",""],type:"string"}
]};

var tableSet = {
    editType: "buttons", // context, buttons
    sorting: false // false
};

function callback(){
    var savedData = ediTable.getSavedData();
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

var set = true;
var ediTable = new EdiTable(tableSet, data);  
ediTable.editMode(false);
ediTable.onSaveBtn(callback);


document.getElementsByClassName("btn-edit")[0].addEventListener("click",function(e){
    var node = e.target.classList.item(0);
        if(node === "btn-edit"){
            ediTable.editMode(set);
            set = (set === true ? false : true);
        }   
});