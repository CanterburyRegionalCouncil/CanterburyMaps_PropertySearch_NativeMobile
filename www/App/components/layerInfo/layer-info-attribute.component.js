angular.module('app')
    .component('layerInfoAttribute',
    {
        templateUrl: '/app/components/layerInfo/layer-info-attribute.component.html',
        bindings: {
            feature: "<",
            onFeatureSelected: "&?"
        },
        controller: ['featureSelectionEventHub', function (featureSelectionEventHub) {
            var _this = this;
            _this.highlightFeature = highlightFeature;
            _this.itemsToShow = 3;
            _this.highlighted = false;
            _this.$onInit = $onInit;
            _this.$onDestroy = $onDestroy;
            //Private 

            function $onInit() {
                _deregisterFeatureSelectionEventHub = featureSelectionEventHub.registerCallback(onFeatureSelectionChanged);
            }

            function $onDestroy() {
                _deregisterFeatureSelectionEventHub();
            }


            function highlightFeature() {
                if (!_this.onFeatureSelected) {
                    return;
                }
                _this.onFeatureSelected({ feature: _this.feature });
            }

            function onFeatureSelectionChanged(feature) {
                _this.highlighted = _this.feature.id === feature.id;
            }

            //public
            _this.showLess = function () {
                _this.itemsToShow = 3;
            }

            _this.showMore = function() {
                _this.itemsToShow = 999;
            }

            _this.showHideVisible = function() {
                return _this.feature && _this.feature.displayFields.length > 3;
            }

        }]
    });