angular.module('app')
    .directive('spinner', function () {
        return {
            restrict: 'E',
            template: '<div ng-if="spinnerCtrl.isBusy" class="loading-overlay">\
                            <div class="spinner">\
                                <i class="zmdi zmdi-hc-3x zmdi-hc-spin zmdi-settings"></i>\
                            </div>\
                       </div>',
            scope: {
                isBusy: "="
            },
            bindToController: true,
            controllerAs: "spinnerCtrl",
            controller: [function () { }]
        };
    });
