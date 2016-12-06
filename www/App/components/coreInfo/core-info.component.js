angular.module('app')
    .component('coreInfo',
    {
        templateUrl: '/app/components/coreInfo/core-info.component.html',
        bindings: {
            property: "<"
        },
        controller: ['$filter', function ($filter) {
            var _this = this;
            _this.$onChanges = $onChanges;

            _this.formatArea = formatArea;
            //Private 
            function formatArea(value) {
                return $filter('hectares')(value);
            }

            function $onChanges(changes) {
                if (changes.property && _this.property) {
                    _this.icon = _this.property.isRural ? 'filter_hdr' : 'business';
                    _this.iconText = _this.property.isRural ? 'Rural' : 'Urban';
                }
            }


        }]
    });