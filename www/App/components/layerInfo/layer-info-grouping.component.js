angular.module('app')
    .component('layerInfoGrouping',
    {
        templateUrl: '/app/components/layerInfo/layer-info-grouping.component.html',
        bindings: {
            layers: "<",
            property: "<"
        },
        controller: [
            function () {
                var _this = this;

                _this.title = undefined;
                _this.$onChanges = $onChanges;
                _this.showFeatures = false;
                _this.onFeatureCountUpdated = onFeatureCountUpdated;
                _this.featureCount = 0;
                _this.featureCountDescription = featureCountDescription;

                var featureCountList = [];

                //Private

                function $onChanges(changes) {
                    if (changes.property && changes.property.currentValue !== changes.property.previousValue) {
                        featureCountList = [];
                        _this.featureCount = 0;
                        _this.property = angular.copy(_this.property);
                        _this.showFeatures = false;
                    }

                    if (changes.layers && changes.layers.currentValue !== changes.layers.previousValue) {
                        onLayersChange(_this.layers);
                    }
                }

                function onLayersChange(layers) {
                    if (layers) {
                        _this.title = layers[0].$grouping;
                    }
                    _this.layers = layers;
                }

                //public
                _this.toggleShowFeatures = function() {
                    _this.showFeatures = !_this.showFeatures;
                }

                function onFeatureCountUpdated(layerId, featureCount) {
                    var featureCountItem = _.find(featureCountList, { layerId: layerId});

                    if (featureCountItem) {
                        featureCountItem.featureCount = featureCount;
                    } else {
                        featureCountList.push({ layerId: layerId, featureCount: featureCount });
                    }

                    _this.featureCount = 0;

                    _.each(featureCountList,
                        function(featureCountItem) {
                            _this.featureCount += featureCountItem.featureCount;
                        });

                    console.log(layerId + ' - ' + featureCount);
                }

                function featureCountDescription() {
                    if (_this.featureCount > 9) {
                        return "9+";
                    } else {
                        return _this.featureCount;
                    }
                }
            }
        ]
    });