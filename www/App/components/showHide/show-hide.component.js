angular.module('app')
    .component('showHide',
    {
        templateUrl: '/app/components/showHide/show-hide.component.html',
        bindings: {
            onShowMore: "&onShowMore",
            onShowLess: "&onShowLess"
        },
        controller: [
            function() {
                var _this = this;
                _this.label = "Show More";
                _this.showMore = true;

                //public
                _this.onClick = function() {
                    if (_this.showMore) {
                        _this.label = "Show Less";
                        _this.onShowMore();
                        _this.showMore = false;
                    } else {
                        _this.label = "Show More";
                        _this.onShowLess();
                        _this.showMore = true;
                    }
                }
            }
        ]
    });