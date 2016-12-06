angular.module('app')
    .directive('scrollToTop', ['$window',
        function ($window) {
            return {
                restict: 'A',
                link: function (scope) {
                    //HACK, use a service for comms instead
                    scope.$on('scrollToTop', function () {
                        $window.document.body.scrollTop = 0;
                    });
                }
            };
        }
    ]);