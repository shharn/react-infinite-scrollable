var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { connect } from 'react-redux';

var reduxProviderTemplate = function reduxProviderTemplate(_ref) {
    var dataProvider = _ref.dataProvider,
        statusProvider = _ref.statusProvider,
        errorProvider = _ref.errorProvider,
        reduxPropsProvider = _ref.reduxPropsProvider;
    return function (state, ownProps) {
        var reduxProps = typeof reduxPropsProvider === 'function' && reduxPropsProvider(state, ownProps);
        return Object.assign({}, ownProps, {
            data: {
                status: statusProvider(state),
                error: errorProvider(state),
                relayed: dataProvider(state)
            },
            reduxProps: reduxProps
        });
    };
};

var dispatchProviderTemplate = function dispatchProviderTemplate(_loader) {
    return function (dispatch) {
        return {
            loader: function loader(offset, count) {
                for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    args[_key - 2] = arguments[_key];
                }

                return dispatch(_loader(offset, count, args));
            }
        };
    };
};

var makeInfiniteScrollable = function makeInfiniteScrollable(options) {
    return function (WrappedComponent) {
        var InfiniteScrollable = function (_React$Component) {
            _inherits(InfiniteScrollable, _React$Component);

            function InfiniteScrollable(props) {
                _classCallCheck(this, InfiniteScrollable);

                var _this = _possibleConstructorReturn(this, (InfiniteScrollable.__proto__ || Object.getPrototypeOf(InfiniteScrollable)).call(this, props));

                _this.handleScroll = _this.handleScroll.bind(_this);
                _this.handleEndOfScroll = _this.handleEndOfScroll.bind(_this);
                _this.isEndOfScroll = _this.isEndOfScroll.bind(_this);
                _this.load = _this.load.bind(_this);
                _this.initLoader = _this.initLoader.bind(_this);
                _this.countPerRequest = options.countPerRequest || 5;
                _this.state = {
                    relayedData: [],
                    offset: options.offset || 0,
                    hasMore: false
                };
                return _this;
            }

            _createClass(InfiniteScrollable, [{
                key: 'componentDidMount',
                value: function componentDidMount() {
                    this.load();
                }
            }, {
                key: 'componentDidUpdate',
                value: function componentDidUpdate(prevProps, prevState, snapshot) {
                    // The data fetch succeeded when the scroll is at the bottom of the container
                    if (this.props.data.status === options.statusSuccess && this.props.data.relayed !== prevProps.data.relayed) {
                        var addedData = this.props.data.relayed;
                        if (addedData && addedData.length > 0) {
                            this.setState({
                                relayedData: this.state.relayedData.concat(addedData),
                                hasMore: addedData.length >= this.countPerRequest,
                                offset: this.state.offset + addedData.length
                            });
                        } else {
                            this.setState({
                                hasMore: false
                            });
                        }
                    }
                }
            }, {
                key: 'handleScroll',
                value: function handleScroll(e) {
                    var target = e.target;
                    if (this.isEndOfScroll(target)) {
                        this.handleEndOfScroll();
                    }
                }
            }, {
                key: 'handleEndOfScroll',
                value: function handleEndOfScroll() {
                    var isFetching = this.props.data.status === options.statusWait;
                    if (this.state.hasMore && !isFetching) {
                        this.load();
                    }
                }
            }, {
                key: 'load',
                value: function load(initialized) {
                    var countPerRequest = this.countPerRequest;
                    var loaderArgs = options.loaderArgs;

                    var offset = initialized ? 0 : this.state.offset;
                    var args = loaderArgs && loaderArgs.call(this);
                    this.props.loader(offset, countPerRequest, args);
                }
            }, {
                key: 'initLoader',
                value: function initLoader() {
                    // initialize offset & relayedData
                    this.setState({
                        offset: 0,
                        relayedData: []
                    });
                    this.load(true);
                }
            }, {
                key: 'isEndOfScroll',
                value: function isEndOfScroll(target) {
                    var offsetHeight = target.offsetHeight,
                        scrollTop = target.scrollTop,
                        scrollHeight = target.scrollHeight;

                    return offsetHeight + scrollTop >= scrollHeight;
                }
            }, {
                key: 'render',
                value: function render() {
                    var _props = this.props,
                        data = _props.data,
                        rest = _objectWithoutProperties(_props, ['data']);

                    var relayedData = this.state.relayedData;

                    return React.createElement(
                        'div',
                        { onScroll: this.handleScroll },
                        React.createElement(
                            WrappedComponent,
                            Object.assign({}, rest, { data: relayedData, initLoader: this.initLoader }),
                            this.props.data.status === options.statusWait && options.loading(),
                            this.props.data.status === options.statusError && options.error(this.props.data.error)
                        )
                    );
                }
            }]);

            return InfiniteScrollable;
        }(React.Component);

        var loader = options.loader,
            useRedux = options.useRedux,
            dataProvider = options.dataProvider,
            statusProvider = options.statusProvider,
            errorProvider = options.errorProvider,
            reduxPropsProvider = options.reduxPropsProvider;

        return useRedux ? connect(reduxProviderTemplate({ dataProvider: dataProvider, statusProvider: statusProvider, errorProvider: errorProvider, reduxPropsProvider: reduxPropsProvider }), dispatchProviderTemplate(loader))(InfiniteScrollable) : InfiniteScrollable;
    };
};
export { makeInfiniteScrollable };
