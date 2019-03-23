const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const router = express.Router();
const fs = require('fs');
const getChart = require("billboard-top-100").getChart;
const { performance } = require('perf_hooks');

const endDate = '1963-01-01';


//////////////////////////////////////////////////////////////////////////

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

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


var arrayUnique = function (arr) {
	return arr.filter(function(item, index){
		return arr.indexOf(item) >= index;
	});
};

Array.prototype.extend = function (other_array) {
    // if(typeof other_array != 'array') {
    //     console.error('FUCK, dont add a non-array to this array')
    // }
    other_array.forEach(function(v) {this.push(v)}, this);
}

function getDates(startDate, stopDate) {
    if(typeof startDate === 'object' && typeof stopDate === 'object') {
        var currentDate = startDate
        var dateArray = new Array();
        while (currentDate.getTime() <= stopDate.getTime()) {
            dateArray.push(currentDate);
            currentDate = currentDate.addDays(7);
        }
        dateArray.push(new Date())
        return dateArray;
    }
    else {
        console.error('input parameters must be Date objects!');
    };
}

//////////////////////////////////////////////////////////////////////////


function getLastUpdate() {
    try {
        var lastUpdate = fs.readFileSync('lastUpdate.txt', 'utf-8');
    }
    catch(err) {
        var lastUpdate = endDate;
        fs.writeFileSync('lastUpdate.txt', lastUpdate)
        // ADD HERE. Write in code that creates the lastUpdate.txt file with '1961-01-01'
        // written in.
    }
    return  new Date(lastUpdate)
}


function checkUpdate(inputDate) {
    // Check whether or not the chart data needs to be updated and updates it.
    if(typeof inputDate != 'object') {
        console.error('checkUpdate() input must be Date object!')
    }
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    today = new Date()
    lastUpdate = inputDate
    dateUpdate = lastUpdate.addDays(7)
 
    if(today.getTime() > dateUpdate.getTime()) {
        return true
    }
    else {
        console.log('No update necessary')
        return false
    }
}

function getNewChartPromise(date) {
    return new Promise(function(resolve, reject) {
        getChart('billboard-200', date.toISOString().slice(0, 10), function(err, chart) {
            try {
            if(typeof chart == 'undefined') {
                console.log('getChart returned undefined')
                reject('Error')

            }
            if(err) {
                console.log('getChart returned an error')
                reject('Error')
            }
            var temp = [];
            for(song of chart.songs) {

                if(song.rank === 1) {
                    continue
                }

                if(song.rank <= 41) {

                    temp.push(

                        {   rank: (song.rank - 1), 
                            title: song.title, 
                            artist: song.artist }

                        )

                }
                
                };
            resolve(temp);
            }
            catch(err) {
                console.log('getChart error caught')
                reject('Error')
            }
        });
    })
}

function getChartPromiseArray(dates) {
    // Takes an array of dates as a parameter
    // returns an array of chart promises
    data = [];
    for(date of dates) {
        data.push(getNewChartPromise(date))
    }
    return data
}

function getDateArray(lastUpdate, n) {
    // Takes in a date object and integer
    // returns an array of arrays. Each entry array contains n dates

    dates = getDates(lastUpdate, new Date())
    var counter = 1;
    temp = []
    array = []
    for(date of dates){
        if(counter % n === 0) {
            temp.push(date)
            array.push(temp)
            temp = []
        }
        if(counter == dates.length) {
            temp.push(date)
            array.push(temp)
        }
        else {
            temp.push(date)
        };
        counter++;
    }

    return array
}

async function storeChartData(lastUpdate) {

    // Weeks to get data from
    dateArray = getDateArray(lastUpdate, 230)

    // Current known chart data
    var t0 = performance.now();
    var t1;
    // Ensure file exhists
    try {
        var contents = fs.readFileSync('chartData.json', 'utf8');
        var jsonData = Object.values(JSON.parse(contents));
        console.log('chartData.json found')

    } catch(err) {
        fs.writeFileSync('chartData.json', '[]')
        var contents = fs.readFileSync('chartData.json', 'utf8');
        var jsonData = Object.values(JSON.parse(contents));
        console.log('chartData.json not found. Writing file...')
    }

    // Get an array of arrays. Each entry in the upper array will hold an array
    // of n dates representing weeks to get data

    // For each week, get the data and add it to jsonData. Monitor progress.
    var weekData;
    for(dates of dateArray) {
        console.log(dateArray.indexOf(dates).toString() + ' of ' + dateArray.length.toString())
        chartPromiseArray = getChartPromiseArray(dates)
    for(promise of chartPromiseArray) {
        weekData = await promise
        weekData.forEach(function(song) {
            if(jsonData.length == 0) {
                jsonData.push(song)
                return
                }
            for(item of jsonData) {
                if(item.artist == song.artist && item.rank <= song.rank) {
                    return
                }
                if(item.artist == song.artist && item.rank > song.rank) {
                    jsonData[jsonData.indexOf(item)] = song
                    return
                }
            }
            jsonData.push(song)
        })
    }
    }

    toWrite = JSON.stringify(jsonData);
    fs.writeFileSync('chartData.json', toWrite);
    t1 = performance.now()
    console.log('Done storing chart data')
    console.log(((t1-t0) / 1000).toString() + ' seconds')    


}

function checkChart(artist) {
    // returns true if artist has charted
    content = fs.readFileSync('chartData.json', 'utf8')
    jsonData = JSON.parse(content)

    for(item of jsonData) {
        if(item.artist.replace(/ /g, '').toLowerCase() == artist.replace(/ /g, '').toLowerCase()){
            return true
        }
    }
    return false
}

function makeChecks() {
    if(checkUpdate(getLastUpdate())) {
        storeChartData(getLastUpdate())
    }
}

// makeChecks()
storeChartData(getLastUpdate())

app.get('/', (req, res) => res.sendFile('public/index.html', {root: __dirname }))



app.use(express.static('public'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))