angular.module('app')
    .component('layerInfoHtml',
    {
        templateUrl: '/app/components/layerInfo/layer-info-html.component.html',
        bindings: {
            layer: "<",
            features: "<",
            onFeatureSelected: "&?"
        },
        controller: ['stringTemplateService',
            function (stringTemplateService) {
                var _this = this;
                _this.parsedFeatures = [];
                _this.highlightFeature = highlightFeature;
                _this.$onChanges = $onChanges;

                //Private
                var _descriptionInterpolation;

                function $onChanges(changes) {
                    if (changes.layer) {
                        onLayerChanged(changes.layer.currentValue);
                    }

                    if (changes.features) {
                        onFeaturesChanged(changes.features.currentValue);
                    }
                }

                function onLayerChanged(layer) {
                    var description = layer.popupInfo ? layer.popupInfo.description : "";
                    _descriptionInterpolation = stringTemplateService.interpolate(description);
                }

                function onFeaturesChanged(features) {
                    _this.parsedFeatures.length = 0;

                    _this.parsedFeatures = _.map(features,
                        function(feature) {
                            return {
                                id: feature.id,
                                html: _descriptionInterpolation(feature.attributes)
                            };
                        });
                }



                function highlightFeature(parsedFeature) {
                    var feature = _.find(_this.features, { id: parsedFeature.id });
                    if (!feature || !_this.onFeatureSelected) {
                        return;
                    }

                    _this.onFeatureSelected({ feature: feature });
                }
            }]
    });