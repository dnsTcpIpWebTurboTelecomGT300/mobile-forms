var configUtils = require('./lib/configUtils');
var config = require('./lib/config')
var odata = require('./node-odata');
var logger = require('morgan');
var _bodyParser = require('./node_modules/node-odata/node_modules/body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}



console.log("Starting OData server");
console.log("Connecting to database: " + configUtils.getMongoConnectionString());

var server = odata.default(configUtils.getMongoConnectionString());
server.set("prefix", config.get("apiPrefix"));
server.use(logger('dev'));

server.resource('users', require("./models/usersModel"));
server.resource('quizes', require("./models/quizesModel"));
server.resource('questions', require("./models/questionsModel"));
server.resource('answers', require("./models/usersAnswersModel"))

module.exports = server;
