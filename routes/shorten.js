'use strict';
var Url = require('../models/Urls');


var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 7);
};

function shorten (longUrl, callback) {
    let urlId = ID();

    let url = new Url();
    url.longUrl = longUrl;
    url.urlId = urlId;

    console.log('longUrl: ' + longUrl);
    console.log('urlId: ' + urlId);

    url.save(function (err) {
        if (err) {
            console.log('err:');
            console.log(err);
        }
        console.log('saved. ' + urlId +", " + longUrl);
        return callback(err, url.urlId);
    })


}


module.exports = {shorten};