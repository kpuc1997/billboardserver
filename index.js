const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const router = express.Router();
var fs = require('fs');
var getChart = require("billboard-top-100").getChart;

const endDate = '1962-01-01';

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
    return lastUpdate
}


checkUpdate(getLastUpdate())

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var getDates = function(startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 7);
    }
    dates.push(new Date())
    return dates;
  };

function checkUpdate(inputString) {
    // Check whether or not the chart data needs to be updated. Returns true if 
    // it does not need to be update. Returns true if the data needs to be
    // updated.

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    today = new Date()
    lastUpdate = new Date(inputString)
    lastUpdate = lastUpdate.addDays(7)
 
    if(today.getTime() > lastUpdate.getTime()) {
        return true
    }
    else {
        return false
    }
}

function getChartData(lastUpdate) {
    // Retrieves and formats chart data between two dates. Returns formated data.
        // List of objects, each with rank, title, and artist
        var today = new Date()
        var data = []; // List where the data from the billboard api will be stored
        // Gets a list of all days between two dates
        var dates = getDates(lastUpdate, today); 
     
        // For each date, get chart data from the billboard api
        dates.forEach(function(date) {
    
                // billboard api call. Uses a callback to handle the data.
                // 'billboard-200' is the chart to check
                // date.toISOString()slice(0, 10) is the date to check the chart.
                // the third argument is the callback function.
                data.push(new Promise(function(resolve, reject) {
                    getChart('billboard-200', date.toISOString().slice(0, 10), function(err, chart) {
                    
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
                    });
                }));            
        }
    )
        return data
    }


    // getChartData(new Date('2019-02-21'), new Date('2019-03-19')).forEach(function(promise){
    //     promise.then( function(result) {
    //         console.log(result[0])
    //     }
    //     )
    // })


storeChartData(new Date('2019-03-19'))

var arrayUnique = function (arr) {
	return arr.filter(function(item, index){
		return arr.indexOf(item) >= index;
	});
};

function storeChartData(lastUpdate) {
    // For each week between lastUpdate and today:
    // Opens the data store file and reads the list of charted artists
    // adds any artists from the week in question which aren't in the database
    // updates the highest rank of that artist if the new chart has a higher rank
    
    // Ensure file exhists
    try {
        var contents = fs.readFileSync('chartData.json', 'utf8');
        var jsonData = JSON.parse(contents);
        console.log('chartData.json found')

    } catch(err) {
        fs.writeFileSync('chartData.json', '[]')
        var contents = fs.readFileSync('chartData.json', 'utf8');
        var jsonData = JSON.parse(contents);
        console.log('chartData.json not found. Writing file...')
    }


    var toAppend = [];

    getChartData(lastUpdate, new Date()).forEach(function(promise){

        chartPromise = new Promise(function(resolve, reject) {

            promise.then( function(songs) {

                placeholder = [];

                songs.forEach(function(song) {

                    if(jsonData.length === 0) {

                        placeholder.push(song)

                    }
                    else {

                        jsonData.forEach(function(chartEntry) {
    
                            if(chartEntry.artist === song.artist) {
                                if(chartEntry.rank <= song.rank) {
                                    return
                                }
                                else {
                                    jsonData[jsonData.indexOf(chartEntry)] = song
                                }
                            }
                            else {
                                placeholder.push(song)
                            }
    
                        })

                    }

                    
    
                })
                resolve(placeholder)

            }
            )


        });

        toAppend.push(chartPromise);
        
    })

  


    toAppend.forEach(function(promise) {

        promise.then( function(result) {

            content = fs.readFileSync('chartData.json', 'utf8')
            backData = JSON.parse(content)

            result.forEach(function(song) {


                if(backData.includes(song)) {
                    console.log('returning')
                    return

                };

                if(!backData.includes(song)) {
                    console.log('pushing')
                    backData.push(song)
                    
                };

            })
            

            var toWrite = JSON.stringify(backData)
            fs.writeFileSync('chartData.json', toWrite)

        })
    })




}

app.get('/', (req, res) => res.sendFile('public/index.html', {root: __dirname }))



app.use(express.static('public'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))