angular.module('app')
    .service('layerQueryService',
    [
        '$q', 'esriTypes',
        function ($q, esriTypes) {
            var _this = this;
            _this.queryAsync = queryAsync;

            //Private
            function queryAsync(url, queryParams) {                

                var queryTaskPromise = prepareQueryTaskAsync(url);
                var queryPromise = prepareQueryAsync(queryParams);

                return $q.all([queryPromise, queryTaskPromise])
                    .then(function (resolvedPromises) {
                        var query = resolvedPromises[0];
                        var queryTask = resolvedPromises[1];
                        return queryTask.execute(query);
                    });
            }

            function prepareQueryTaskAsync(url) {
                return esriTypes.onReady(function(esri) {
                        return new esri.QueryTask({ url: url });
                    });
            };

            function prepareQueryAsync(params) {
                return esriTypes.onReady(function(esri) {

                    var paramsDefaults = {
                        outFields: ['*'],
                        returnGeometry: true
                    };

                    var queryParams = angular.extend({}, paramsDefaults, params);

                    prepareQueryParamShape(esri, queryParams);
                    prepareQueryParamOutFields(queryParams);

                    return new esri.Query(queryParams);
                });
            };

            function prepareQueryParamShape(esri, queryParams) {
                if (!queryParams.shape || !queryParams.shapetype) {
                    return;
                }

                if (angular.isString(queryParams.shape)) {
                    queryParams.shape = angular.fromJson(queryParams.shape);
                }

                switch (queryParams.shapetype) {
                    case "esriGeometryPoint":
                        queryParams.geometry = new esri.Point(queryParams.shape);
                        break;
                    case "esriGeometryPolyline":
                        queryParams.geometry = new esri.Polyline(queryParams.shape);
                        break;
                    default:
                        queryParams.geometry = new esri.Polygon(queryParams.shape);
                        break;
                }                
            }

            function prepareQueryParamOutFields(queryParams) {
                if (!angular.isString(queryParams.outFields)) {
                    return;
                }

                if (queryParams.outFields === '*') {
                    queryParams.outFields = ['*'];
                } else {                    
                    queryParams.outFields = queryParams.outFields.split(',');
                }
            }
        }
    ]);