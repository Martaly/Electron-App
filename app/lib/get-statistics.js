const readingTime = require("reading-time");
const countLines = require ("counts-lines");

module.exports = (text) => {
    return Object.assign(readingTime(text),{ lines:countLines(text)});
}