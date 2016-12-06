angular.module('app')
    .component('layerInfoAttributes',
    {
        templateUrl: '/app/components/layerInfo/layer-info-attributes.component.html',
        bindings: {
            layer: "<",
            features: "<",
            onFeatureSelected: "&?"
        },
        controller: ['featureParser', function (featureParser) {
            var _this = this;
            _this.$onChanges = $onChanges;
            _this.highlightFeature = highlightFeature;
            _this.itemsToShow = 3;
            //Private 
            function $onChanges(changes) {
                if (changes.features && changes.features.currentValue !== changes.features.previousValue) {
                    _this.features = angular.copy(_this.features);
                    onFeaturesChanged(_this.features);
                }
            }

            function onFeaturesChanged(features) {
                _this.parsedFeatures = featureParser.parse(_this.layer, features);
            }

            function highlightFeature(feature) {
                if (!_this.onFeatureSelected) {
                    return;
                }

                _this.onFeatureSelected({ feature: feature });
            }

        }]
    });