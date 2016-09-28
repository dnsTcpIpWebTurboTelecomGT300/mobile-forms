var config = require('./config');

module.exports = {
    getMongoConnectionString: function () {
        var str = "mongodb://";

        var username = config.get("mongo:username");
        var password = config.get("mongo:password");
        if (username && password) {
            str += username + ":" + password + "@";
        }

        str += config.get("mongo:host");
        if (config.get("mongo:port")) {
            str += ":" + config.get("mongo:port");
        }

        str += "/" + config.get("mongo:base");

        return str;
    }
}