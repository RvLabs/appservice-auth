var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/api/test', function(req, res, next) {
  console.log('Headers: ' + JSON.stringify(req.headers));
  fs.readFile('../BackendNodejs/profiles.json', (err, jsonData) => {
    if (err) {
      console.log("Error reading file: ", err)
      return
    }
    
    jsonProfiles = JSON.parse(jsonData);

    res.send(jsonProfiles);

  })
});

module.exports = router;
