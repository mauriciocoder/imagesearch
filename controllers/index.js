const express = require("express");
const router = express.Router();
// Image Controller
router.use("/image", require("./image"));
// Error handling
router.use(function(err, req, resp, next) {
  console.log("Error: " + err.message);
  resp.end(err.message);
});
module.exports = router;