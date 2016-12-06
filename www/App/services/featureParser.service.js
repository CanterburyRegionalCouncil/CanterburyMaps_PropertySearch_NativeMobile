angular.module('app')
    .service('featureParser',
    ['$filter',
        function($filter) {
            var _this = this;
            _this.parse = parse;

            //Private 
            function parse(layer, features) {
                return _.map(features,
                    function (feature) {
                        feature.displayFields = parseFeatureDisplayFields(layer, feature);
                        return feature;
                    });
            }

            function parseFeatureDisplayFields(layer, feature) {
                if (layer.visibleFields.length === 0) {
                    return [];
                }

                var featureData = [];

                _.forEach(layer.visibleFields,
                    function (visibleField) {
                        featureData.push({
                            label: visibleField.label,
                            value: formatValue(visibleField, feature.attributes[visibleField.fieldName])
                        });
                    });

                return featureData;
            }

            function formatValue(fieldDefinition, value) {
                var format = fieldDefinition.format;

                if (!format) {
                    return value;
                }

                if (isNumericFormatter(format)) {
                    return formatNumber(format, value);
                }

                if (isDateFormatter(format)) {
                    return formatDate(format, value);                    
                }

                return value;
            }

            function isDateFormatter(format) {
                return format && format.hasOwnProperty("dateFormat");
            }

            function isNumericFormatter(format) {
                return format && format.hasOwnProperty("places");
            }

            function formatNumber(format, value) {
                var number = $filter('number')(value, format.places);

                if (!format.digitSeparator) {
                    number = number.replace(/,/g, '');
                }

                return number;
            }

            function formatDate(format, value) {
                return $filter('date')(value);
            }
        }
    ]);