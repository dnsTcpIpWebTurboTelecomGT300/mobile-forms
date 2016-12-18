var configUtils = require('./lib/configUtils');
var config = require('./lib/config')
var odata = require('./node-odata');
var logger = require('morgan');

console.log("Starting OData server");
console.log("Connecting to database: " + configUtils.getMongoConnectionString());

var server = odata(configUtils.getMongoConnectionString());
server.set("prefix", config.get("apiPrefix"));
server.use(logger('dev'));

server.resource('users', require("./models/usersModel"));
server.resource('quizes', require("./models/quizesModel"));
server.resource('questions', require("./models/questionsModel"));
server.resource('answers', require("./models/usersAnswersModel"))

module.exports = server;
