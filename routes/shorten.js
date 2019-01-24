'use strict';
var Url = require('../models/Urls');


var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 7);
};

function shorten (longUrl, userAgentData, callback) {
    Url.findOne({longUrl: longUrl}, {longUrl: 1, urlId: 1}, function (err, url) {
        if (err) {
            return callback(err);
        }

        if (url) {
            return callback(null, url.urlId);
        }

        let urlId = ID();

        url = new Url();
        url.longUrl = longUrl;
        url.urlId = urlId;

        console.log('longUrl: ' + longUrl);
        console.log('urlId: ' + urlId);

        url.createdBy = {
            remoteAddress: userAgentData.remoteAddress,
            userAgent: userAgentData.userAgent
        };

        url.save(function (err) {
            if (err) {
                console.log('err:');
                console.log(err);
            }
            console.log('saved. ' + urlId +", " + longUrl);
            return callback(err, url.urlId);
        })
    });
}


module.exports = {shorten};