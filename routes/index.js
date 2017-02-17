var express = require('express');
var ip = require('ip');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IoT Demo Server' , server_url: ip.address() + ":3001"});
});

module.exports = router;
