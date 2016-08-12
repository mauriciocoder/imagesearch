const mongo = require("mongodb").MongoClient;
const https = require("https");
var dbUrl = process.env.IMAGE_APP_DB_URL;
const apiUrl = "https://www.googleapis.com/customsearch/v1?key="+ process.env.IMAGE_API_KEY +"&searchType=image";
module.exports = {
    find: function find(query, offset, callback) {
        var startIndex = getStartIndex(offset);
        var loadedApiUrl = apiUrl + "&q=" + query + "&start=" + startIndex;
        console.log("loadedApiUrl = " + loadedApiUrl);
        https.get(loadedApiUrl, handleApiResponse.bind(null, callback));
    },
    
    insertLog: function insertLog(query, callback) {
        mongo.connect(dbUrl, function(err, db) {
            if (err) {
                return callback(err);
            }
            var log = {term: query, when: new Date()};
            var logColl = db.collection("log");
            logColl.insert(log, function(err, data) {
                if (err) {
                    return callback(err);
                }
                console.log("logged: " + JSON.stringify(data));
                db.close;
                return callback(null);
            });
        });
    },
    
    findLog: function findLog(callback) {
        mongo.connect(dbUrl, function(err, db) {
            if (err) {
                return callback(err);
            }
            var logColl = db.collection("log");
            logColl.find().sort({_id:-1}).limit(10).toArray(function(err, documents) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, documents);
                db.close;   // Refactor. Find better place to close it!!
            });
        });
    }
}

function getStartIndex(offset) {
    offset = parseInt(offset);
    if (offset <= 1) {
        return 1;
    }
    return (offset - 1) * 10;
}

function handleApiResponse(callback, response) {
    var buffer = "";
    var data = "";
    response.on("data", function (chunk) {
        buffer += chunk;
    });
    response.on("end", function() {
        data = JSON.parse(buffer);
        var arr = data.items;
        var results = loadResults(arr);
        return callback(null, results);
    });
    response.on("error", function(err) {
        return callback(err, null);
    });
}

function loadResults(arr) {
    var results = [];
    arr.forEach(function(item) {
        var url = item.link;
        var alt = item.title;
        var pageUrl = item.image.contextLink;
        var result = {"url":url, "alt":alt,"pageurl":pageUrl};
        results.push(result);
    });
    return results;
}