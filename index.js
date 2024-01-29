require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let mongoose;
try {mongoose = require("mongoose");}
catch (e) {console.log(e);}
const UrlModel = require("./myApp.js").UrlModel;


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // support json bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get("/is-mongoose-ok", function (req, res) {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState });
  } else {
    res.json({ isMongooseOk: false });
  }
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


const saveUrl = require("./myApp.js").saveUrl;
const isUrl = require("./myApp.js").isUrl;

app.post("/api/shorturl", async function(req,res){

    Body_URL = req.body["url"];
    console.log(Body_URL);
    if (!isUrl(Body_URL)){return res.json({error: 'invalid url'})}



     // Assuming saveUrl returns a promise
     const data = await saveUrl(Body_URL);
     console.log(data);
     return res.json({original_url: data["url"], short_url: parseInt(data["shortId"])});
});

const findUrlById = require("./myApp.js").findUrlById;
app.get("/api/shorturl/:shortId", async function(req,res){
  let shortId = parseInt(req.params.shortId);
  console.log(shortId)
  const data = await findUrlById(shortId);
  console.log(data);
  if(data.length == 0 ){
    return res.json({message:"Url not exist."})
  }
  return res.redirect(data[0]["url"]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
