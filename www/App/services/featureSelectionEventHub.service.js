angular.module('app')
    .service('featureSelectionEventHub',
    [
        function() {
            var _this = this;
            _this.registerCallback = registerCallback;
            _this.notify = notify;

            //Private
            var _callbacks = [];

            function registerCallback(callback) {
                if (!angular.isFunction(callback)) {
                    throw "Callback should be a function";
                }

                _callbacks.push(callback);

                return function () {
                    _.remove(_callbacks, function(c) {
                        return c === callback;
                    });
                }
            }

            function notify() {
                var callbackArguments = arguments;

                _.forEach(_callbacks,
                    function(callback) {
                        callback.apply(null, callbackArguments);
                    });
            }
        }
    ]);