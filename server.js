const express = require('express');
const cors = require('cors');
//const convert = require('xml-js');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
//const bcryptjs = require('bcryptjs');
mongoose.connect("mongodb://localhost:27017/3100project");
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
    console.log("Connected to MongoDB");
    
});

app.get('/api/test', (req, res) => {
    console.log("test");
    res.send("test");
})

const server = app.listen(3001);