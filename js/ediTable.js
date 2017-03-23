/**
 * EdiTable
 * 
 * EdiTable is a component which adds to the standard html table sorting functionality 
 * and enables the edit mode. Edit mode allows you to add or delete rows or columns. 
 * You can edit content in each cell in the table, you can also set which column 
 * should have (or not) a sorting functionality. After finishing editing, you should 
 * press "Save" button, if you want to save changes. After that you can get table 
 * data in JSON format using "savedData" method.  You can choose one of two ways 
 * of working in edit mode ("buttons" or "context"). If you choose "buttons" your 
 * edit mode gets buttons for each row and column when you roll over headers. 
 * But if you choose "context" your edit mode will work when you right click on rows 
 * or columns (headers).
 * 
 * @param {string} editType / buttons or contextmenu
 * @param {json} data / data table 
 * @returns {EdiTable}
 * @author Piotr Ranosz
 */
"use strict";
function EdiTable(data,editType){
    this._body = document.querySelector("body");
    this._data = data;
    this._contextmenu = null;
    this._headers = null;
    this.rowBtns = null;
    this.colBtns = null;
    this._selectedRowIndex = null;
    this._selectedColIndex = null;
    this._selectedCol = null;
    this.ediType = editType;
    this._currentTd = null;
    this.saveBtn = null;
    this._savedData = null;
    this._buttons = null;
    this._sortMemory = null;
    this._table = null;
    this._rowsNum = null;
    this._cellsNum = null;
    this._sortEditBoxPozX = null;
    this._sortEditBoxPozY = null;
    this._rows = null;
    this._rowsArr = [];
    this.onClickBtnEdit = this.onClickBtnEdit.bind(this);
    this.onMouseOverBtnEdit = this.onMouseOverBtnEdit.bind(this);
    this.onMouseOutBtnEdit = this.onMouseOutBtnEdit.bind(this);
    this.onSortBtn = this.onSortBtn.bind(this);
    this.launchTable();
};
/*
 * launchTable / Method contains group of methods that must be launched to run the table.
 * @returns {undefined}
 */
EdiTable.prototype.launchTable = function(){
    this.generateTable();
    this.hideSaveBtn();
    this.cancelInput();
    this.displayBtnRowCol("none","none");
    this.removeEventsOfBtnsEdit();
    this.addSortingBtns();    
};
/**
 * addSortingBtns / This method adds sorting to the table headers.
 * @returns {undefined}
 */
EdiTable.prototype.addSortingBtns = function(){
    var owner = this;
    Array.prototype.forEach.call(owner._headers,function(col,i){ 
        var textNode = document.createTextNode(owner._data.tableData[i].th);
        if(owner._data.tableData[i].sort === true){
            var sDiv = document.createElement("div");
            var a = document.createElement("a");
            col.innerText = "";
            a.setAttribute("href","#");
            a.appendChild(textNode);
            col.appendChild(a);
            col.appendChild(sDiv);
            sDiv.classList.add("sort-arrow");
            a.classList.add("btn-sort");
            if(owner._data.tableData[i].type === "string"){
                a.classList.add("sort-text");
            }else if(owner._data.tableData[i].type === "number"){
                a.classList.add("sort-number");
            }
        }else if(col.innerText === ""){
            col.appendChild(textNode);
        }
    });
    this._table.addEventListener("click", this.onSortBtn, false);
};
/**
 * removeSortingBtn / Removes sorting from table header.
 * @returns {undefined}
 */
EdiTable.prototype.removeSortingBtn = function(){
    var sortBtns = this._table.getElementsByClassName("btn-sort");
    if(sortBtns.length > 0){
        while(sortBtns.length){
            if(sortBtns[0]){
                sortBtns[0].parentNode.innerHTML = sortBtns[0].innerText;
            }
        }
    }
    this._table.removeEventListener("click", this.onSortBtn, false);
};
/**
 * editMode / Switches to edit mode.
 * @param {bolean} t / If "true" the edit mode is activated, in other case not.
 * @returns {undefined}
 */
EdiTable.prototype.editMode = function(t){
    var mode = (typeof(t) === "undefined" ? false : t);
    if(mode === true){
        this.removeSortingBtn();
        this.setEditType(); // contextmenu or buttons
        this.addSortEditBtn();
        this.showSaveBtn();
    }else {
        this.launchTable();
    }
};
/**
 * setEditType
 * @returns {undefined}
 */
EdiTable.prototype.setEditType = function(){
    if(this.ediType === "contextmenu"){
        this.addContextmenu();
    }else if(this.ediType === "buttons"){
        this.addBtns();
    }else {
        //none
    }
};
/**
 * displayBtnRowCol / Method shows or hides buttons for adding or deleting rows and columns.  
 * @param {string} row / "none" or "block"
 * @param {string} col / "none" or "block"
 * @returns {undefined}
 */
EdiTable.prototype.displayBtnRowCol = function(row,col){
    if(this.rowBtns !== null){
        this.rowBtns.style.display = row;           
    }
    if(this.colBtns  !== null){
        this.colBtns.style.display = col;
    }
};
/**
 * showSaveBtn
 * @returns {undefined}
 */
EdiTable.prototype.showSaveBtn = function(){
  this.saveBtn.style.display = "block"; 
  this.btnSavePosition();
};
/**
 * hideSaveBtn
 * @returns {undefined}
 */
EdiTable.prototype.hideSaveBtn = function(){
  this.saveBtn.style.display = "none"; 
};
/**
 * createBtnWrapper / Method first creates container (if doesn't exist)
 *                    for a button and then creates button wrapper.
 * @param {string} containerName
 * @param {string} wrapperName
 * @returns {undefined}
 */
EdiTable.prototype.createBtnWrapper = function(containerName, wrapperName){
    var container = document.getElementsByClassName(containerName)[0];
    if(!container){
        var saveCont = document.createElement("div");
        var insideBtn = document.createElement("div");
        saveCont.classList.add(containerName);
        insideBtn.classList.add(wrapperName);  
        saveCont.appendChild(insideBtn);
        this._table.parentNode.insertBefore(saveCont,null);
        this.saveBtn = saveCont;
    }
};
/**
 * createButton 
 * @param {string} text / button text.
 * @param {string} className / button class.
 * @param {string} btnWrapper / button wrapper name.
 * @returns {undefined}
 */
EdiTable.prototype.createButton = function(text,className,btnWrapper){
    var insideBtn = document.getElementsByClassName(btnWrapper)[0];
    var textNode = document.createTextNode(text);
    var a = document.createElement("a");
    a.classList.add(className);
    a.appendChild(textNode);
    if(insideBtn){
        insideBtn.appendChild(a);
    }
    this.btnSavePosition();
};
/**
 * btnSavePosition / Taking into account the width and hight of the table, 
 *                   method calculates position of the "save" button.
 * @returns {undefined}
 */
EdiTable.prototype.btnSavePosition = function(){
    this.saveBtn.style.width = (this._table.clientWidth + this._table.offsetLeft)+"px";
    this.saveBtn.style.top = (this._table.clientHeight + this._table.offsetTop)+"px";
};
/**
 * removeTable / Remove table (if exists) and "save" button.
 * @returns {undefined}
 */
EdiTable.prototype.removeTable = function(){ 
    var btnSave = null;
    if(this._table){
        btnSave = document.getElementsByClassName("btn-save")[0];
        this._table.parentNode.removeChild(this._table);
        btnSave.parentNode.removeChild(btnSave);
    };
};
/**
 * createTable / Creates an empty table.
 * @returns {EdiTable.prototype.createTable.table|Element}
 */
EdiTable.prototype.createTable = function(){  
    this.removeTable();
    var table = document.createElement("table");
    table.setAttribute("id","yourTable");
    table.insertRow(0);
    this._data.tableData[0].td.forEach(function(col,i){
        table.insertRow(i);
    });
    this._body.insertBefore(table,this._body.firstChild);
    return table;
};
/**
 * generateTable / Fills a table with data from JSON object (this._table).
 * @returns {undefined}
 */
EdiTable.prototype.generateTable = function(){
    var table = this.createTable();
    this._table = document.getElementById("yourTable");
    this._data.tableData.forEach(function(col,i){
        var th = document.createElement("th");
        table.rows[0].appendChild(th);
        col.td.forEach(function(cell,j){
            table.rows[j+1].insertCell(i).innerHTML = cell;
        });
    });
    this.setTableProperties();
    this.createBtnWrapper("btn-save-container","btn-save-wrapper");
    this.createButton("Save","btn-save","btn-save-wrapper");
};

/**
 * addRow
 * @param {string} tier / Under or above.
 * @returns {undefined}
 */
EdiTable.prototype.addRow = function(tier){
    var newRow = null;
    var index = null;
    var colums = null;
    var owner = this;
    if(tier === "A"){
        index = owner._selectedRowIndex;
    }else if(tier === "U"){
        index = owner._selectedRowIndex+1;
    }
    if(index !== null){
        newRow = owner._table.insertRow(index);
        colums = owner._table.rows[0].cells;
        Array.prototype.forEach.call(colums,function(i){
            newRow.insertCell(i).innerHTML = "Default";
        });  
        this.btnSavePosition();
    }
};
/**
 * delRow
 * @returns {undefined}
 */
EdiTable.prototype.delRow = function(){
    if(this._rowsNum>2){ // Because I don't want to remove all rows.
        this._table.deleteRow(this._selectedRowIndex);
        this._isChange = true;
        this._rowsNum = this._table.rows.length;
        this.btnSavePosition();
    }
};
/**
 * addCol
 * @param {string} side / Left or right.
 * @returns {undefined}
 */
EdiTable.prototype.addCol = function(side){
    var owner = this;    
    var index = null;
    var r = this._table.rows;
    if(side === "R"){
        index = this._selectedColIndex + 1;
    }else if(side === "L"){
        index = this._selectedColIndex;
    }
    Array.prototype.forEach.call(r,function(row,i){   
        if(i===0){
            var newCol = row.insertCell(index);
            newCol.outerHTML = "<th>Default<div class='edit-sort' style='left:"+owner._sortEditBoxPozX+";bottom:"+owner._sortEditBoxPozY+"'><label for='isSorting'>Sorting<input type='checkbox' name='isSorting' value='false'></label></div></th>";                  
        }else{
            row.insertCell(index).innerHTML = "text";
        }
    });
    this.btnSavePosition();
};
/**
 * delCol
 * @returns {undefined}
 */
EdiTable.prototype.delCol = function(){
    if(this._cellsNum>1){ // Because I don't want remove all columns.
        var index = this._selectedColIndex;
        var r = this._table.rows;
        Array.prototype.forEach.call(r,function(row){
            row.deleteCell(index);
        });
        this._cellsNum = this._table.rows[0].cells.length;
        this.btnSavePosition();
    }
};
/**
 * isClassExists / Check if class exist in item.
 * @param {object} item / for example div element.
 * @param {string} cName
 * @returns {Boolean}
 */
EdiTable.prototype.isClassExists = function(item,cName){
    var classArr = item.className.split(" ");
    var find = false;
    classArr.forEach(function(cl){
        if(cl === cName){
            find = true;
        }
    });  
    return find;
};
/**
 * removeSortMarks / Removes arrow graphics located on the right side of header text.
 * @returns {undefined}
 */
EdiTable.prototype.removeSortMarks = function(){
    var sDivs = this._table.getElementsByClassName("sort-arrow");
    var owner = this;
    Array.prototype.forEach.call(sDivs,function(div){
        owner.isClassExists(div,"sort-arrow-down") ? div.classList.remove("sort-arrow-down") : null;
        owner.isClassExists(div,"sort-arrow-up") ? div.classList.remove("sort-arrow-up") : null;
    });  
};
/**
 * setSortMark / Adds arrows graphics located on the right side of header text.
 * @param {number} colIndex / Column index.
 * @param {number} order / Sort order.
 * @returns {undefined}
 */
EdiTable.prototype.setSortMark = function(colIndex, order){
    var sDiv = this._table.rows[0].cells[colIndex].getElementsByTagName("div")[0];
    var sortClass = null;
    this.removeSortMarks();
    switch(order) {
        case 1:
            sortClass = "sort-arrow-up";
        break;
        case -1:
            sortClass = "sort-arrow-down";
        break;
        case 0:
            sortClass = null;
        break;  
    }
    if(sortClass !== null){
        sDiv.classList.add(sortClass);
    }
};
/**
 * sortText / Method used to sort text in column.
 * @param {number} colIndex / Column index.
 * @param {number} order / Sort order.
 * @returns {undefined}
 */
EdiTable.prototype.sortText = function(colIndex,order){
    var owner = this;
    var tempArr = Array.prototype.slice.call(this._table.rows);
    tempArr.shift();
    this.setSortMark(colIndex, order);
    if(order !== 0){
        tempArr.sort(function(a,b){
            a = a.cells[colIndex].textContent;
            b = b.cells[colIndex].textContent;
            return a > b;
        });
        tempArr = (order === 1?tempArr:tempArr.reverse());
        tempArr.forEach(function(row){
            owner._table.appendChild(row);
        });
    }else {
        tempArr.forEach(function(row,i){
            owner._table.appendChild(owner._rowsArr[i]);
        });
    }
};
/**
 * sortNum / Method used to sort numbers in column.
 * @param {type} colIndex / Column index.
 * @param {type} order / Sort order.
 * @returns {undefined}
 */
EdiTable.prototype.sortNum = function(colIndex,order){
    var owner = this;
    var tempArr = Array.prototype.slice.call(this._table.rows);
    tempArr.shift();
    this.setSortMark(colIndex, order);
        if(order !== 0){
        tempArr.sort(function(a,b){
            a = Number(a.cells[colIndex].textContent);
            b = Number(b.cells[colIndex].textContent);
            return (a - b)*order;
        });
        tempArr.forEach(function(row){
            owner._table.appendChild(row);
        });
    }else {
        tempArr.forEach(function(row,i){
            owner._table.appendChild(owner._rowsArr[i]);
        });
    }
};
/**
 * addSortEditBtn / Adds the ability to set sorting for column in edit mode.
 * @returns {undefined}
 */
EdiTable.prototype.addSortEditBtn = function(){
    var owner = this;
    var headers = this._table.rows[0].cells;
    this._sortEditBoxPozX = "0px";
    this._sortEditBoxPozY = (headers[0].offsetHeight+1)+"px";
    
    Array.prototype.forEach.call(headers,function(col,i){
        var checked = "";
        var srtValue = false;
        var div = null;
        if(owner._data.tableData[i].sort){
            checked = "checked";
            srtValue = true;
        }
        if(col.getElementsByClassName("edit-sort").length === 0){
            div = document.createElement("div");
            div.classList.add("edit-sort");
            if(owner.ediType === "contextmenu") div.classList.add("edit-sort-hide");
            div.innerHTML = "<label for='isSorting'>Sorting<input type='checkbox' name='isSorting' value="+srtValue+" "+checked+"></label>";
            div.style.left = owner._sortEditBoxPozX;
            div.style.bottom = owner._sortEditBoxPozY;
            col.appendChild(div);            
        }
    });
};
/**
 * setOnOffSorting / Method used only in "contextmenu" option. Adds text on the 
 *                   right side of word "Sorting" in context menu.
 * @returns {undefined}
 */
EdiTable.prototype.setOnOffSorting = function(){
    var th = this._table.rows[0].cells[this._selectedColIndex];
    var contextMenu = document.getElementsByClassName("button-sorting")[0];
    var arrText = contextMenu.textContent.split(" ");
    var sortVal = th.querySelector('input[type=checkbox]').value;
    contextMenu.textContent = arrText[0]+" "+(sortVal === "true"?"OFF":"ON"); 
};
/**
 * updateSortEditValue / Method used only in "contextmenu" option. Updates sort 
 *                       values after clicking on the sort button in context menu.
 * @returns {undefined}
 */
EdiTable.prototype.updateSortEditValue = function(){
    var th = this._table.rows[0].cells[this._selectedColIndex];
    var input = th.querySelector('input[type=checkbox]');
    var inputValue = input.value;
    input.value = (inputValue === "true" ? "false" : "true");
    this.setOnOffSorting();
};
/**
 * updateSortEditBtnValue / Method used only in "buttons" option. Updates sort 
 *                          values after clicking in checkbox.
 * @returns {undefined}
 */
EdiTable.prototype.updateSortEditBtnValue = function(){
   this._table.addEventListener("change",function(e){
       if(e.target.type === "checkbox"){
           e.target.value = e.target.checked;
       }
   });
};
/**
 * onClickBtnEdit / This method calls the action when the event occurs on:
 *                  - table cells (th,td);
 *                  - edit buttons (add,remove rows and columns) in "buttons" option;
 *                  - edit buttons (add,remove rows and columns + rows sorting) in "contextmenu" option;
 * @param {object} e / event
 * @returns {undefined}
 */
EdiTable.prototype.onClickBtnEdit = function(e){
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
        this.cancelInput();
        this.setInput(e.target);
        if(node === "TH"){    
        }
    }else if(nodeClass === "btn-arrows" || nodeClass === "btn-context"){
        param = this._buttons[btn].param;
        this._buttons[btn].method.call(this,param);
        this.btnRowPosition();
        this.btnColPosition(); 
    }else if(node === "INPUT"){
    }else {
        this.cancelInput();
    }
};
/**
 * onMouseOverBtnEdit / This method is responsible for showing a group of buttons 
 *                      (add left, add right, delete) when the user hovers over 
 *                      the table row or column header.
 * @param {object} e / event
 * @returns {undefined}
 */    
EdiTable.prototype.onMouseOverBtnEdit = function(e){
    var node = e.target.nodeName; 
    if(node === "TD" || e.target.id === "btns-row-edit"){
        if(node === "TD"){
            this._selectedRowIndex = e.target.parentNode.rowIndex;
            this.btnRowPosition();
        }
        this.displayBtnRowCol("block","none");
    }else if(node === "TH" || e.target.id === "btns-col-edit"){
        if(node === "TH"){
            this._selectedColIndex = e.target.cellIndex;
            this._selectedCol = e.target;
            this.btnColPosition();
        }
        this.displayBtnRowCol("none","block");
    }
};
/**
 * onMouseOutBtnEdit / This method is responsible for hiding a group of buttons.
 * @param {object} e / event
 * @returns {undefined}
 */    
EdiTable.prototype.onMouseOutBtnEdit = function(e){
    var node = e.target.nodeName;
    if(node === "TD"){
        this.displayBtnRowCol("none",null);
    }else if(node === "TH"){
        this.displayBtnRowCol(null,"none");
    }
};
/**
 * onSortBtn / This method is called after clicked on sort button.
 * @param {object} e / event
 * @returns {undefined}
 */
EdiTable.prototype.onSortBtn = function(e){
    var classArr = e.target.className.split(" ");
    var node = e.target.nodeName;
    var sortSteps = [1,-1,0];
    var sort = null;
    var colIndex = null;
    var th = null;
    var order = null;
    if(node === "A"){
       th = e.target.parentNode; 
       colIndex = th.cellIndex;
       classArr.forEach(function(cl){
            if(cl.indexOf("sort-") !== -1){
                sort = cl;
            }
        }); 
        if(this._sortMemory === th.cellIndex){
            if(typeof(th.counter)==="undefined") th.counter = 0;
            th.counter = (th.counter >= 2 ? 0 : th.counter + 1);
        }else {
            th.counter = 0;
        }
        this._sortMemory = th.cellIndex;
        
        order = sortSteps[th.counter];
    }
    if(sort === "sort-text"){
        this.sortText(colIndex,order);
    }else if(sort === "sort-number"){
        this.sortNum(colIndex,order);
    }
};
/**
 * addEventsToBtnsEdit
 * @returns {undefined}
 */
EdiTable.prototype.addEventsToBtnsEdit = function(){
    this._body.addEventListener("click", this.onClickBtnEdit, false);
    if(this.ediType === "buttons"){
        this._body.addEventListener("mouseover", this.onMouseOverBtnEdit, false); 
        this._table.addEventListener("mouseout", this.onMouseOutBtnEdit, false);
    }
};
/**
 * removeEventsOfBtnsEdit
 * @returns {undefined}
 */
EdiTable.prototype.removeEventsOfBtnsEdit = function(){
    this._body.removeEventListener("click", this.onClickBtnEdit);
    this._body.removeEventListener("mouseover", this.onMouseOverBtnEdit);
    this._table.removeEventListener("mouseout", this.onMouseOutBtnEdit);
};
/**
 * showContexmenu
 * @returns {undefined}
 */
EdiTable.prototype.showContexmenu = function(){ 
    if(this._t){
        this._t = 0;
        this._contextmenu.style.display = "block";
    }else {
        this._t = 1;
        this._contextmenu.style.display = "none";
    }
};
/**
 * drawContextmenu / This method creates context menu in html.
 * @returns {undefined}
 */
EdiTable.prototype.drawContextmenu = function(){
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
/**
 * disabledBtn / Disabled or enabled buttons in context menu.
 * @param {array} btnArr
 * @param {boolean} isDisabled
 * @returns {undefined}
 */
EdiTable.prototype.disabledBtn = function(btnArr,isDisabled){
    var class1 = (isDisabled === true ? "btn-context" : "btn-disabled");
    var class2 = (isDisabled === true ? "btn-disabled" : "btn-context");
    btnArr.forEach(function(btn){
        btn.classList.remove(class1);
        btn.classList.add(class2);
        btn.disabled = isDisabled;
    });
};
/**
 * addEventContextmenu / Adding event to context menu. 
 * @returns {undefined}
 */
EdiTable.prototype.addEventContextmenu = function(){  
    this._t = 1;
    var owner = this;
    this._table.addEventListener("contextmenu",function(e){
        var node = e.target.nodeName;
        var btnUp = document.querySelector(".button-add-row-up");
        var btnDel = document.querySelector(".button-del-row");
        var sort = document.querySelector(".button-sorting");
        var btns = [btnUp,btnDel];
        var sortBtn = [sort];
        if(node === "TH" || node === "TD"){
            e.preventDefault();
            owner.setContextPosition(e);
            owner._selectedRowIndex = e.target.parentNode.rowIndex;
            owner._selectedColIndex = e.target.cellIndex;
            if(node === "TH"){
                owner.disabledBtn(btns,true);
                owner.disabledBtn(sortBtn,false);
            }else if(node === "TD"){
                owner.disabledBtn(btns,false);
                owner.disabledBtn(sortBtn,true);
            }
            owner.setOnOffSorting();
            owner.showContexmenu();
        }
    },false);
    
    window.addEventListener("click",function(){ 
        owner._t === 0 ? owner.showContexmenu():null;
    },false);
    
    window.onresize = function(){
        owner._t = 1;
        owner._contextmenu.style.display = "none";
    };  
    this.addEventsToBtnsEdit();
};
/**
 * setContextPosition / Sets context menu position in the place where user right click.
 * @param {object} eventObj
 * @returns {undefined}
 */
EdiTable.prototype.setContextPosition = function(eventObj){
    this._contextmenu.style.position = "absolute";
    this._contextmenu.style.left = eventObj.clientX+"px";
    this._contextmenu.style.top = eventObj.clientY+"px";
};
/**
 * addContextmenu / Creates context menu using "this._buttons" configuration.
 * @returns {undefined}
 */
EdiTable.prototype.addContextmenu = function(){ 
    this._buttons = {
        "button-sorting": {label: "Sorting OFF", method: this.updateSortEditValue},
        "button-add-row-up": {label: "Add row above", method: this.addRow, param:"A"},
        "button-add-row-down": {label: "Add row below", method: this.addRow, param:"U"},
        "button-del-row": {label: "Delete row", method: this.delRow, param:"DEL"},
        "button-add-col-right": {label: "Add column to right", method: this.addCol, param:"R"},
        "button-add-col-left": {label: "Add column to left", method: this.addCol, param:"L"},
        "button-del-col": {label: "Delete column", method: this.delCol, param:"DEL"}
    };
    this.drawContextmenu();
    this.addEventContextmenu(); 
};
/**
 * drawButtons / This method creates groups of buttons in html for "buttons" option. 
 * @returns {undefined}
 */
EdiTable.prototype.drawButtons = function(){
    if(this.rowBtns && this.colBtns) return;
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
    this.rowBtns = document.querySelector("#btns-row-edit");
    this.colBtns = document.querySelector("#btns-col-edit");
};
/**
 * setRowIndex / This method works only in "buttons" option. Indicades selected 
 *               row excluding row with headers. It's used to find correct 
 *               position for groups of buttons.
 * @returns {undefined}
 */
EdiTable.prototype.setRowIndex = function(){
    var row = this._table.rows[Number(this._selectedRowIndex)];
    if(typeof row === "undefined"){
        this._selectedRowIndex = (this._selectedRowIndex > 1 ? this._selectedRowIndex-1:1);    
    }
};
/**
 * setColIndex / This method works only in "buttons" option. Indicades selected  
 *               column (only when user places cursor over the table header). 
 *               It's used to find correct position for groups of buttons.
 * @returns {undefined}
 */
EdiTable.prototype.setColIndex = function(){
    var col = this._table.rows[0].cells[this._selectedColIndex];
    if(typeof col === "undefined"){
        this._selectedColIndex = (this._selectedColIndex >= 1 ? this._selectedColIndex-1:0); 
    }
};
/**
 * btnRowPosition / This method works only in "buttons" option. 
 *                  Calculates button's group position for row. 
 * @returns {undefined}
 */
EdiTable.prototype.btnRowPosition = function(){
    if(this.ediType === "buttons"){
        var currentRow, offsetTop;
        var leftMarginStr = window.getComputedStyle(this._table).marginLeft;
        //var leftMargin = Number(leftMarginStr.slice(0,leftMarginStr.length-2));
        this.setRowIndex();
        currentRow = this._table.rows[Number(this._selectedRowIndex)];
        offsetTop = this._table.offsetTop + currentRow.offsetTop;
        this.rowBtns.style.top = offsetTop+"px";
        this.rowBtns.style.left = (this._table.rows[0].clientWidth)+"px";
    }
};
/**
 * btnColPosition / This method works only in "buttons" option. 
 *                  Calculates button's group position for column.  
 * @returns {undefined}
 */
EdiTable.prototype.btnColPosition = function(){
    if(this.ediType === "buttons"){
        var currentCol, xPozCol, yPozCol;
        this.setColIndex();
        currentCol = this._table.rows[0].cells[this._selectedColIndex];
        var paddingLeftText = window.getComputedStyle(currentCol, null).getPropertyValue('padding-left');
        var paddingLeft = Number(paddingLeftText.slice(0,-2));
        xPozCol = (currentCol.offsetLeft-paddingLeft)+(currentCol.clientWidth/2);
        yPozCol = this._table.offsetTop - 18;
        this.colBtns.style.top = yPozCol+"px";
        this.colBtns.style.left = xPozCol+"px";
    }
};
/**
 * setInput / Turns the table cell into an input field. I save information about 
 *            selected table cell in "this._currentTd" to reproduce it later.
 * @param {object} td / selected table cell.
 * @returns {undefined}
 */
EdiTable.prototype.setInput = function(td){
    var input = document.createElement("input");
    var sDiv = td.getElementsByClassName("edit-sort")[0];
    var inputData = null;
    if(sDiv){
        sDiv.classList.add("edit-sort-show");
    }
    this._currentTd = {
        item:input, 
        sDiv:sDiv,
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
    inputData = td.innerText;  
    if(typeof(td.childNodes[0]) !== "undefined"){
        input.setAttribute("value",td.childNodes[0].data);
        td.childNodes[0].data = "";
    }else {
        input.setAttribute("value",td.innerText);
    }
    td.appendChild(input);
    input.focus();
};
/**
 * cancelInput / Turns the input field back into table cell.
 * @returns {undefined}
 */
EdiTable.prototype.cancelInput = function(){
    if(this._currentTd === null) return;
    var input = this._currentTd.item;
    var text = this._currentTd.item.value;
    var parent = this._currentTd.item.parentNode;
    var textNode = null;
    if(this._currentTd.sDiv){
        this._currentTd.sDiv.classList.remove("edit-sort-show");
    }
    if(typeof(parent.childNodes[0].data)==="undefined"){
        textNode = document.createTextNode(" ");
        parent.insertBefore(textNode,input);
    }
    parent.childNodes[0].data = text;
    parent.style.paddingBottom = this._currentTd.paddingBottom;
    parent.style.paddingLeft = this._currentTd.paddingLeft;
    parent.style.paddingRight = this._currentTd.paddingRight;
    parent.style.paddingTop = this._currentTd.paddingTop;
    parent.removeChild(input);
    this._currentTd = null;
};
/**
 * addBtns / Creates groups of buttons using "this._buttons" configuration.
 * @returns {undefined}
 */
EdiTable.prototype.addBtns = function(){
    this._buttons = {
        "button-add-row-up": {class: ["circle-up"], label: "",method: this.addRow, param:"A"},
        "button-add-row-down": {class: ["circle-down"], label: "",method: this.addRow, param:"U"},
        "button-del-row": {class: ["circle-delete-row"], label: "",method: this.delRow, param:"DEL"},
        "button-add-col-left": {class: ["circle-left"], label: "",method: this.addCol, param:"L"},
        "button-del-col": {class: ["circle-delete"], label: "",method: this.delCol, param:"DEL"},
        "button-add-col-right": {class: ["circle-right"], label: "",method: this.addCol, param:"R"}
    };
    this.drawButtons();
    this.addEventsToBtnsEdit();
    this.updateSortEditBtnValue();
};
/**
 * setTableProperties
 * @returns {undefined}
 */
EdiTable.prototype.setTableProperties = function(){
    var headers = this._table.getElementsByTagName("th");
    this._headers = Array.prototype.slice.call(headers);
    this._rowsNum = this._table.rows.length;
    this._cellsNum = this._table.rows[0].cells.length;
    this._rows = this._table.rows;
    this._rowsArr = Array.prototype.slice.call(this._rows);
    this._rowsArr.shift();
};
/**
 * getDataFromTable / Method returns an array (tdArr) which represents table data. 
 *                    The tdArr contains group of arrays. Those arrays represent 
 *                    each row. The structure of the first table - In first place 
 *                    we have the table header name then the information whether 
 *                    the given column has a sort functionality. The structure 
 *                    of the rest arrays - In first place we have the table cell 
 *                    content then the information about the type of table cell 
 *                    content (string or number).             
 * @returns {Array|EdiTable.prototype.getDataFromTable.tdArr}
 */
EdiTable.prototype.getDataFromTable = function(){
    var tdArr = [];
    var td = [];
    var type = null;
    var sortVal = false;
    this.setTableProperties();
    Array.prototype.forEach.call(this._table.rows, function(row){
        Array.prototype.forEach.call(row.cells, function(col){
            if(col.nodeName === "TH"){
                sortVal = col.querySelector('input[type=checkbox]').value;
                if(col.querySelector('input[type=text]')){
                    td.push(col.querySelector('input[type=text]').value);
                }else {
                    td.push(col.innerText);
                }
                td.push(sortVal);
            }else {
                td.push(col.innerText);
                type = (isNaN(col.innerText)?"string":"number");
                td.push(type);
            }
        });
        tdArr.push(td);
        td = [];
    });
    return tdArr;  
};
/**
 * createColObj / Method creates object which will represent each column.
 * @param {string} th
 * @param {object} td
 * @param {string} type
 * @param {boolean} sort
 * @returns {EdiTable.prototype.createColObj.obj}
 */
EdiTable.prototype.createColObj = function(th,td,type,sort){
    var obj = {"th":null,"td":null,"type":null,"sort":false};
    obj.th = th;
    obj.td = td;
    obj.type = type;
    obj.sort = sort;
    return obj;
};
/**
 * createColArr / Method creates array which will represent each column. 
 *                Odd arrays contain the contents of a given column. 
 *                Even arrays contain sorting information.
 * @param {array} arr
 * @returns {Array|EdiTable.prototype.createColArr.colArray}
 */
EdiTable.prototype.createColArr = function(arr){
    var colArray = [];
    arr[0].forEach(function(){
            colArray.push([]);
    });
    return colArray;
};

/**
 * checkTypeInArray / Method checks what type of data we have in column.
 * @param {array} arr / Even array returned from createColArr method.
 * @param {array} types / Types to check - ["string","number"]
 * @returns {Boolean|type}
 */
EdiTable.prototype.checkTypeInArray = function(arr,types){
    var result;
    for(var i = 0; i<types.length;i++){
        result = types[i];
        for(var j = 0; j<arr.length;j++){
            if(arr[j] !== types[i]){result = false;};        	
        }
        if(result !== false){break;}
    }
    return result;
};
/**
 * saveToObj / Method gets data form array and saves it in object.
 * @returns {undefined}
 */
EdiTable.prototype.saveToObj = function(colArr){
    var owner = this;
    var th = null;
    var td = [];
    var type = null;
    var sort = false;
    var obj = {tableData:[]};
    colArr.forEach(function(col,i){
        if(i%2 === 0){
            th = col[0];
            td = col.slice(1,col.length);
        }else {
            type = owner.checkTypeInArray(col.slice(1,col.length),["string","number"]);
            sort = (col[0] === "true"); 
        }
        if(i%2 === 1){
            obj.tableData.push(owner.createColObj(th,td,type,sort));
            th = null;
            td = [];
            type = null;
            sort = false;
        }
    });
    return obj;
};
/**
 * savedData / The method used to return the final version of the saved data.
 * @returns {String}
 */
EdiTable.prototype.savedData = function(){
    this.saveTable();
    return this._savedData;
};
/**
 * saveTable / Saves row to column and convert to JSON format.
 * @returns {undefined}
 */
EdiTable.prototype.saveTable = function(){
    var tableData = this.getDataFromTable();
    var arrLength = tableData.length;
    var colNum = tableData[0].length;
    var data = null;
    var dataObj = null;
    var colArr = this.createColArr(tableData);
    for (var i = 0; i < arrLength; i++) {
        for (var j = 0; j < colNum; j++) {
            data = (typeof(tableData[i][j]) !== "undefined"?tableData[i][j]:"");
            colArr[j].push(data);
        }
    } 
    dataObj = this.saveToObj(colArr); 
    this._data = dataObj;
    this._savedData = JSON.stringify(dataObj,undefined,15);
    this.setTableProperties();
};
/**
 * onSaveBtn / Method that user can use to run callback function after pressing 
 *             "save" button.
 * @param {function} callback
 * @returns {EdiTable.prototype.onSaveBtn.obj}
 */
EdiTable.prototype.onSaveBtn = function(callback){
    if(typeof callback === "function"){
        var listener = document.addEventListener("click",function(e){
        var node = e.target.classList.item(0);
            if(node === "btn-save"){
                callback();
            }
        },false); 
        return listener;
    }
};