angular.module('app')
    .config([
        'mapConfig', 'mapQueryProvider', function (mapConfig, mapQueryProvider) {
            mapQueryProvider.init(mapConfig.baseUrl, mapConfig.groupId);
        }
    ])
    .run([
        'mapQuery', function (mapQuery) {
            mapQuery.load();
        }
    ]);