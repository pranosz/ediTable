/*
 * EdiTable
 * 
 * To do - describe component
 * 
 * @param:String {tableId} id attribute of table in which we want use "EdiTable" component
 * @param:Object {tableSet} a set of parameters that we want to send to "EdiTable" component
 */
"use strict";

function EdiTable(tableSet, data){
    this._data = data;
    this._contextmenu = null;
    this._rowBtns = null;
    this._colBtns = null;
    this._selectedRow = null;
    this._selectedCol = null;
    this._xPozCol = null;
    this._ediType = null;
    this._currentTd = null;
    
    this._generateTable();
    this._table = document.getElementById("yourTable");
    
    var config = this._setConfig(tableSet);
    
    for(var opt in config){
        switch (opt){
            case "editType":
                this._ediType = config[opt];
                this._setEditType();
                break;
            case "sorting":
                this._setSorting(config[opt]);
                break;
            case "exportCSV":
                this._setCSV(config[opt]);
                break;
            case "defaultCss":
                this._setDefaultCss(config[opt]);
                break;
            case "colToSort":
                this._setColToSort(config[opt]);
                break;
            case "pagination":
                this._setPagination(config[opt]);
                break;
            case "language":
                this._setLanguage(config[opt]);
                break;
        }
    }
};
/*
 * _createTable
 */
EdiTable.prototype._createTable = function(){
    var table = document.createElement("table");
    table.setAttribute("id","yourTable");
    table.insertRow(0);
    this._data.tableData.forEach(function(col,i){
        table.insertRow(i);
    });
    document.getElementsByTagName("Body")[0].insertBefore(table,document.getElementsByTagName("Body")[0].firstChild);
    return table;
};
/*
 * _generateTable
 */
EdiTable.prototype._generateTable = function(){
    var table = this._createTable();
    this._data.tableData.forEach(function(col,i){
        var th = document.createElement("th");        
        var textNode = document.createTextNode(col.th);
        th.appendChild(textNode);
        table.rows[0].appendChild(th);
            col.td.forEach(function(cell,j){
                table.rows[j+1].insertCell(i).innerHTML = cell;
            });
    });    
};

/*
 * Default settings
 */
EdiTable.prototype._defaultSet = {
    editType: "context", // buttons, none
    sorting: true, // false
    exportCSV: false, // false
    defaultCss: true, // false
    colToSort: [], // choice column to sort (optional property)
    pagination: true, //false
    language: "pl" // "eng"
};

/*
 * _setConfig - compare user settings with default settings.
 * If user doesn't set one of the values then it's taken from 
 * defaults config.
 * 
 * @param:object {tableSet} user config
 * @return:object {defaultCopy} updated the default configuration of user configuration
 */
EdiTable.prototype._setConfig = function(tableSet){
    var defaultCopy = JSON.parse(JSON.stringify(this._defaultSet));
    
    for(var opt in defaultCopy){
        if(opt in tableSet){
            defaultCopy[opt] = tableSet[opt];
        } 
    }
    return defaultCopy;
};

/*
 * _setEditType
 */
EdiTable.prototype._setEditType = function(){
    if(this._ediType === "context"){
        this._addContextmenu();
    }else if(this._ediType === "buttons"){
        this._addBtns();
    }else {
        //none
    }
};
/*
 * _setSorting
 */
EdiTable.prototype._setSorting = function(state){
    //this._sorting(state);
};
/*
 * _setCSV
 */
EdiTable.prototype._setCSV = function(){
    
};
/*
 * _setDefaultCss
 */
EdiTable.prototype._setDefaultCss = function(){
    
};
/*
 * _setColToSort
 */
EdiTable.prototype._setColToSort = function(){
    
};
/*
 * _setPagination
 */
EdiTable.prototype._setPagination = function(){
    
};
/*
 * _setLanguage
 */
EdiTable.prototype._setLanguage = function(){
    
};
/*
 * _addRow
 */
EdiTable.prototype._addRow = function(side){
    var newRow = null;
    var index = null;
    var colums = null;
    if(side === "U"){
        index = this._selectedRow;
    }else if(side === "D"){
        index = this._selectedRow+1;
    }
    if(index !== null){
        newRow = this._table.insertRow(index);
        colums = this._table.rows[0].cells;
        Array.prototype.forEach.call(colums,function(col,i){
            newRow.insertCell(i).innerHTML = "Ddefault";
        });                
    }
};
/*
 * _delRow
 */
EdiTable.prototype._delRow = function(){
    this._table.deleteRow(this._selectedRow);
};
/*
 * _addCol
 */
EdiTable.prototype._addCol = function(side){
    var index = null;
    var r = this._table.rows;
    if(side === "R"){
        index = this._selectedCol + 1;
    }else if(side === "L"){
        index = this._selectedCol;
    }
    Array.prototype.forEach.call(r,function(row,i){
        if(i===0){
            row.insertCell(index).outerHTML = "<th>Ddefault</th>";
        }else{
            row.insertCell(index).innerHTML = "Ddefault";
        }
    });
};
/*
 * _delCol
 */
EdiTable.prototype._delCol = function(){
    var index = this._selectedCol;
    var r = this._table.rows;
    Array.prototype.forEach.call(r,function(row,i){
        row.deleteCell(index);
    });
};
/*
 * _addEventsToButtons
 */
EdiTable.prototype._addEventsToButtons = function(){
    var owner = this;
    document.querySelector("body").addEventListener("click",function(e){
    var node = e.target.classList.item(1);
        switch(node){
            case "button-add-row-up":
                owner._addRow("U");
            break;
            case "button-add-row-down":
                owner._addRow("D");
            break;
            case "button-del-row":
                owner._delRow();
            break;
            case "button-add-col-right":
                owner._addCol("R");
            break;
            case "button-add-col-left":
                owner._addCol("L");
            break;           
            case "button-del-col":
                owner._delCol();
            break;
        }
        if(owner._ediType === "buttons"){
            owner._btnRowPosition();
            owner._btnColPosition();
        }
    },false);
};
/*
 * _showMenu
 */
EdiTable.prototype._showContexmenu = function(){ 
    if(this._t){
        this._t = 0;
        this._contextmenu.style.display = "block";
    }else {
        this._t = 1;
        this._contextmenu.style.display = "none";
    }
};
/*
 * _drawContextmenu
 */
EdiTable.prototype._drawContextmenu = function(btns){
    var div = document.createElement("div");
    var ul = document.createElement("ul");
    
    div.classList.add("context");
    ul.classList.add("context-list");
    
    btns.forEach(function(btn,i){
        var li = document.createElement("li");
        var b = document.createElement("button");
        var text = document.createTextNode(btn.label);
        b.classList.add("btn-context");
        b.classList.add(btn.class);
        b.appendChild(text);
        li.appendChild(b);
        ul.appendChild(li);
    });
    div.appendChild(ul);
    this._table.parentNode.insertBefore(div,null);
    this._contextmenu = document.querySelector(".context");    
};
/*
 * _addEventContextmenu
 */
EdiTable.prototype._addEventContextmenu = function(){
    
    this._t = 1;
    var owner = this;
    
    this._table.addEventListener("contextmenu",function(e){
        var node = e.target.nodeName;
        var btnDis = document.querySelector(".button-add-row-up");
        if(node === "TH" || node === "TD"){
            e.preventDefault();
            owner._setContextPosition(e);
            owner._selectedRow = e.target.parentNode.rowIndex;
            owner._selectedCol = e.target.cellIndex;
            if(node === "TH"){
                btnDis.classList.remove("btn-context");
                btnDis.classList.add("btn-disabled");
                btnDis.disabled = true;
            }else if(node === "TD"){
                btnDis.classList.remove("btn-disabled");
                btnDis.classList.add("btn-context");
                btnDis.disabled = false;
            }
            owner._showContexmenu();
        }
    },false);
    
    window.addEventListener("click",function(){ 
        owner._t === 0 ? owner._showContexmenu():null;
    },false);
    
    window.onresize = function(){
        owner._t = 1;
        owner._contextmenu.style.display = "none";
    };  
    this._addEventsToButtons();
};
/* 
 * _setContextPosition
 */
EdiTable.prototype._setContextPosition = function(eventObj){
    this._contextmenu.style.position = "absolute";
    this._contextmenu.style.left = eventObj.clientX+"px";
    this._contextmenu.style.top = eventObj.clientY+"px";
};
/*
 * _addContextmenu
 */
EdiTable.prototype._addContextmenu = function(){ 
    var blueprints = [
    {class: "button-add-row-up", label: "Add row above",function: this._addRow},
    {class: "button-add-row-down", label: "Add row below",function: this._addRow},
    {class: "button-del-row", label: "Delete row",function: this._delRow},
    {class: "button-add-col-right", label: "Add column to right",function: this._addCol},
    {class: "button-add-col-left", label: "Add column to left",function: this._addCol},
    {class: "button-del-col", label: "Delete column",function: this._delCol}
    ];
    this._drawContextmenu(blueprints);
    this._addEventContextmenu(); 
};
/*
 * 
 * ----------------------------Buttons------------------------
 */
EdiTable.prototype._drawButtons = function(btns){
    var btnsRowBox = document.createElement("div");
    var btnsColBox = document.createElement("div");
    btnsRowBox.setAttribute("id","btns-row-edit");
    btnsColBox.setAttribute("id","btns-col-edit");
    
    btns.forEach(function(btn,i){
        var circle = document.createElement("div");
        var button = document.createElement("button");
        
        circle.classList.add(btn.class[0]);
        button.classList.add("btn-arrows");
        button.classList.add(btn.class[1]);
        
        circle.appendChild(button);
        if(i<3){
            btnsRowBox.appendChild(circle);  
        }else {
            btnsColBox.appendChild(circle);
        }
    });
    
    this._table.parentNode.insertBefore(btnsRowBox,null);
    this._table.parentNode.insertBefore(btnsColBox,null);
    this._rowBtns = document.querySelector("#btns-row-edit");
    this._colBtns = document.querySelector("#btns-col-edit");
};
/*
 * _btnRowPosition
 */
EdiTable.prototype._btnRowPosition = function(){
    var leftMarginStr = window.getComputedStyle(this._table).marginLeft;
    var leftMargin = Number(leftMarginStr.slice(0,leftMarginStr.length-2));
    var offsetTop = this._table.rows[Number(this._selectedRow)].offsetTop+leftMargin;           
    this._rowBtns.style.top = offsetTop+"px";
    this._rowBtns.style.left = (this._table.rows[0].clientWidth)+"px";
};
/*
 * _btnColPosition
 */
EdiTable.prototype._btnColPosition = function(){
    this._colBtns.style.top = "0px";
    this._colBtns.style.left = this._xPozCol+"px";
};
/*
 * _setInput
 */
EdiTable.prototype._setInput = function(td){
    var input = document.createElement("input");
    this._currentTd = {
        item:input, 
        paddingBottom:td.style.paddingBottom,
        paddingLeft:td.style.paddingLeft,
        paddingRight:td.style.paddingRight,
        paddingTop:td.style.paddingTop
    };
    td.style.padding = "0px";
    input.style.height = (td.clientHeight-2)+"px";
    input.style.width = (td.clientWidth-2)+"px";
    input.style.border = "1px solid #e4e4e4";
    input.style.background = "white";
    input.setAttribute("type","text");
    input.setAttribute("value",td.textContent);
    td.innerHTML = "";
    td.appendChild(input);
    input.focus();
};
/*
 * _cancelInput
 */
EdiTable.prototype._cancelInput = function(td){
    var input = document.createElement("input");
    var text = this._currentTd.item.value;
    var textNode = document.createTextNode(text);
    var parent = this._currentTd.item.parentNode;
    parent.innerHTML = "";
    parent.style.paddingBottom = this._currentTd.paddingBottom;
    parent.style.paddingLeft = this._currentTd.paddingLeft;
    parent.style.paddingRight = this._currentTd.paddingRight;
    parent.style.paddingTop = this._currentTd.paddingTop;
    parent.appendChild(textNode);
    this._currentTd = null;
};
/*
 * _addEventToTRAndTH
 */
EdiTable.prototype._addEventToTRAndTH = function(){
    var owner = this;
    var body = document.querySelector("body");
    
    body.addEventListener("click",function(e){
        var node = e.target.nodeName;  
        
        if(node === "TD" || node === "TH"){
            console.dir(e.target);
            owner._currentTd !== null ? owner._cancelInput():null;
            owner._setInput(e.target);
        }else if(node === "INPUT"){
            
        }else {
            owner._currentTd !== null ? owner._cancelInput():null;
        }
    });
    
    body.addEventListener("mouseover",function(e){
        var node = e.target.nodeName;  
        if(node === "TD" || e.target.id === "btns-row-edit"){
            if(node === "TD"){
                owner._selectedRow = e.target.parentNode.rowIndex;
                owner._btnRowPosition();
            }
            owner._colBtns.style.display = "none";
            owner._rowBtns.style.display = "block";
        }else if(node === "TH" || e.target.id === "btns-col-edit"){
            if(node === "TH"){
                owner._xPozCol = e.target.offsetLeft+(e.target.clientWidth/2);
                owner._selectedCol = e.target.cellIndex;
                owner._btnColPosition();
            }
            owner._rowBtns.style.display = "none";
            owner._colBtns.style.display = "block";
        }
    },false);
    body.addEventListener("mouseout",function(e){
        var node = e.target.nodeName;
        if(node === "TD"){
            owner._rowBtns.style.display = "none";
        }else if(node === "TH"){
            owner._colBtns.style.display = "none";
        }
    },false); 
};
/*
 * _addBtns
 */
EdiTable.prototype._addBtns = function(){
    var blueprints = [
    {class: ["circle-up","button-add-row-up"], label: "",function: this._addRow},
    {class: ["circle-down","button-add-row-down"], label: "",function: this._addRow},
    {class: ["circle-delete-row","button-del-row"], label: "",function: this._delRow},
    {class: ["circle-left","button-add-col-left"], label: "",function: this._addCol},
    {class: ["circle-delete","button-del-col"], label: "",function: this._delCol},
    {class: ["circle-right","button-add-col-right"], label: "",function: this._addCol}
    ];
    this._drawButtons(blueprints);
    this._addEventToTRAndTH();
    this._addEventsToButtons();
};