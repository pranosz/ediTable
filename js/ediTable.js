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
    this._tId = tableId;
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
        console.log("_setEditType: context");
        this._addContextmenu();
    }else if(ediType === "buttons"){
        console.log("_setEditType: addBtns");
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
    
};
/*
 * _delRow
 */
EdiTable.prototype._delRow = function(){
    
};
/*
 * _addCol
 */
EdiTable.prototype._addCol = function(side){
    
};
/*
 * _delCol
 */
EdiTable.prototype._delCol = function(){
    
};
/*
 * _addContextmenu
 */
EdiTable.prototype._addContextmenu = function(){
    var target = this._tId,
        type = "contextmenu",
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