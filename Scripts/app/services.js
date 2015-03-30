var mod = angular.module("adminApp.service", ["appConfig"]);

StationService = function ($q) {
    var _stationId = null;

    this.setCurrentStation = function (id) {
        _stationId = id;
    };
    this.getCurrentStation = function () {
        return _stationId;
    }
    this.getServices = function () {
        return $q.when([
        { name: "aaaaggggggggggggggggggggggggggggggggggga", code:22, selected: false },
        { name: "bbbyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyybb", code:33, selected: false },
        { name: "ccccbbbbbbbbbbbbbbbbbbnnnnnnnnnnnnnnc", code:55, selected: false }]);
    };
};

mod.factory("stationService", function ($q) {
    return new StationService($q);
});

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

//--------------------------------------------------------------------------------------
// messages
//--------------------------------------------------------------------------------------

mod.factory("messageService", ["$routeParams", "$http", "$q", "urlService", function ($routeParams, $http, $q, urls) {
    var msg = [
        {
            title: "some header",
            body: "msg from people.",
            orderNumber: "",
            createDateTime: new Date(),
            isRead: false,
            id: "123"
        },
        {
            title: "some header",
            body: "msg from people.",
            orderNumber: "",
            createDateTime: new Date(),
            isRead: false,
            id: "1234"
        },
        {
            createDateTime: "some header",
            body: "msg from people.",
            orderNumber: "",
            createDateTime: new Date(),
            isRead: false,
            id: "12345"
        },
        {
            title: "some header",
            body: "msg from people.",
            orderNumber: "",
            createDateTime: new Date(),
            isRead: false,
            id: "123"
        },
        {
            title: "some header",
            body: "msg from people.",
            orderNumber: "",
            createDateTime: new Date(),
            isRead: false,
            id: "123"
        }
    ]

    var countToLoad = 20;
    var loader = function () {
        var type = $routeParams.msgType;
        currentLoaded = 0;
        this.loadNext = function () {
            currentLoaded += msg.length;
            return $q.when(msg);
        }
    };
    var getMsgsState = function () {
        var counts = { incoming: 3, outcoming: 0, system: 0 };
        return $q.when(counts);
    }
    var dialogClass = function (msg, target) {

        target = angular.extend(target || {}, { isView: false });

        this.template = "/Pages/Message.html";
        this.controller = ["$scope", function ($scope) {
            $scope.okDisabled = !!target.isView;
            $scope.msg = msg;
            $scope.send = function () {
                $http.post("", $scope.msg).success(function () {
                    $scope.closeThisDialog();
                });
            };
        }];
    }
    return {
        getLoader: function () {
            return new loader();
        },
        getMenu: function () {
            var items = [
                { title: "Входящие", url: "#/messages/incoming", status: "incoming", count: 0 },
                { title: "Исходящие", url: "#/orders/outcoming", status: "outcoming", count: 0 },
                { title: "Системные", url: "#/orders/system", status: "system", count: 0 }
            ];
            getMsgsState().then(function (obj) {
                angular.forEach(items, function (val, key) {
                    val.count = obj[val.status];
                });
            });
            return items;
        },
        getNewDialog: function(adr){
            return new dialogClass();
        },
        getReplyDialog: function (msg) {
            return new dialogClass(msg, null);
        },
        getDetailDialog: function () {
            return new dialogClass(msg, { isView: true });
        }
    }
}]);