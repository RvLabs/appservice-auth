var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/api/profiles', function(req, res, next) {
  fs.readFile('../profiles.json', (err, jsonData) => {
    if (err) {
      console.log("Error reading file: ", err)
      return
    }
    
    jsonProfiles = JSON.parse(jsonData);

    res.header("Access-Control-Allow-Origin", "*");
    res.send(jsonProfiles);

  })
});

module.exports = router;
