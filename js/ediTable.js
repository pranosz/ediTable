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
    var _tId = tableId;
    var config = this._setConfig(tableSet);
    
    console.log("config: "+JSON.stringify(config));

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