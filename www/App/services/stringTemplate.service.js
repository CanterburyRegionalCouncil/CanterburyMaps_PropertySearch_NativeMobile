angular.module('app')
    .service('stringTemplateService',
    [
        function() {
            var _this = this;

            _this.interpolate = interpolate;

            //Private 
            // Matches "{prop1}" in a template such as "This is the value {prop1} of my property"
            var _propertyPlaceholderRegex = /\{([^\}]*)\}/g;

            function interpolate(template) {
                var properties = parseProperties(template);

                return function(object) {
                    var result = template;
                    _.forEach(properties,
                        function(property) {
                            result = result.replace(property.variable, object[property.propertyName]);
                        });

                    return result;
                }
            }

            function parseProperties(template) {
                var properties = [];
                var propertyMatch;

                do {
                    propertyMatch = _propertyPlaceholderRegex.exec(template);
                    if (propertyMatch) {
                        properties.push({
                            variable: propertyMatch[0],
                            propertyName: propertyMatch[1]
                        });
                    }
                } while (propertyMatch);

                return properties;
            }
        }
    ]);