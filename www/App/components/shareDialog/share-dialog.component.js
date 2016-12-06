angular.module('app')
    .component('shareDialog',
    {
        templateUrl: "/app/components/shareDialog/share-dialog.component.html",
        bindings: {
            property: "<",
            onClose: "&"
        },
        controller: ['$state', function ($state) {
            var _this = this;
            _this.shareLink = null;
            _this.$onInit = $onInit;
            _this.close = close;
            _this.copiedToClipboard = false;

            //Private
            function $onInit() {
                _this.shareLink = $state.href('root', {address: _this.property.address}, { absolute: true });
            }

            function close() {
                _this.onClose();
            }
        }]
    });