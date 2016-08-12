const express = require("express");
const router = express.Router();
const imageModel = require("../models/image");
// Search latest queries
router.get("/latest", handleLogSearch);
function handleLogSearch(req, resp, next) {
    imageModel.findLog(function(err, result) {
        if (err) {
            next(err);
        } else {
            resp.json(result);
        }
    });
}
// Search image
router.get("/:QUERY", handleImageSearch);
function handleImageSearch(req, resp, next) {
    var query = req.params.QUERY;
    var offset = req.query.offset ? req.query.offset : "1";
    imageModel.insertLog(query, function(err) {
        if (err) {
            next(err);
        }
    });
    imageModel.find(query, offset, function(err, result) {
        if (err) {
            next(err);
        } else {
            resp.json(result);
        }
    });
}
module.exports = router;