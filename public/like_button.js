var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var data;
var request = new XMLHttpRequest();
request.open('GET', 'http://chart.kyleclapper.com/chartArtist', false);
request.onload = function () {
  var content = Object.values(JSON.parse(this.response));
  data = content;
};
request.send();

function checkChart(artist) {
  if (typeof artist != 'string') {
    artist = artist.toString();
  }

  var exactList = [];
  var partList = [];
  if (artist.replace(/ /g, '') == '') {
    return [exactList, partList];
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      item = _step.value;

      if (item.artist.replace(/ /g, '').toLowerCase() == artist.replace(/ /g, '').toLowerCase()) {
        exactList.push(item);
      }
      if (item.artist.replace(/ /g, '').toLowerCase().includes(artist.replace(/ /g, '').toLowerCase())) {
        partList.push(item);
      }
      if (exactList.length + partList.length == 25) {
        return [exactList, partList];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return [exactList, partList];
}

var LikeButton = function (_React$Component) {
  _inherits(LikeButton, _React$Component);

  function LikeButton(props) {
    _classCallCheck(this, LikeButton);

    var _this = _possibleConstructorReturn(this, (LikeButton.__proto__ || Object.getPrototypeOf(LikeButton)).call(this, props));

    _this.handleChange = function (event) {
      var list = checkChart(event.target.value);
      var exactList = list[0];
      var partList = list[1];
      _this.setState({ eList: exactList });
      _this.setState({ pList: partList });
    };

    _this.state = { charted: false,
      test: 'string',
      eList: [],
      pList: []
    };
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(LikeButton, [{
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      var returnString = '';
      var listexact = this.state.eList.map(function (chart) {
        return React.createElement(
          'li',
          { key: chart.artist },
          chart.artist,
          '  \u2003   ',
          React.createElement(
            'i',
            null,
            chart.title
          ),
          '   \u2003  Rank: ',
          chart.rank
        );
      });
      var listpartial = this.state.pList.map(function (chart) {
        return React.createElement(
          'li',
          { key: chart.artist },
          chart.artist,
          '  \u2003   ',
          React.createElement(
            'i',
            null,
            chart.title
          ),
          '  \u2003   Rank: ',
          chart.rank
        );
      });

      return React.createElement(
        'div',
        null,
        React.createElement(
          'form',
          null,
          React.createElement(
            'label',
            null,
            React.createElement('input', { type: 'text', value: this.state.value, onChange: this.handleChange })
          ),
          React.createElement('br', null),
          React.createElement(
            'ul',
            null,
            listexact
          ),
          React.createElement('br', null),
          React.createElement(
            'ul',
            null,
            listpartial
          )
        )
      );
    }
  }]);

  return LikeButton;
}(React.Component);

var domContainer = document.querySelector('#like_button_container');
ReactDOM.render(React.createElement(LikeButton, null), domContainer);