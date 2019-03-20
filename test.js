// ***************** Problem Statement ******************
// This function is supposed to format and return data from an api call.
// The api call uses a callback to handle the data and I can't get the 
// callback function to append data to a list in the parent function 
// properly. I think it has to do with asychronous callback timing but
// I can't seem to fix it. I've tried using promises and async/await but 
// I still can't get it. 
// ******************************************************


// Using billboard api to get billboard data. 
// Exhists as an npm package 'billboard-top-100'
var getChart = require("billboard-top-100").getChart;

// This function is a non-issue. This function is a dependecy of the below function.
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


function getChartData(lastUpdate, today) {
    // Retrieves and formats chart data between two dates. Returns formated data.
    // List of objects, each with rank, title, and artist

    var data = []; // List where the data from the billboard api will be stored

    // Gets a list of all days between two dates
    var dates = getDates(lastUpdate, today); 
 
    // For each date, get chart data from the billboard api
    dates.forEach(function(date) {

            // billboard api call. Uses a callback to handle the data.
            // 'billboard-200' is the chart to check
            // date.toISOString()slice(0, 10) is the date to check the chart.
            // the third argument is the callback function.
            getChart('billboard-200', date.toISOString().slice(0, 10), function(err, chart) {
                
                
                for(song of chart.songs) {
                    data.push(
                        {   rank: song.rank, 
                            title: song.title, 
                            artist: song.artist}
                    )};  
                });
            
    

        }
    )
    // setTimeout(function() {console.log(data)}, 5000);
    // Uncommenting the above line will log 'data' after 5 seconds. 
    // After waiting 5 seconds, data contains all information necessary.
    // Waiting 0 seconds returns an empty list.
    // In both cases the main function will return an empty list.
    return data
}

// Main goal is to get the above function to return a list of objects with 
// data from the billboard api. The following line tests this by attempting
// to get data from only one week and log it to console. 
// At present it will only log an empty list.
console.log(getChartData(new Date('2019-03-01'), new Date('2019-03-01')))




