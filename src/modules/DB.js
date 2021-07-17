// Simple module for writing/reading data for the application

const electron = require('electron');
const fs = require('fs');
const path = require('path');

var userdata;

//***********************************************//

exports.SetPath = function(dir){
    console.log("setting DB path to: " + dir);

    // Attempt to first-time setup our data

    fs.mkdir(dir + '/my_data', function(err){
        if (err) {
            console.log(err);
        } else {
            console.log('successfully created a directory: ' + dir + '/my_data');
        }
    })

    userdata = path.join(dir, '/my_data');
}

exports.GetPath = function(){
    return userdata;
}

exports.InsertID = function(id){
    fs.appendFile(path.join(userdata + '/user_ids.txt'), String(id) + ',', function(err) {
        if (err) throw err;
        console.log("Inserted an ID!");
    });

    console.log("id inserted!");

    return true;
}

exports.RemoveID = function(id){

}

exports.GetIDs = function() {

}