angular.module('app')
    .factory('layerFactory',
    [
        '$log', '$interpolate', '$q', 'esriTypes', 'searchConfig', 'layerConstants', 'layerQueryService', 'geometryUtils',
        function ($log, $interpolate, $q, esriTypes, searchConfig, layerConstants, layerQueryService, geometryUtils) {
            return {
                createAsync: createAsync
            }

            //Private
            function createAsync(mapData, layerData, operationalLayerData) {
                return esriTypes.onReady(function(esri) {
                    var layer = angular.extend({}, layerData, operationalLayerData);

                    layer.tags = mapData.tags;
                    layer.visibleFields = getVisibleFields(layer);
                    layer.queryDistance = getQueryDistance(layer);
                    layer.featureLayer = createFeatureLayer(esri, layer);

                    layer.queryFeaturesByGeometryAsync = function (geometry) {
                        var queryParams = getQueryParams(layer, geometry);

                        return layerQueryService.queryAsync(layer.url, queryParams)
                            .then(function(data) {
                                
                                updateFeatureLayer(layer, data.features);

                                return _.map(data.features,
                                        function(feature) {
                                            feature.layer = layer;

                                            return feature;
                                        });
                            });
                    }

                    return layer;
                });

            }

            function getVisibleFields(layer) {
                if (!layer.popupInfo || !layer.popupInfo.fieldInfos) {
                    return [];
                }

                return _.chain(layer.popupInfo.fieldInfos).filter({ visible: true }).value();
            }

            function getQueryParams(layer, geometry) {
                var queryParams = {
                    shape: geometry,
                    shapetype: 'esriGeometryPolygon'
                };

                if (layer.queryDistance) {
                    queryParams.distance = layer.queryDistance;
                }

                if (layer.layerDefinition && layer.layerDefinition.definitionExpression) {
                    queryParams.where = layer.layerDefinition.definitionExpression;
                }

                return queryParams;
            }

            function getQueryDistance(layer) {

                //HACK Should
                if (layer.url !== "http://gis.ecan.govt.nz/arcgis/rest/services/Public/Canterbury_Maps/MapServer/26" &&
                    layer.geometryType === "esriGeometryPolygon") { // Parks 
                    return 0;
                }

                //HACK
                //TODO, base this off of map tags
                switch (layer.url) {
                case "http://gis.ecan.govt.nz/arcgis/rest/services/Public/Canterbury_Maps/MapServer/26": //Parks
                case "http://gis2.ecan.govt.nz/arcgis/rest/services/Public/Bus_Routes/MapServer/2": // Bus Routes
                case "http://gis2.ecan.govt.nz/arcgis/rest/services/Beta/PropertySearch/MapServer/2": // Bus Stops
                    return layerConstants.queryDistance.close;
                case "http://gis1.ecan.govt.nz/arcgis/rest/services/Public/Education/MapServer/2": //Schools
                case "http://gis1.ecan.govt.nz/arcgis/rest/services/Beta/PropertySearch/MapServer/3": //River Flows
                    return layerConstants.queryDistance.far;
                case "http://gis.ecan.govt.nz/arcgis/rest/services/Public/Canterbury_Maps/MapServer/15"://Transfer Stations
                case "http://gis.ecan.govt.nz/arcgis/rest/services/Public/Canterbury_Maps/MapServer/13": //Recreation
                    return layerConstants.queryDistance.distant;
                default:
                    return layerConstants.queryDistance.near;
                }
            }

            function updateFeatureLayer(layer, features) {
                filterFeatureLayer(layer, features);
                setLayerExtent(layer, features);
            }

            function filterFeatureLayer(layer, features) {

                var objectIds = _.chain(features)
                    .map('attributes.OBJECTID')
                    .value();

                var definitionExpression = "";
                if (layer.layerDefinition && layer.layerDefinition.definitionExpression) {
                    definitionExpression = "(" + layer.layerDefinition.definitionExpression + ") AND ";
                }
                definitionExpression += "OBJECTID IN (" + objectIds.join(',') + ")";
                layer.featureLayer.definitionExpression = definitionExpression;
            }

            function setLayerExtent(layer, features) {
                geometryUtils.unionAsync(_.map(features, 'geometry'))
                    .then(function(extent) {
                        layer.featureLayer.extent = extent;
                    });
            }

            function createFeatureLayer(esri, layer) {
                var featureLayerParams = {
                    url: layer.url,
                    opacity: layer.opacity,
                    popupEnabled: false
                }

                if (layer.layerDefinition) {
                    if (layer.layerDefinition.drawingInfo && layer.layerDefinition.drawingInfo.renderer) {
                        featureLayerParams.renderer = esri.jsonUtils.fromJSON(layer.layerDefinition.drawingInfo.renderer);
                    }

                    if (layer.layerDefinition.hasOwnProperty('maxScale')) {
                        featureLayerParams.maxScale = layer.layerDefinition.maxScale;
                    }

                    if (layer.layerDefinition.hasOwnProperty('minScale')) {
                        featureLayerParams.minScale = layer.layerDefinition.minScale;
                    }
                }                

                return new esri.FeatureLayer(featureLayerParams);
            }
        }
    ]);