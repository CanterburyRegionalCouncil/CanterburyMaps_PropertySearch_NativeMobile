angular.module('app')
    .component('map',
    {
        templateUrl: '/app/components/map/map.component.html',
        bindings: {
            property: "<",
            layers: "<"
        },
        controller: [
            '$scope', '$q', 'mapConfig', 'mapQuery', 'esriTypes', 'featureSelectionEventHub',
            function($scope, $q, mapConfig, mapQuery, esriTypes, featureSelectionEventHub) {
                var _this = this;
                _this.$onInit = $onInit;
                _this.$onChanges = $onChanges;
                _this.$onDestoy = $onDestoy;
                _this.onViewCreated = onViewCreated;

                //Private
                var _mapViewDeferred = $q.defer();
                var _mapView,

                    _locationMarkerSymbol,
                    _locationMarkerLayer,

                    _propertyBoundarySymbol,
                    _propertyBoundaryLayer,

                    _highlightPointSymbol,
                    _highlightPolygonSymbol,
                    _highlightPolylineSymbol,
                    _highlightLayer,
                    _highlightedFeature,

                    _deregisterFeatureSelectionEventHub;
                var _layerWatches = [];

                function $onInit() {
                    esriTypes.onReady(function(esri) {

                        _this.map = new esri.WebMap({
                            portalItem: {
                                id: mapConfig.baseMapId
                            }
                        });

                        initHighlightLayer(_this.map);
                        initPropertyBoundaryLayer(_this.map);
                        initLocationLayer(_this.map);

                        _deregisterFeatureSelectionEventHub = featureSelectionEventHub.registerCallback(renderHighlightedFeature);
                    });
                }

                function $onChanges(changes) {
                    if (changes.property && _this.property) {
                        onPropertyChanged();
                    }

                    if (changes.layers && _this.layers) {
                        onLayersChanged();
                    }
                }

                function $onDestoy() {
                    _deregisterFeatureSelectionEventHub();
                }

                function initLocationLayer(map) {
                    esriTypes.onReady(function(esri) {
                        _locationMarkerSymbol = new esri.PictureMarkerSymbol({
                            url: "/content/img/icons/location-pin.png",
                            width: "30px",
                            height: "30px",
                            yoffset: "15px"
                        });

                        _locationMarkerLayer = new esri.GraphicsLayer();
                        map.add(_locationMarkerLayer);
                    });
                }

                function initPropertyBoundaryLayer(map) {
                    esriTypes.onReady(function(esri) {
                        _propertyBoundarySymbol = new esri.SimpleFillSymbol({
                            color: [255, 0, 0, 0],
                            style: "none",
                            outline: {
                                color: [255, 0, 0, .9],
                                width: 2,
                                style: "solid"
                            }
                        });

                        _propertyBoundaryLayer = new esri.GraphicsLayer();
                        _propertyBoundaryLayer.masScale = 15000;

                        map.add(_propertyBoundaryLayer);
                    });
                }

                function initHighlightLayer(map) {
                    esriTypes.onReady(function(esri) {

                        _highlightPointSymbol = new esri.SimpleMarkerSymbol({
                            style: "circle",
                            color: [255, 255, 0, 0.3],
                            size: "50px",
                            outline: {
                                color: [255, 255, 0, 0.5],
                                width: 3
                            }
                        });

                        _highlightPolygonSymbol = new esri.SimpleFillSymbol({
                            color: [255, 255, 0, 0.3],
                            style: "solid",
                            outline: {
                                color: [255, 255, 0, 0.5],
                                width: 2,
                                style: "solid"
                            }
                        });

                        _highlightPolylineSymbol = new esri.SimpleLineSymbol({
                            color: [255, 255, 0, 0.4],
                            width: "10px",
                            style: "solid"
                        });

                        _highlightLayer = new esri.GraphicsLayer({
                            opacity: 1
                        });

                        _highlightLayer.masScale = 15000;

                        map.add(_highlightLayer);
                    });
                }

                function onMapViewReady() {
                    return _mapViewDeferred.promise;
                }

                function onPropertyChanged() {
                    onMapViewReady()
                        .then(function() {

                            _mapView.center = _this.property.point;

                            _highlightLayer.removeAll();
                            renderPropertyLocationMarker();
                            renderPropertyBoundary();
                        });
                }

                function onLayersChanged() {
                    clearShowInMapWatches();

                    _.forEach(_this.layers,
                        function(layer) {
                            var unwatchShowInMap = $scope.$watch(function() {
                                    return layer.showInMap;
                                },
                                function(showInMap) {
                                    toggleLayerVisibility(layer, showInMap);
                                });

                            _layerWatches.push(unwatchShowInMap);
                        });
                }

                function clearShowInMapWatches() {
                    _.forEach(_layerWatches,
                        function(layerWatch) {
                            layerWatch();
                        });

                    _layerWatches.length = 0;
                }

                function renderPropertyLocationMarker() {
                    esriTypes.onReady(function(esri) {
                        _locationMarkerLayer.removeAll();

                        var locationPinGraphic = new esri.Graphic(
                            {
                                geometry: _this.property.point,
                                symbol: _locationMarkerSymbol,
                                attributes: { address: _this.property.address }
                            }
                        );

                        _locationMarkerLayer.add(locationPinGraphic);
                    });
                };

                function renderPropertyBoundary() {
                    _propertyBoundaryLayer.removeAll();

                    var coreFeature = _this.property.coreFeature;
                    coreFeature.symbol = _propertyBoundarySymbol;
                    _propertyBoundaryLayer.add(coreFeature);

                    _mapView.then(function () {
                        _mapView.extent = coreFeature.geometry.extent.clone().expand(2);
                    });
                };

                function renderHighlightedFeature(feature) {
                    esriTypes.onReady(function(esri) {
                        clearHighlightedFeature();

                        if (feature) {
                            _highlightedFeature = feature;

                            var graphic = new esri.Graphic(
                                {
                                    geometry: feature.geometry,
                                    symbol: getHighlightSymbol(feature)
                                }
                            );
                            
                            _highlightLayer.add(graphic);
                        }
                    });
                };

                function getHighlightSymbol(feature) {
                    switch(feature.layer.geometryType) {
                        case "esriGeometryPolygon":
                            return _highlightPolygonSymbol;
                        case "esriGeometryPolyline":
                            return _highlightPolylineSymbol;
                        default:
                            return _highlightPointSymbol;
                    }
                }

                function clearHighlightedFeature() {
                    _highlightLayer.removeAll();
                    _highlightedFeature = undefined;
                }

                function onViewCreated(mapView) {
                    _mapView = mapView;
                    _mapViewDeferred.resolve();
                };

                function toggleLayerVisibility(layer, showLayer) {
                    if (showLayer) {
                        if (layer.featureLayer.extent) {

                            var extent = layer.featureLayer.extent.union(_this.property.coreFeature.geometry.extent)
                                .clone()
                                .expand(1.5);

                            _mapView.then(function() {
                                _mapView.goTo(extent);
                            });
                        }

                        _this.map.then(function() {
                            _this.map.add(layer.featureLayer, 2);
                        });
                    } else {

                        _this.map.then(function () {
                            _this.map.remove(layer.featureLayer);
                        });

                        if (_highlightedFeature && _highlightedFeature.layer.id === layer.id) {
                            clearHighlightedFeature();
                        }
                    }
                }
            }
        ]
    });