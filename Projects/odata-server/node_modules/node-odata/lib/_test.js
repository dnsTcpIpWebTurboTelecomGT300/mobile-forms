'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _desc, _value, _class;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _ODataResource = require('./ODataResource');

var _ODataResource2 = _interopRequireDefault(_ODataResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var model = {
  title: String,
  price: Number
};

function checkUserAuth() {}
function router() {}
function queryable() {}

var Book = (_dec = queryable({ pageSize: 10, maxTop: 100 }), _dec2 = router['/50off'], (_class = function (_Resource) {
  _inherits(Book, _Resource);

  function Book() {
    _classCallCheck(this, Book);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Book).call(this, 'book', model));
  }

  _createClass(Book, [{
    key: 'onGetList',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(entities) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log(entities);

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function onGetList(_x) {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'onGet',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(entity) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // do something before
                console.log(entity);
                // dosomething after

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function onGet(_x2) {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'onCreate',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(entity) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.log(entity);

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function onCreate(_x3) {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'onRemove',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(entity) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                console.log(entity);

              case 1:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function onRemove(_x4) {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'onUpdate',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(entity) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                console.log(entity);

              case 1:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function onUpdate(_x5) {
        return ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'halfPriceAction',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(id) {
        var entity;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.findOneById(id);

              case 2:
                entity = _context6.sent;

                entity.price /= 2;
                _context6.next = 6;
                return entity.save();

              case 6:
                return _context6.abrupt('return', entity);

              case 7:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function halfPriceAction(_x6) {
        return ref.apply(this, arguments);
      };
    }()
  }]);

  return Book;
}(_ODataResource2.default), (_applyDecoratedDescriptor(_class.prototype, 'onGetList', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'onGetList'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onRemove', [checkUserAuth], Object.getOwnPropertyDescriptor(_class.prototype, 'onRemove'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onUpdate', [checkUserAuth], Object.getOwnPropertyDescriptor(_class.prototype, 'onUpdate'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'halfPriceAction', [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, 'halfPriceAction'), _class.prototype)), _class));
exports.default = Book;