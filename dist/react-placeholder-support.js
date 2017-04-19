'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactPlaceholderSupport = function ReactPlaceholderSupport(elementName) {
  var _class, _temp, _initialiseProps;

  var isPlaceholderSupported = typeof document !== 'undefined' && 'placeholder' in document.createElement('input');

  return _temp = _class = function (_Component) {
    _inherits(PlaceholderSupport, _Component);

    function PlaceholderSupport(props) {
      _classCallCheck(this, PlaceholderSupport);

      var _this = _possibleConstructorReturn(this, (PlaceholderSupport.__proto__ || Object.getPrototypeOf(PlaceholderSupport)).call(this, props));

      _initialiseProps.call(_this);

      _this.needsPlaceholding = props.placeholder && !isPlaceholderSupported;
      return _this;
    }

    // keep track of focus


    _createClass(PlaceholderSupport, [{
      key: 'render',
      value: function render() {
        var value = void 0;
        var newProps = void 0;

        if (this.needsPlaceholding) {
          value = this.props.value;

          this.isPlaceholding = !value;

          newProps = _extends({}, this.props, {
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onChange: this.onChange,
            onSelect: this.onSelect
          });

          if (!value) {
            newProps.value = newProps.placeholder;
            newProps.type = 'text';
            newProps.className = newProps.className + ' placeholder';
          }
        }

        var element = _react2.default.createElement(elementName, newProps || this.props, this.props.children);

        this.elementNode = element;
        return element;
      }
    }]);

    return PlaceholderSupport;
  }(_react.Component), _class.displayName = elementName.replace(/^(.)/, function (c) {
    return c.toUpperCase();
  }), _class.defaultProps = {
    className: ''
  }, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.componentWillReceiveProps = function (props) {
      _this2.needsPlaceholding = props.placeholder && !isPlaceholderSupported;
    };

    this.componentDidUpdate = function () {
      _this2.setSelectionIfNeeded(_this2.elementNode);
    };

    this.onFocus = function (e) {
      _this2.hasFocus = true;
      _this2.setSelectionIfNeeded(e.target);

      if (_this2.props.onFocus) {
        return _this2.props.onFocus(e);
      }
    };

    this.onBlur = function (e) {
      _this2.hasFocus = false;

      if (_this2.props.onBlur) {
        return _this2.props.onBlur(e);
      }
    };

    this.setSelectionIfNeeded = function (node) {
      // if placeholder is visible, ensure cursor is at start of input
      if (_this2.needsPlaceholding && _this2.hasFocus && _this2.isPlaceholding && (node.selectionStart !== 0 || node.selectionEnd !== 0) && node.setSelectionRange) {
        node.setSelectionRange(0, 0);

        return true;
      }

      return false;
    };

    this.onChange = function (e) {
      var onChange = _this2.props.onChange;

      if (_this2.isPlaceholding) {
        // remove placeholder when text is added
        var value = e.target.value;
        var index = value.indexOf(_this2.props.placeholder);

        if (index !== -1) {
          e.target.value = value.slice(0, index);
        }
      }

      if (onChange) {
        return onChange(e);
      }
    };

    this.onSelect = function (e) {
      if (_this2.isPlaceholding) {
        _this2.setSelectionIfNeeded(e.target);

        return false;
      } else if (_this2.props.onSelect) {
        return _this2.props.onSelect(e);
      }
    };
  }, _temp;
};

exports.default = ReactPlaceholderSupport;