const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const router = express.Router();




app.get('/', (req, res) => res.sendFile('public/index.html', {root: __dirname }))



app.use(express.static('public'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))