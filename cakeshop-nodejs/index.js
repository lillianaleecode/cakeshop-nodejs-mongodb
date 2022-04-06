const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send("hello lilly!");
});

app.listen(3001, () => {
    console.log("running on port 3001");

});

//run the file: node index.js