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
var mod = angular.module("orders.services", ["adminApp.config", "stationSetting.services"]);

mod.factory("orderService", ["$http", "$q", "urlService", "stationService", function ($http, $q, config, stationSvc) {
    function getOrdersInternal() {
        var orders = [
                {
                    car: { model: "aaaaaddddddddddddddddddddddddd", class: "A", year: 1999 },
                    createDateTime: new Date(2015, 1, 22, 10, 30),
                    reservationDateTime: new Date(2015, 1, 22, 10, 30),
                    serviceCode: 55,
                    serviceName: "наномойка",
                    note: "",
                    customer: { name: "Alexandr", customerId: 3233 },
                    price: 1111,
                    status: "pending"
                },
                {
                    car: { model: "bbbbbbg", class: "A", year: 1999 },
                    createDateTime: new Date(2015, 1, 22, 10, 30),
                    reservationDateTime: new Date(),
                    serviceCode: 55,
                    serviceName: "замена всех колес",
                    note: "",
                    customer: { name: "Alexandr", customerId: 333 },
                    price: 2000,
                    status: "pending"
                }
        ];
        return $q.when(orders);
    }

    return {
        getOrders: function () {
            return getOrdersInternal();
        },
        getMenu: function () {
            var items = [
                { title: "Новые", url: "#/orders/pending", status: "pending", count: 0 },
                { title: "Все активные", url: "#/orders/active", status: "accepted", count: 0 },
                { title: "Отмененные", url: "#/orders/canceled", status: "canceled", count: 0 }
            ];
            getOrdersInternal().then(function (orders) {
                var obj = { pending: 0, accepted: 0, canceled: 0 };
                angular.forEach(orders, function (val, key) {
                    obj[val.status]++;
                });
                angular.forEach(items, function (val, key) {
                    val.count = obj[val.status];
                });
            });
            return items;
        }
    };
}]);

mod.factory("orderFilterService", ["$routeParams", "stationService", function ($routeParams, stationService) {
    var _svc = {};
    var _filter = {
        services: [],
        status: "pending",
        radioDate: "All",
        dateToShow: null
    };
    return {
        setOrderServices: function(orders){
            angular.forEach(orders, function(val, key){
                _svc[val.code] = isNaN(_svc[val.code]) ? 1 : _svc[val.code] + 1;  
            });
        },
        getOrderServices: function () {
            var res = function () {
                this.get = function (code) {
                    return isNaN(_svc[code]) ? 0 : _svc[code];
                };
            };
            return new res();
        },
        setFilter: function (filter) {
            _filter = filter;
        },
        getFilter: function () {
            _filter.status = $routeParams.status || "pending";
            return _filter;
        }
    };
}]);

mod.service("orderStateManager", function () {
    this.filter = {};
});