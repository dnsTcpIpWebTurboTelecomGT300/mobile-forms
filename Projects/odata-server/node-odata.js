'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('./node_modules/node-odata/node_modules/express');

var _express2 = _interopRequireDefault(_express);

var _server = require('./server-odata');

var _server2 = _interopRequireDefault(_server);

var _ODataResource = require('./node_modules/node-odata/lib/ODataResource');

var _ODataResource2 = _interopRequireDefault(_ODataResource);

var _ODataFunction = require('./node_modules/node-odata/lib/ODataFunction');

var _ODataFunction2 = _interopRequireDefault(_ODataFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = function server(db, prefix) {
  return new _server2.default(db, prefix);
};

server.Resource = function createResouce(name, model) {
  return new _ODataResource2.default(name, model);
};

server.Function = function createFunction() {
  return new _ODataFunction2.default();
};

server._express = _express2.default;

exports.default = server;