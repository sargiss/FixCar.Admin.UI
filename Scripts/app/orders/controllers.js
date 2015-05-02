var mod = angular.module("orders.controllers", ["orders.services", "utils.dialog"])

mod.controller("ordersCtrl", ["$scope", "$routeParams", "orderService", "orderFilterService", 
    function ($scope, $routeParams, orderService, filterService) {
    $scope.subMenuItems = orderService.getMenu();
    $scope.orders = [];
    $scope.filterOrder = {};
    orderService.getOrders().then(function (data) {
        $scope.orders = data;
        filterService.setOrderServices(data);
    });
}]);

mod.controller("filterTopCtrl", ["$scope", "stationService", "orderFilterService",
    function ($scope, stationService, filterSvc) {
        $scope.services = [];

        $scope.switchDate = function () {
            switch ($scope.filterOrder.radioDate) {
                case "Today":
                    $scope.filterOrder.dateToShow = new Date();
                    break;
                case "Tomorrow":
                    var tomorrow = new Date();
                    tomorrow.setDate(new Date().getDate() + 1);
                    $scope.filterOrder.dateToShow = tomorrow;
                    break;
                default:
                    $scope.filterOrder.dateToShow = null;
                    break;
            }
        };

        $scope.openCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.filterOrder = angular.extend($scope.filterOrder, filterSvc.getFilter());
        $scope.switchDate();

        stationService.getActiveServices().then(function (data) {
            var orderedSvc = filterSvc.getOrderServices();
            $scope.services = [];
            isSelected = $scope.filterOrder.services.length ? function (code) {
                return $scope.filterOrder.services.any(function (s) { return s.code == code; });
            } : function (code) { return true; };
            angular.forEach(data, function (val, key) {
                $scope.services[key] = angular.extend({}, val, { count: orderedSvc.get(val.code), selected: isSelected(val.code) });
            });
        });

        $scope.$on("$destroy", function () {
            filterSvc.setFilter($scope.filterOrder);
        });
    }]);