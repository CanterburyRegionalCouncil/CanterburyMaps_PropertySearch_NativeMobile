angular.module('app')
    .controller('AppController',
    ['$state',
        function($state) {
            var _this = this;
            _this.$state = $state;
        }
    ]);