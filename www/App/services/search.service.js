angular.module('app')
    .service('searchService',
    ['$http', '$q', 'searchConfig', 'layerQueryService', 'esriTypes',
        function ($http, $q, searchConfig, layerQueryService, esriTypes) {
            var _this = this;

            _this.searchAsync = searchAsync;
            _this.getPropertyAsync = getPropertyAsync;

            //Private
            function searchAsync(searchTerm) {
                return $http.jsonp(searchConfig.serviceUrl,
                    {
                        method: 'POST',
                        params: {
                            searchclass: searchConfig.filterClasses,
                            searchlimit: searchConfig.maxResults,
                            searchterm: searchTerm,
                            searchgeotag: searchConfig.filterGeoTags,
                            f: 'pjson',
                            callback: 'JSON_CALLBACK'
                        },
                        responseType: 'json'
                    })
                    .then(function (response) {
                        if (!response.data || !response.data.searchResults) {
                            return [];
                        }

                        if (response.data.searchResults.length === 1 && isNoResultPlaceholder(response.data.searchResults[0])) {
                            return [];
                        }

                        return response.data.searchResults;
                    });
            }

            function isNoResultPlaceholder(item) {
                return item.value.keydescription === "No Matching Results";
            }

            function getPropertyAsync(propertyAddress) {
                return esriTypes.onReady(function(esri) {

                    var property = {
                        address: propertyAddress.label,
                        point: new esri.Point({
                            x: propertyAddress.value.x,
                            y: propertyAddress.value.y,
                            spatialReference: searchConfig.spatialReference
                        })
                    }

                    return $q.all([
                            addCoreFeatureAsync(property),
                            addUrbanDeterminationAsync(property)
                        ])
                        .then(function() {
                            return property;
                        });
                });

                function addUrbanDeterminationAsync(property) {
                    return layerQueryService.queryAsync(searchConfig.urbanZoneLayerUrl,
                        {
                            shape: property.point,
                            shapetype: 'esriGeometryPoint'
                        })
                        .then(function (layerResponse) {
                            property.isRural = layerResponse.features.length === 0;
                            return property;
                        });
                }

                function addCoreFeatureAsync(property) {
                    switch (propertyAddress.value.searchclass) {
                        case 'PAR':
                        case 'VAL':
                            return getCoreFeatureDataAsync(property);
                        default:
                            return $q.when(property);
                    }
                }

                function getCoreFeatureDataAsync(property) {
                    return layerQueryService.queryAsync(searchConfig.coreLayerUrl,
                        {
                            shape: property.point,
                            shapetype: 'esriGeometryPoint'
                        })
                        .then(function (layerResponse) {

                            property.coreFeature = layerResponse.features[0];
                            return property;
                        });
                }
            }
        }
    ]);