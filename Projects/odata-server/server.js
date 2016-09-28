var configUtils = require('./lib/configUtils');
var odata = require('node-odata');
var logger = require('morgan');

console.log("Starting OData server");
console.log("Connecting to database: " + configUtils.getMongoConnectionString());

var server = odata(configUtils.getMongoConnectionString());
server.use(logger('dev'));

var booksModel = require("./resources/books");
server.resource('books', booksModel);

module.exports = server;
