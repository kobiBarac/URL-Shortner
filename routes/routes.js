var express = require('express');
var router = express.Router();
var shorten = require('./shorten').shorten;
var redirect = require('./redirect').redirect;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/favicon.ico', function(req, res, next) {
  return res.status(204).send();
});

router.get('/shorten', function(req, res, next) {
  var longUrl = req.query.longUrl;
  var apiKey = req.query.apiKey;

  shorten(longUrl, function (err, urlId) {
    if (err) {
      return res.status(500).send({err: err});
    }

    var fullUrl = req.headers.host + "/" + urlId
    return res.status(200).send({urlId: urlId, fullUrl: fullUrl});
  });
});


router.get('/:urlId', function(req, res, next) {
  var urlId = req.params.urlId;
  if (!urlId) {
    var html = "<h4>No UrlId</h4><br/>"
    html += "Use " + req.headers.host + "/shorten?longUrl=https://www.google.com<br/>"
    html += "save the returned urlId<br/>";
    html += "Then call the short address " + req.headers.host + "/<urlId><br/>"
    return res.status(200).send("No urlId.");
  }

  var remoteAddress = (req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress).split(",")[0];

  var userAgent = req.headers['user-agent'];
  var userAgentData = {
    remoteAddress: remoteAddress,
    userAgent: userAgent
  };
  redirect(urlId, userAgentData, function (err, result) {
    if (err) {
      return res.status(500).send({err: err});
    }

    if (!result.isFound) {
      return res.status(404).send("Page not found");
    }

    return res.redirect(result.longUrl)
  });
});

module.exports = router;
