const fs = require('fs');

var content = fs.readFileSync('chartData.json', 'utf8');
var jsonData = JSON.parse(content);

var test = {"rank":1,"title":"Death Race For Love","artist":"Juice WRLD"}

function isEqualObject(obj1, obj2) {
    // Compares my objects
    if(obj1.rank == obj2.rank) {
        if(obj1.title == obj2.title) {
            if(obj1.artist == obj2.artist) {
                return true
            }
        }
    }
    return false
}


function isIn(obj1, somearray) {
    // Determines if object 1 is in array of objects.
    
    for(item of somearray) {
        if(isEqualObject(obj1, item)) {
            return true
        }
    }

    return false
}

console.log(isIn(test, jsonData))


