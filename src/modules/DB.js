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
    const filePath = userdata + '/user_ids.txt';

    fs.appendFile(filePath, String(id) + ',', function(err) {
        if (err) throw err;
    });

    return true;
}

exports.RemoveID = function(id){
    const filePath = userdata + '/user_ids.txt';

    if (!fs.existsSync(filePath))
        return false;

    const ids = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'});
    const new_ids = ids.replace(String(id) + ',', "");
    fs.writeFileSync(filePath, new_ids, (err) => {
        if (err) throw err;
    });

    return true;
}

exports.HasID = function(id) {
    const filePath = userdata + '/user_ids.txt';

    if (!fs.existsSync(filePath))
        return false;
    
    const ids = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'});
    const result = ids.match(String(id)) != null;
    return result;
}

exports.GetIDs = function() {
    const filePath = userdata + '/user_ids.txt';

    if (!fs.existsSync(filePath))
        return [];
    
    const ids = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'});

    if (ids.length == 0)
        return [];
    
    const result = ids.split(',');
    result.pop(); // Because it's going to be #,#,#,#, with trailing comma
    return result;
}