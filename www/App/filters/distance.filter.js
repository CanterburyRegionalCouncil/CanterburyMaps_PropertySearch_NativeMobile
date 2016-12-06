angular.module('app')
    .filter('distance',
    ['$filter',
        function($filter) {
            return function(input) {
                if (!input) {
                    return undefined;
                }

                var numberFilter = $filter('number');
                if (input < 1000) {
                    return numberFilter(input) + 'm';
                }

                return numberFilter(input / 1000) + 'km';
            }
        }
    ]);