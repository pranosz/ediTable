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
    this._selectedRowIndex = null;
    this._selectedColIndex = null;
    this._selectedCol = null;
    this._ediType = null;
    this._currentTd = null;
    this._saveBtn = null;
    this._savedData = null;
    this._buttons = null;
    
    this._generateTable();
    this._table = document.getElementById("yourTable");
    this._createSaveButton();
    
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
 * 
 * _showSaveBtn
 */
EdiTable.prototype._showSaveBtn = function(){
  this._saveBtn.style.display = "block"; 
  this._btnSavePosition();
};
/*
 * 
 * _createSaveButton
 */
EdiTable.prototype._createSaveButton = function(){
    var saveCont = document.createElement("div");
    var insideBtn = document.createElement("div");
    var textNode = document.createTextNode("Save");
    var a = document.createElement("a");
    saveCont.classList.add("btn-save-container");
    insideBtn.classList.add("btn-save-wrapper");
    a.classList.add("btn-save");
    a.appendChild(textNode);
    insideBtn.appendChild(a);
    saveCont.appendChild(insideBtn);
    this._saveBtn = saveCont;
    this._table.parentNode.insertBefore(saveCont,null);
    this._btnSavePosition();
};
/*
 * 
 * _btnSavePosition
 */
EdiTable.prototype._btnSavePosition = function(){
    this._saveBtn.style.width = (this._table.clientWidth + this._table.offsetLeft)+"px";
    this._saveBtn.style.top = (this._table.clientHeight + this._table.offsetTop)+"px";
};
/*
 * _createTable
 */
EdiTable.prototype._createTable = function(){
    var table = document.createElement("table");
    table.setAttribute("id","yourTable");
    table.insertRow(0);
    this._data.tableData[0].td.forEach(function(col,i){
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
    var owner = this;
    if(side === "U"){
        index = owner._selectedRowIndex;
    }else if(side === "D"){
        index = owner._selectedRowIndex+1;
    }
    if(index !== null){
        newRow = owner._table.insertRow(index);
        colums = owner._table.rows[0].cells;
        Array.prototype.forEach.call(colums,function(col,i){
            newRow.insertCell(i).innerHTML = "Default";
        });                
    }
    owner._showSaveBtn();
};
/*
 * _delRow
 */
EdiTable.prototype._delRow = function(){
    if(this._selectedRowIndex>1){
        this._table.deleteRow(this._selectedRowIndex);
        this._isChange = true;
        this._showSaveBtn();
    }
};
/*
 * _addCol
 */
EdiTable.prototype._addCol = function(side){
    var index = null;
    var r = this._table.rows;
    if(side === "R"){
        index = this._selectedColIndex + 1;
    }else if(side === "L"){
        index = this._selectedColIndex;
    }
    Array.prototype.forEach.call(r,function(row,i){
        
        if(i===0){
            row.insertCell(index).outerHTML = "<th>Ddefault</th>";
        }else{
            row.insertCell(index).innerHTML = "Ddefault";
        }
    });
    this._showSaveBtn();
};
/*
 * _delCol
 */
EdiTable.prototype._delCol = function(){
    if(this._selectedColIndex>=1){
        var index = this._selectedColIndex;
        var r = this._table.rows;
        Array.prototype.forEach.call(r,function(row,i){
            row.deleteCell(index);
        });
        this._showSaveBtn();
    }
};

/*
 * _addEventsToButtons
 */
EdiTable.prototype._addEventsToButtons = function(){
    var owner = this;
    var body = document.querySelector("body");
    
    body.addEventListener("click",function(e){
        var classArr = e.target.className.split(" ");
        var node = e.target.nodeName;
        var nodeClass = null;
        var param = null;
        var btn = null;
        
        classArr.forEach(function(cl,i){
            if(cl.indexOf("btn") !== -1){
                nodeClass = cl;
            }else if(cl.indexOf("button") !== -1){
                btn = cl;
            }
        });
        if(node === "TD" || node === "TH"){
            owner._currentTd !== null ? owner._cancelInput():null;
            owner._setInput(e.target);
        }else if(node === "INPUT"){

        }else if(nodeClass === "btn-arrows" || nodeClass === "btn-context"){
            param = owner._buttons[btn].param;
            owner._buttons[btn].method.call(owner,param);
            owner._btnRowPosition();
            owner._btnColPosition(); 
        }else {
            owner._currentTd !== null ? owner._cancelInput():null;
        }
    },false);
    
    if(this._ediType === "buttons"){
    body.addEventListener("mouseover",function(e){
        var node = e.target.nodeName;  
        if(node === "TD" || e.target.id === "btns-row-edit"){
            if(node === "TD"){
                owner._selectedRowIndex = e.target.parentNode.rowIndex;
                owner._btnRowPosition();
            }
            owner._colBtns.style.display = "none";
            owner._rowBtns.style.display = "block";
        }else if(node === "TH" || e.target.id === "btns-col-edit"){
            if(node === "TH"){
                owner._selectedColIndex = e.target.cellIndex;
                owner._selectedCol = e.target;
                owner._btnColPosition();
            }
            owner._rowBtns.style.display = "none";
            owner._colBtns.style.display = "block";
        }
    },false);
    
    this._table.addEventListener("mouseout",function(e){
        var node = e.target.nodeName;
        if(node === "TD"){
            owner._rowBtns.style.display = "none";
        }else if(node === "TH"){
            owner._colBtns.style.display = "none";
        }
    },false);
    }
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
EdiTable.prototype._drawContextmenu = function(){
    var div = document.createElement("div");
    var ul = document.createElement("ul");
    var btns = this._buttons;
    
    div.classList.add("context");
    ul.classList.add("context-list");
    
    for(var prop in btns){
        var li = document.createElement("li");
        var b = document.createElement("button");
        var text = document.createTextNode(btns[prop].label);
        b.classList.add("btn-context");
        b.classList.add(prop);
        b.appendChild(text);
        li.appendChild(b);
        ul.appendChild(li);
    };
    div.appendChild(ul);
    this._table.parentNode.insertBefore(div,null);
    this._contextmenu = document.querySelector(".context");    
};
/*
 * 
 * @returns {undefined}
 */
EdiTable.prototype._disabledBtn = function(btnArr,isDisabled){
    var class1 = (isDisabled === true ? "btn-context" : "btn-disabled");
    var class2 = (isDisabled === true ? "btn-disabled" : "btn-context");
   // if(typeof btnArr === "Array"){
        btnArr.forEach(function(btn,i){
            btn.classList.remove(class1);
            btn.classList.add(class2);
            btn.disabled = isDisabled;
        });
   // }
};
/*
 * _addEventContextmenu
 */
EdiTable.prototype._addEventContextmenu = function(){  
    this._t = 1;
    var owner = this;
    
    this._table.addEventListener("contextmenu",function(e){
        var node = e.target.nodeName;
        var btnUp = document.querySelector(".button-add-row-up");
        var btnDel = document.querySelector(".button-del-row");
        var btns = [btnUp,btnDel];
        if(node === "TH" || node === "TD"){
            e.preventDefault();
            owner._setContextPosition(e);
            owner._selectedRowIndex = e.target.parentNode.rowIndex;
            owner._selectedColIndex = e.target.cellIndex;
            if(node === "TH"){
                owner._disabledBtn(btns,true);
            }else if(node === "TD"){
                owner._disabledBtn(btns,false);
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
    this._buttons = {
        "button-add-row-up": {label: "Add row above", method: this._addRow, param:"U"},
        "button-add-row-down": {label: "Add row below", method: this._addRow, param:"D"},
        "button-del-row": {label: "Delete row", method: this._delRow, param:"DEL"},
        "button-add-col-right": {label: "Add column to right", method: this._addCol, param:"R"},
        "button-add-col-left": {label: "Add column to left", method: this._addCol, param:"L"},
        "button-del-col": {label: "Delete column", method: this._delCol, param:"DEL"}
    };
    this._drawContextmenu();
    this._addEventContextmenu(); 
};
/*
 * 
 * ----------------------------Buttons------------------------
 */
EdiTable.prototype._drawButtons = function(){
    var btns = this._buttons;
    var btnsRowBox = document.createElement("div");
    var btnsColBox = document.createElement("div");
    btnsRowBox.setAttribute("id","btns-row-edit");
    btnsColBox.setAttribute("id","btns-col-edit");
    
    for(var prop in btns){
        var circle = document.createElement("div");
        var button = document.createElement("button");
        var rowORcol = prop.split("-");
        circle.classList.add(btns[prop].class[0]);
        button.classList.add("btn-arrows");
        button.classList.add(prop);
        circle.appendChild(button);
        if(rowORcol[2] === "row"){
            btnsRowBox.appendChild(circle);  
        }else {
            btnsColBox.appendChild(circle);
        }
    };
    
    this._table.parentNode.insertBefore(btnsRowBox,null);
    this._table.parentNode.insertBefore(btnsColBox,null);
    this._rowBtns = document.querySelector("#btns-row-edit");
    this._colBtns = document.querySelector("#btns-col-edit");
};
/*
 * 
 * @returns {undefined}
 */
EdiTable.prototype._setRowIndex = function(){
    var row = this._table.rows[Number(this._selectedRowIndex)];
    if(typeof row === "undefined"){
        this._selectedRowIndex = (this._selectedRowIndex > 1 ? this._selectedRowIndex-1:1);    
    }
};
/*
 * 
 * @returns {undefined}
 */
EdiTable.prototype._setColIndex = function(){
    var col = this._table.rows[0].cells[this._selectedColIndex];
    if(typeof col === "undefined"){
        this._selectedColIndex = (this._selectedColIndex >= 1 ? this._selectedColIndex-1:0); 
    }
};
/*
 * _btnRowPosition
 */
EdiTable.prototype._btnRowPosition = function(){
    if(this._ediType === "buttons"){
        var currentRow, offsetTop;
        var leftMarginStr = window.getComputedStyle(this._table).marginLeft;
        var leftMargin = Number(leftMarginStr.slice(0,leftMarginStr.length-2));
        this._setRowIndex();
        currentRow = this._table.rows[Number(this._selectedRowIndex)];
        offsetTop = currentRow.offsetTop+leftMargin;
        this._rowBtns.style.top = offsetTop+"px";
        this._rowBtns.style.left = (this._table.rows[0].clientWidth)+"px";
    }
};
/*
 * _btnColPosition
 */
EdiTable.prototype._btnColPosition = function(){
    if(this._ediType === "buttons"){
        var currentCol, xPozCol;
        this._setColIndex();
        currentCol = this._table.rows[0].cells[this._selectedColIndex];
        xPozCol = currentCol.offsetLeft+(currentCol.clientWidth/2);
        this._colBtns.style.top = "0px";
        this._colBtns.style.left = xPozCol+"px";
    }
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
    this._showSaveBtn();
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
 * _addBtns
 */
EdiTable.prototype._addBtns = function(){
    this._buttons = {
        "button-add-row-up": {class: ["circle-up"], label: "",method: this._addRow, param:"U"},
        "button-add-row-down": {class: ["circle-down"], label: "",method: this._addRow, param:"D"},
        "button-del-row": {class: ["circle-delete-row"], label: "",method: this._delRow, param:"DEL"},
        "button-add-col-left": {class: ["circle-left"], label: "",method: this._addCol, param:"L"},
        "button-del-col": {class: ["circle-delete"], label: "",method: this._delCol, param:"DEL"},
        "button-add-col-right": {class: ["circle-right"], label: "",method: this._addCol, param:"R"}
    };
    this._drawButtons();
    //this._addEventToTRAndTH();
    this._addEventsToButtons();
};
/*
 * 
 * @returns {undefined}
 */
EdiTable.prototype._getDataFromTable = function(){
    var tdArr = [];
    var td = [];
    Array.prototype.forEach.call(this._table.rows, function(row){
        Array.prototype.forEach.call(row.cells, function(col){
                td.push(col.outerText);
        });
        tdArr.push(td);
        td = [];
    });
    return tdArr;  
};
/*
 * 
 * @returns {undefined}
 */
EdiTable.prototype._createColObj = function(th,td){
    var obj = {"th":null,"td":null};
    obj.th = th;
    obj.td = td;
    return obj;
};
/*
 * 
 * @returns {undefined}
 */
EdiTable.prototype._createColArr = function(arr){
    var colArray = [];
    arr[0].forEach(function(col,i){
            colArray.push([]);
    });
    return colArray;
};
/*
 * 
 * @returns {undefined}
 */
EdiTable.prototype._saveToObj = function(colArr){
    var owner = this;
    var th = null;
    var td = [];
    var obj = {tableData:[]};
    colArr.forEach(function(col,i){
            th = col[0];
            td = col.slice(1,col.length);
            obj.tableData.push(owner._createColObj(th,td));
    });
    return obj;
};
/*
 * 
 * getSavedData
 */
EdiTable.prototype.getSavedData = function(){
    this._saveTable();
    return this._savedData;
};
/**
 * _saveTable
 */
EdiTable.prototype._saveTable = function(){
    var tableData = this._getDataFromTable();
    var arrLength = tableData.length;
    var colNum = tableData[0].length;
    var data = null;
    var dataObj = null;
    var dataJson = null;
    var colArr = this._createColArr(tableData);
    for (var i = 0; i < arrLength; i++) {
        for (var j = 0; j < colNum; j++) {
            data = (typeof(tableData[i][j]) !== "undefined"?tableData[i][j]:"");
            colArr[j].push(data);
        }
    } 
    dataObj = this._saveToObj(colArr);
    this._savedData = JSON.stringify(dataObj);
};
/*
 * 
 */
EdiTable.prototype.onSaveBtn = function(callback){
    if(typeof callback === "function"){
        var listener = document.querySelector(".btn-save").addEventListener("click",function(e){
        var node = e.target.classList.item(0);
            if(node === "btn-save"){
                callback();
            }
        },false); 
        return listener;
    }
};