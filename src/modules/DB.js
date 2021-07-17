// Simple module for writing/reading data for the application

const electron = require('electron');

const {app} = electron;

var userdata;

//***********************************************//

exports.SetPath = function(path){
    console.log("setting DB path to: " + path);
    userdata  = path;
}

exports.GetPath = function(){
    return userdata;
}

exports.InsertID = function(id){
    console.log("TODO: DB.InsertID");

    return true;
}

exports.RemoveID = function(id){

}

exports.GetIDs = function() {

}