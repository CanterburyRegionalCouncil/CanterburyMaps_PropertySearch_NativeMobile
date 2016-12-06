angular.module('app')
    .provider('mapQuery',
    [
        function() {

            var _this = this;
            _this.init = init;

            _this.$get = [
                '$http', '$interpolate', '$q', 'mapConfig', 'layerFactory',
                function($http, $interpolate, $q, mapConfig, layerFactory) {

                    var layerDeferred = $q.defer();

                    return {
                        load: load,
                        getLayersAsync: getLayersAsync,
                        getRuralLayersAsync: getRuralLayersAsync,
                        getUrbanLayersAsync: getUrbanLayersAsync
                    };

                    //Private
                    function getLayersAsync() {
                        return layerDeferred.promise;
                    }

                    function getRuralLayersAsync() {
                        return layerDeferred.promise.then(function(layers) {
                            return filterLayersByTag(layers, mapConfig.ruralTagName);
                        });
                    }

                    function getUrbanLayersAsync() {
                        return layerDeferred.promise.then(function(layers) {
                            return filterLayersByTag(layers, mapConfig.urbanTagName);
                        });
                    }

                    function load() {
                        loadMapsAsync()
                            .then(function(layers) {
                                layerDeferred.resolve(layers);
                            });
                    }

                    function loadMapsAsync() {
                        var mapUrl =
                            $interpolate('{{baseUrl}}/search?callback=JSON_CALLBACK&f=json&q=group:%22{{groupId}}%22%20AND%20type:%22Web%20Map%22&num=100')({
                                baseUrl: _baseUrl,
                                groupId: _groupId
                            });

                        return $http.jsonp(mapUrl)
                            .then(function(mapResponse) {
                                var layerPromises = [];
                                _.forEach(mapResponse.data.results,
                                    function(map) {
                                        layerPromises.push(loadMapLayersAsync(map));
                                    });

                                return $q.all(layerPromises)
                                    .then(function(layers) {
                                        return _.chain(layers)
                                            .flatten()
                                            .uniqBy(function(layer) {
                                                return layer.id;
                                            })
                                            .value();
                                    });
                            });
                    }

                    function loadMapLayersAsync(map) {
                        var url =
                            $interpolate('{{baseUrl}}/content/items/{{itemId}}/data/?callback=JSON_CALLBACK&f=json')({
                                baseUrl: _baseUrl,
                                itemId: map.id
                            });

                        return $http.jsonp(url)
                            .then(function(response) {
                                    var operationalLayerPromises = _.map(response.data.operationalLayers,
                                        function(operationalLayer) {
                                            return loadLayerAsync(operationalLayer.url)
                                                .then(function(layer) {
                                                    return layerFactory.createAsync(map, layer, operationalLayer);
                                                });
                                        });

                                    return $q.all(operationalLayerPromises);
                                }
                            );
                    }

                    function loadLayerAsync(layerUrl) {
                        return $http.get(layerUrl + "?f=pjson")
                            .then(function(layerResponse) {
                                return layerResponse.data;
                            });
                    }
                }
            ];

            //Private 
            var _baseUrl, _groupId;

            function init(baseUrl, groupId) {
                _baseUrl = baseUrl;
                _groupId = groupId;
            }

            function filterLayersByTag(layers, tagName) {
                return _.filter(layers,
                    function(layer) {
                        return _.includes(layer.tags, tagName);
                    });
            }
        }
    ]);