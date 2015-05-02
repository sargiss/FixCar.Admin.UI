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