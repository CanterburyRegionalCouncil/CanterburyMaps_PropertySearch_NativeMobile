angular.module('app')
    .filter('hectares',
    ['$filter',
        function ($filter) {
            return function (input) {
                if (!input) {
                    return undefined;
                }

                return $filter('number')(input / 1000) + ' ha';
            }
        }
    ]);