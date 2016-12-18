'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var app = (0, _express2.default)();
  app.use(_bodyParser2.default.urlencoded({ extended: true, limit: '50mb' }));
  app.use(_bodyParser2.default.json({limit: '50mb'}));
  app.use((0, _methodOverride2.default)());
  app.use(_express2.default.query());
  app.use((0, _cors2.default)());
  app.disable('x-powered-by');
  return app;
};

var _express = require('./node_modules/node-odata/node_modules/express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('./node_modules/node-odata/node_modules/body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _methodOverride = require('./node_modules/node-odata/node_modules/method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _cors = require('./node_modules/node-odata/node_modules/cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
