angular.module('app')
    .controller('PropertyPageController', ['$scope', '$state', '$stateParams', '$q', '$uibModal', 'mapQuery', 'searchService','$location','blockUI',
        function ($scope, $state, $stateParams, $q, $uibModal, mapQuery, searchService, $location, blockUI) {
            var _this = this;
            _this.onPropertySelected = onPropertySelected;
            _this.onPropertyLabelSet = onPropertyLabelSet;
            _this.share = share;
            _this.shareLink = shareLink;
            _this.currentAddress = undefined;

            onInit();

            //Private

            function onInit() {
                if ($stateParams.propertyAddress) {
                    onPropertyLabelSet($stateParams.propertyAddress);
                }
            }

            function groupLayers(layers) {
                //add a dummy tag as this hasn't been set up yet in the real data
                _.each(layers,
                    function (layer) {
                        if (layer.name.startsWith('School')) {
                            layer.$grouping = 'School and Zoning';
                        }
                        else if (layer.name.startsWith('Bus')) {
                            layer.$grouping = 'Public Transport';
                        }
                        else if (layer.name.indexOf('Consent') > -1) {
                            layer.$grouping = 'Consents';
                        }
                        else if (layer.name.indexOf('Photo') > -1) {
                            layer.$grouping = 'Photographs';
                        }
                        else if (layer.name.indexOf('Zone') > -1) {
                            layer.$grouping = 'Land Zoning';
                        }
                        else {
                            layer.$grouping = 'Other';
                        }
                    });


                _this.groupedLayers = _.groupBy(layers, '$grouping');
            }
            
            function shareLink() {
                if (_this.property) {
                    return $location.absUrl();
                }
                return '';
            }

            function onPropertySelected(property) {
                blockUI.start();
                searchService.getPropertyAsync(property)
                    .then(function(property) {
                        _this.property = property;
                        _this.currentAddress = property.address;

                        if (_this.property.isRural) {
                            mapQuery.getRuralLayersAsync()
                                .then(function(layers) {
                                    _this.layers = layers;
                                    groupLayers(layers);
                                });
                        } else {
                            mapQuery.getUrbanLayersAsync()
                                .then(function(layers) {
                                    _this.layers = layers;
                                    groupLayers(layers);
                                });
                        }
                    })
                    .catch(function(error) {
                        $log.error(error);
                    })
                    .finally(function() {
                        blockUI.stop();
                    });

            }


            function onPropertyLabelSet(propertyAddressLabel) {

                return searchService.searchAsync(propertyAddressLabel)
                    .then(function (addressResults) {
                        onPropertySelected(addressResults[0]);
                    });
            }

            function share() {
                $uibModal.open({
                    template: '<share-dialog property="ctrl.property" on-close="$dismiss()" />',
                    controllerAs: "ctrl",
                    controller: ['property', function (property) {
                        this.property = property;
                    }],
                    resolve: {
                        property: _this.property
                    }
                });
            }
        }
    ]);