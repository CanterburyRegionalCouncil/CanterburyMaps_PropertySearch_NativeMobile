angular.module('app')
    .component('displayAttribute',
    {
        templateUrl: '/app/components/displayAttribute/display-attribute.component.html',
        bindings: {
            feature: "<",
            label: "@?",
            attributeName: "@name",
            onFormat: "&?onFormat"
        },
        controller: [
            function() {
                var _this = this;
                _this.label = undefined;
                _this.value = undefined;
                _this.$onChanges = $onChanges;

                //Private
                function $onChanges(changes) {
                    if (changes.feature && changes.feature.currentValue) {
                        _this.label = _this.label || _this.attributeName;
                        _this.value = changes.feature.currentValue.attributes[_this.attributeName];

                        if (_this.onFormat) {
                            _this.value = _this.onFormat({ value: _this.value });
                        }
                    }
                }
            }
        ]
    });