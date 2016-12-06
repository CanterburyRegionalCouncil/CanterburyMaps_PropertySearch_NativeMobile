angular.module('app')
    .component('layerInfo',
    {
        templateUrl: '/app/components/layerInfo/layer-info.component.html',
        bindings: {
            layer: "<",
            property: "<",
            onFeatureCountUpdated: "&"
        },
        controller: ['$log', 'featureSelectionEventHub', 'blockUI',
            function ($log, featureSelectionEventHub, blockUI) {
                var _this = this;

                _this.title = undefined;
                _this.imageUrl = undefined;
                _this.features = [];
                _this.hasFeatures = false;
                _this.featureType = undefined;
                _this.$onInit = $onInit;
                _this.$onDestoy = $onDestoy;
                _this.$onChanges = $onChanges;
                _this.selectFeature = selectFeature;
                _this.showLayerInMap = showLayerInMap;
                _this.hideLayerInMap = hideLayerInMap;
                _this.showingLayer = false;

                //Private
                var _deregisterFeatureSelectionEventHub;
                var _featureTemplateTypeHtml = 'html';
                var _featureTemplateTypeAttributeList = 'attributeList';

                function $onInit() {
                    _deregisterFeatureSelectionEventHub = featureSelectionEventHub.registerCallback(onFeatureSelectionChanged);
                }

                function $onDestoy() {
                    _deregisterFeatureSelectionEventHub();
                }

                function $onChanges(changes) {
                    if (changes.property && changes.property.currentValue !== changes.property.previousValue) {
                        _this.property = angular.copy(_this.property);
                        onPropertyChange();
                    }

                    if (changes.layer && changes.layer.currentValue !== changes.layer.previousValue) {
                        onLayerChange(_this.layer);
                    }
                }

                function onPropertyChange() {
                    _this.features.length = 0;
                    blockUI.start();

                    _this.layer.queryFeaturesByGeometryAsync(_this.property.coreFeature.geometry)
                        .then(function(features) {
                            _this.features = features;
                            _this.hasFeatures = features && features.length > 0;
                            if (_this.hasFeatures) {
                                _this.featureLengthDescription = features.length > 9 ? "9+" : features.length;
                            }
                            _this.onFeatureCountUpdated({ layerId: _this.layer.id, featureCount: features.length });
                        })
                        .catch(function(e) {
                            $log.error(e);
                        })
                        .finally(function() {
                            blockUI.stop();
                        });
                }

                function onLayerChange(layer) {
                    _this.title = layer.title;
                    _this.featureTemplateType = getFeatureTemplateType(layer);

                    if (layer.popupInfo && layer.popupInfo.mediaInfos && layer.popupInfo.mediaInfos.length > 0) {
                        _this.imageUrl = layer.popupInfo.mediaInfos[0].value.sourceURL;
                    }
                }

                function getFeatureTemplateType(layer) {
                    if (!layer.popupInfo) {
                        return _featureTemplateTypeAttributeList;
                    }

                    return layer.popupInfo.description ? _featureTemplateTypeHtml : _featureTemplateTypeAttributeList;
                }

                function showLayerInMap() {
                    _this.layer.showInMap = true;
                    _this.showingLayer = true;
                }

                function hideLayerInMap() {
                    _this.layer.showInMap = false;
                    _this.showingLayer = false;
                }

                function onFeatureSelectionChanged() {
                    //TODO, remove highlight from feature
                }

                function selectFeature(feature) {
                    _this.layer.showInMap = true;
                    featureSelectionEventHub.notify(feature);
                }
            }
        ]
    });