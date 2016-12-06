angular.module('app')
     .config([
        '$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
        }
     ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('root',
            {
                url: "/?propertyAddress",
                templateUrl: "/app/pages/root.page.html",
                controller: "RootPageController",
                controllerAs: "ctrl"
            })
            .state('root.property',
            {
                url: "property",
                params: {
                    address: undefined,
                    propertyAddress: undefined
                },
                views: {
                    "@": {
                        templateUrl: "/app/pages/propertyPage.html",
                        controller: "PropertyPageController",
                        controllerAs: "ctrl"
                    }
                }
            });
    }]);