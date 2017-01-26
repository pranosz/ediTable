/*
 * EdiTable
 * 
 * To do - describe component
 * 
 * @param:String {tableId} id attribute of table in which we want use "EdiTable" component
 * @param:Object {tableSet} a set of parameters that we want to send to "EdiTable" component
 */
"use strict";

function EdiTable(tableId, tableSet){
    this._table = tableId;
    this._contextmenu = null;
    var config = this._setConfig(tableSet);
    
    for(var opt in config){
        switch (opt){
            case "editType":
                this._setEditType(config[opt]);
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
EdiTable.prototype._setEditType = function(ediType){
    if(ediType === "context"){
        this._addContextmenu();
    }else if(ediType === "buttons"){
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
    console.log("_addRow "+side);
};
/*
 * _delRow
 */
EdiTable.prototype._delRow = function(){
    console.log("_delRow ");
};
/*
 * _addCol
 */
EdiTable.prototype._addCol = function(side){
    console.log("_addCol "+side);
};
/*
 * _delCol
 */
EdiTable.prototype._delCol = function(){
    console.log("_delCol ");
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
        b.classList.add("button");
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
    this._selectedRow = null;
    this._selectedCol = null;
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
                btnDis.classList.remove("button");
                btnDis.classList.add("button-disabled");
                btnDis.disabled = true;
            }else if(node === "TD"){
                btnDis.classList.remove("button-disabled");
                btnDis.classList.add("button");
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
 * _addBtns
 */
EdiTable.prototype._addBtns = function(){
    var target = this._tId,
        type = "click",
        useCapture = false,
        callback = [
        {btn: "addColBtn",function: this.addCol,params: ["L"]},
        {btn: "delColBtn",function: this.delCol},
        {btn: "addColBtn",function: this.addCol,params: ["R"]},
        {btn: "addRowBtn",function: this.addRow,params: ["U"]},
        {btn: "delRowBtn",function: this.delRow},
        {btn: "addRowBtn",function: this.addRow,params: ["D"]}
    ];
    
    Event.add(target,type,callback,useCapture); 
};