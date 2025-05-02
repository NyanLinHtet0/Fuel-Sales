const express = require('express')
const path = require('path');
const app = express()
const port = 3000

app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/index.html'))
  })
  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})