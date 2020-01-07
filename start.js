// start.js

require("babel-register")({
  presets: ["env"]
});

module.exports = require("./server.js");