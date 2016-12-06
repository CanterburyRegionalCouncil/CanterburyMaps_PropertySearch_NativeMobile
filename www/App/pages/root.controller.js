angular.module('app')
    .controller('RootPageController', ['$state', '$stateParams',
        function ($state, $stateParams) {
            var _this = this;
            _this.onPropertySelected = onPropertySelected;

            onInit();

            //Private
            function onInit() {
                if ($stateParams.address) {
                    _this.address = $stateParams.address;
                }
            }

            function onPropertySelected(address) {
                $state.go('root.property', { propertyAddress: address.label }, { inherit: false });
            }
        }
    ]);