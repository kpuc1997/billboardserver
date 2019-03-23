const fs = require('fs');
var getChart = require("billboard-top-100").getChart;



// chart = {rank: '20', title: 'Album', artist: 'Kyle'}

// data = [chart, {bull: 'shit'}, {bull: 'shit'}]

// song = {rank: '1', title: 'Album', artist: 'Kyle'}

// if(chart.artist == song.artist && chart.title == song.title && song.rank < chart.rank) {
//     data[data.indexOf(chart)] = song
// }

// console.log(data)

content = fs.readFileSync('chartData.json', 'utf8')
jsonData = JSON.parse(content)
testPass = true

for(var i = 0; i < jsonData.length; i = i +1) {
    counter = 0
    for(chart of jsonData) {
        if(chart.artist == jsonData[i].artist) {
            counter = counter + 1
            if(counter > 1) {
                console.log(chart.artist)
            }
        }
    }
    if(counter != 1) {
        testPass = false
    }
}

if(testPass) {
    console.log('Test passed')
}
else {
    console.error('Test failed')
}
