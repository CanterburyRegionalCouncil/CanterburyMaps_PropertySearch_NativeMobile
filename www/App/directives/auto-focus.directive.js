angular.module('app')
    .directive('autoFocus', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

                if (!isMobile) {
                    window.setTimeout(function () {
                        element[0].focus();
                    }, 300);
                }
            }
        };
    }])