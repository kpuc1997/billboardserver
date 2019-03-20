const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const router = express.Router();
var fs = require('fs');
var listCharts = require('billboard-top-100').listCharts;
var getChart = require("billboard-top-100").getChart;

var endDate = '1961-01-01';
try {
    var lastUpdate = fs.readFileSync('lastUpdate.txt', 'utf-8');
}
catch(err) {
    var lastUpdate = endDate;
    // ADD HERE. Write in code that creates the lastUpdate.txt file with '1961-01-01'
    // written in.
}
checkUpdate(lastUpdate)

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
      currentDate = addDays.call(currentDate, 1);
    }
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

function test(err, chart) {
    return new Promise(function(resolve, reject) {
        chartdata = [];
        for(song of chart.songs) {
            chartdata.push(
                {   rank: song.rank, 
                    title: song.title, 
                    artist: song.artist}
            )};  
        resolve(chartdata)
    })
}

function getChartData(lastUpdate, today) {
    // Retrieves and formats chart data between two dates. Returns formated data.
    // List of objects, each with rank, title, and artist

    var data = [];
    var dates = getDates(lastUpdate, today);
 
    dates.forEach( async function(date) {
            getChart('billboard-200', date.toISOString().slice(0, 10), function(err, chart) {
               
                // There is an issue with callback timing here. Try to alleviate that 
                // to get data to return properly.
                for(song of chart.songs) {
                    data.push(
                        {   rank: song.rank, 
                            title: song.title, 
                            artist: song.artist}
                    )};  
                });
            
            // getChart('billboard-200', date.toISOString().slice(0, 10), function(err, chart) {

            // })
            // promise.then(function(result) {
            //     data.push(result)
            // })
    

        }
    )
}


console.log(getChartData(new Date('2019-03-01'), new Date('2019-03-01')))


// getChart('hot-100', '2019-03-07', function(err, chart) {
//     if (err) console.log(err);
//     console.log(chart.week) // prints the week of the chart in the date format YYYY-MM-DD
//     console.log(chart.previousWeek.url) // prints the URL of the previous week's chart
//     console.log(chart.previousWeek.date) // prints the date of the previous week's chart in the date format YYYY-MM-DD
//     console.log(chart.nextWeek.url) // prints the URL of the next week's chart
//     console.log(chart.nextWeek.date) // prints the date of the next week's chart in the date format YYYY-MM-DD
//     console.log(chart.songs[3]); // prints song with rank: 4 for week of August 27, 2016
//     console.log(chart.songs[0].title); // prints title of top song for week of August 27, 2016
//     console.log(chart.songs[0].artist); // prints artist of top songs for week of August 27, 2016
//     console.log(chart.songs[0].rank) // prints rank of top song (1) for week of August 27, 2016
//     console.log(chart.songs[0].cover) // prints URL for Billboard cover image of top song for week of August 27, 2016
// });

// getChart('billboard-200', '2019-03-19', function(err, chart) {
//     if (err) console.log(err);
//     for(x of chart.songs) {
//         console.log(x.rank)
//         console.log(x.title)
//         console.log(x.artist)
//         console.log('')
//     };
// })

app.get('/', (req, res) => res.sendFile('public/index.html', {root: __dirname }))



app.use(express.static('public'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))