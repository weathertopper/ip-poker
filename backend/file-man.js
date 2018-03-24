'use strict';

const fs = require('fs');
const path = require('path');

module.exports.getFile = (file_name) => {
    const full_path = path.join(__dirname , file_name);
    if (fs.existsSync(full_path)){
        return fs.readFileSync(full_path);
    }
    return "";
}

module.exports.writeFile = (file_name, next_value) => {
    const full_path = path.join(__dirname , file_name);
    if (fs.existsSync(full_path)){
        let file_value = module.exports.getFile(file_name);
        file_value += (next_value + '\n');
        fs.writeFileSync(full_path, file_value);
    }
}

module.exports.clearFile = (file_name) => {
    console.log("clearing file");
    const full_path = path.join(__dirname , file_name);
    fs.writeFileSync(full_path, "")
   
}