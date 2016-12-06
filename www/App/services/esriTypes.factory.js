angular.module('app')
    .factory('esriTypes', ['$q', 'mapConfig', 'esriLoader', function ($q, mapConfig, esriLoader) {
        var _deferredOnLoaded = $q.defer();

        esriLoader.require(
            [
                'esri/tasks/QueryTask',
                'esri/tasks/support/Query',
                "esri/geometry/Point",
                "esri/geometry/Polyline",
                "esri/geometry/Polygon",
                "esri/geometry/Extent",
                'esri/WebMap',
                'esri/Graphic',
                'esri/layers/GraphicsLayer',
                'esri/layers/FeatureLayer',
                'esri/layers/GroupLayer',
                'esri/symbols/Symbol',
                'esri/symbols/PictureMarkerSymbol',
                'esri/symbols/SimpleFillSymbol',
                'esri/symbols/SimpleMarkerSymbol',
                'esri/symbols/SimpleLineSymbol',
                'esri/tasks/GeometryService',
                'esri/tasks/support/BufferParameters',
                'esri/config',
                'esri/renderers/support/jsonUtils'
            ],
            function (
                QueryTask,
                Query,
                Point,
                Polyline,
                Polygon,
                Extent,
                WebMap,
                Graphic,
                GraphicsLayer,
                FeatureLayer,
                GroupLayer,
                Symbol,
                PictureMarkerSymbol,
                SimpleFillSymbol,
                SimpleMarkerSymbol,
                SimpleLineSymbol,
                GeometryService,
                BufferParameters,
                config,
                jsonUtils
            ) {
                var esri = {};
                esri.QueryTask = QueryTask;
                esri.Query = Query;
                esri.Point = Point;
                esri.Polyline = Polyline;
                esri.Polygon = Polygon;
                esri.Extent = Extent;
                esri.WebMap = WebMap;
                esri.Graphic = Graphic;
                esri.GraphicsLayer = GraphicsLayer;
                esri.Symbol = Symbol;
                esri.PictureMarkerSymbol = PictureMarkerSymbol;
                esri.SimpleFillSymbol = SimpleFillSymbol;
                esri.SimpleMarkerSymbol = SimpleMarkerSymbol;
                esri.SimpleLineSymbol = SimpleLineSymbol;
                esri.FeatureLayer = FeatureLayer;
                esri.GroupLayer = GroupLayer;
                esri.GeometryService = GeometryService;
                esri.BufferParameters = BufferParameters;
                esri.jsonUtils = jsonUtils;
                esri.config = config;
                esri.config.geometryServiceUrl = mapConfig.geometryServiceUrl;
                esri.config.request.proxyUrl = mapConfig.proxyUrl;

                _deferredOnLoaded.resolve(esri);
            });

        return {
            onReady: onReady
        };

        //Private
        function onReady(callback) {
            return _deferredOnLoaded.promise.then(callback);
        }
    }]);