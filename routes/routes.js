var express = require('express');
var router = express.Router();
var shorten = require('./shorten').shorten;
var redirect = require('./redirect').redirect;


function getUserAgentData(req) {
    var remoteAddress = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(",")[0];

    var userAgent = req.headers['user-agent'];
    var userAgentData = {
        remoteAddress: remoteAddress,
        userAgent: userAgent
    };

    return userAgentData
}
router.get('/', function(req, res, next) {
  res.render('index', { title: 'This is working!' });
});
router.get('/favicon.ico', function(req, res, next) {
  return res.status(204).send();
});

function prepateResult(longUrl, urlId, hostUrl) {

    var results = {};
    var shortUrl = 'http://' + hostUrl + "/" + urlId;
    results[longUrl] = {shortUrl: shortUrl, urlId: urlId, userHash: urlId, shortCNAMEUrl: shortUrl};
    return results;
}

router.get('/shorten', function(req, res, next) {
  var longUrl = req.query.longUrl;
  var apiKey = req.query.apiKey;

  var userAgentData = getUserAgentData(req);

  shorten(longUrl, userAgentData, function (err, urlId) {
    if (err) {
      return res.status(500).send({err: err});
    }

      var results = prepateResult(longUrl,urlId,req.headers.host);
      return res.status(200).send({results: results});
  });
});

router.post('/shorten', function(req, res, next) {
    var longUrl = req.body.longUrl || req.query.longUrl;
    var apiKey = req.query.apiKey;

    var userAgentData = getUserAgentData(req);

    shorten(longUrl, userAgentData, function (err, urlId) {
        if (err) {
            return res.status(500).send({err: err});
        }

        var results = prepateResult(longUrl,urlId,req.headers.host);
        return res.status(200).send({results: results});
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

  var userAgentData = getUserAgentData(req);

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
