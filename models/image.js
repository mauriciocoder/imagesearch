const https = require("https");
const apiUrl = "https://www.googleapis.com/customsearch/v1?key="+ process.env.IMAGE_API_KEY +"&searchType=image";
module.exports = {
    find: function find(query, offset, callback) {
        var startIndex = getStartIndex(offset);
        var loadedApiUrl = apiUrl + "&q=" + query + "&start=" + startIndex;
        console.log("loadedApiUrl = " + loadedApiUrl);
        https.get(loadedApiUrl, handleApiResponse.bind(null, callback));
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
    response.on("end", function () {
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