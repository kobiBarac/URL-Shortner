'use strict';
var Url = require('../models/Urls');


function redirect (urlId, agentData, callback) {
    Url.findOne({urlId: urlId},function (err, url) {
        if (err) {
            return callback(err)
        } else if (!url) {
            return callback(null, {isFound: false})
        }
        callback(err, {isFound: true, longUrl: url.longUrl });

        var log = {
            timestamp: new Date(),
            remoteAddress: agentData.remoteAddress,
            userAgent: agentData.userAgent
        };
        console.log(log);
        url.logs.push(log);
        url.markModified('logs');
        url.save(function (err) {
            if (err) {
                console.log ('error saving log:')
                console.log (err)
            }

            console.log('log saved')

        })
    })




}


module.exports = {redirect};