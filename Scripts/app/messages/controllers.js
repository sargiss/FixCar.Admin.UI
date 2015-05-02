var mod = angular.module("messages.controllers", ["messages.services", "utils.dialog"])

mod.controller("messageCtrl", ["$scope", "messageService", "dialogService", function ($scope, msgSvc, dlgSvc) {
    var loader = msgSvc.getLoader();

    $scope.subMenuItems = msgSvc.getMenu();

    $scope.messages = [];

    $scope.loadNext = function () {
        loader.loadNext().then(function (data) {
            $scope.messages.push.apply($scope.messages, data);
        });
    };

    $scope.reply = function (msg) {
        dlgSvc.showDialog(msgSvc.getReplyDialog(msg));
    };

    $scope.detail = function () {
        dlgSvc.showDialog(msgSvc.getDetailDialog(msg));
    }

    $scope.delete = function (msg) {
        msgSvc.delete(msg);
    }

    $scope.loadNext();
}]);