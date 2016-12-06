angular.module('app')
    .constant('searchConfig',
    {
        serviceUrl: 'http://canterburymaps.govt.nz/viewerwebservices/Search.ashx',
        coreLayerUrl: 'http://gis.ecan.govt.nz/arcgis/rest/services/Public/Region_Base/MapServer/6',
        urbanZoneLayerUrl: 'http://gis3.ecan.govt.nz/arcgis/rest/services/Beta/PropertySearch/MapServer/10',
        maxResults: 10,
        filterClasses: 'VAL,PAR,NAM,RDI',
        filterGeoTags: '',
        searchClasses: [],
        spatialReference: 2193
    })
    .constant('mapConfig',
    {
        baseUrl: "http://www.arcgis.com/sharing/rest/",
        baseMapId: "02ca1e58601e4f0b8b0fbb25d03670b5",
        groupId: "936041e3d7504ceb9c980dea635da0d2",
        ruralTagName: "Rural",
        urbanTagName: "Urban",
        proxyUrl: 'proxy.ashx',
        geometryServiceUrl: "http://gis.ecan.govt.nz/arcgis/rest/services/Utilities/Geometry/GeometryServer"
    });