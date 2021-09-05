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