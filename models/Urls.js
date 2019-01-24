/**
 * Created by Tal on 19 Sep,2016.
 */
'use strict';

var mongoose = require('mongoose');

var urlsSchema = new mongoose.Schema({
    longUrl: {type: String, required: true, index: true},
    urlId: {type: String, required: true, index: true},
    urlExpiration: {type: Date, default: null},
    logs: [
        {
            timestamp: {type: Date},
            remoteAddress: {type: String},
            userAgent: {type: String},
        }
    ],

    createdAt: {type: Date, default: Date.now}
});


var urlsModel;

if (mongoose.models.Logs) {
    urlsModel = mongoose.model('Urls');
} else {
    urlsModel = mongoose.model('Urls', urlsSchema);
}

module.exports = urlsModel;