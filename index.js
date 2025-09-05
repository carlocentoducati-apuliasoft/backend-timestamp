// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
const e = require('express');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

const dateMiddleware = (req, res, next) => {

  // date non specificata
  if (!req.params.date) {
    return res.json({ "unix": new Date().getTime(), "utc": new Date().toUTCString() });
  }

  const originalDate = req.params.date;
  let parsedDate;

  // parsare come timestamp Unix 
  if (/^\d+$/.test(originalDate)) {
    const timestamp = parseInt(originalDate);
    // (in millisecondi o secondi)
    parsedDate = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  }
  // parsare come stringa 
  else {
    parsedDate = Date.parse(originalDate);
  }

  // data non valida
  if (isNaN(parsedDate)) {
    return res.json({ "error": "Invalid Date" });
  }

  req.params.date = parsedDate;
  next();
}


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/:date?", dateMiddleware, function (req, res) {
  res.json({ "unix": new Date(req.params.date).getTime(), "utc": new Date(req.params.date).toUTCString() });
})



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
