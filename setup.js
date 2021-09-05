var fs = require('fs');

// Helper function to write files
// data: data to be written to file
// name: the name the file wwill have (exlcuding file type extension as this is prepended automatically)
// isJson: boolean flag for json files, otherwise assumed to be text files
function write_file(data, name, isJson) {
    const extension = isJson ? "json" : "txt"
    if (isJson) {
        data = JSON.stringify(data);
    }
    
    fs.writeFile(`${name}.${extension}`, data, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

const REWARD_CONFIG_TEMPLATE = {
    "standard" : {},
    "mystery" : [],
    "event" : {}
}

const CONFIG_TEMPLATE = {
    "isEvent" : false,
    "multiplier" : 1
}

// if reward config does not exist, wtire template to file
// if config does not exist, write template to file