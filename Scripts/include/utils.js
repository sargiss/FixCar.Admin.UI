var DialogService = function(ngDialog){
    return {
        showDialog: function (dialogClass) {
            ngDialog.open({
                template: dialogClass.template,
                controller: dialogClass.controller
            });
        }
    };
};

angular.module("utils.dialog", ["ngDialog"])
.factory("dialogService", ["ngDialog", DialogService]);
