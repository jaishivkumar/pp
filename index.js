const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const route = require('./route/route');

const app = express();

app.use(bodyParser.json());


mongoose.connect("mongodb+srv://shivkumar:I81Q7TvA9ObKHdC3@cluster0.ub8d9.mongodb.net/interview")
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})