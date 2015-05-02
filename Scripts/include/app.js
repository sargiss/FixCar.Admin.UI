var adminApp = angular.module("adminApp", ["ngRoute", 'ui.bootstrap', 'multi-select',
    "adminApp.controllers", "adminApp.filters", "adminApp.services", "commonDirectives",
    "orders.controllers", "stationSetting.controllers", "stationSettings.filters",
    "messages.controllers"])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/main', {
                    template: '<div>CONTENT</div>',
                    controller: 'mainCtrl'
                })
                .when('/messages', {
                    redirectTo: '/messages/incoming'
                })
                .when('/messages/:msgType', {
                    templateUrl: '/Pages/Messages.html',
                    controller: 'messageCtrl'
                })
                .when('/orders', {
                    templateUrl: "/Pages/Orders.html",
                    controller: 'ordersCtrl'
                })
                .when('/orders/:status', {
                    templateUrl: "/Pages/Orders.html",
                    controller: 'ordersCtrl'
                })
                .when('/information', {
                    templateUrl: "/Pages/Information.html",
                    controller: 'infoCardCtrl'
                })
                .when('/information/services', {
                    templateUrl: "/Pages/Services.html",
                    controller: "serviceListEditCtrl",
                    controllerAs: "svc"
                })
                .otherwise({
                    redirectTo: '/orders'
                });
        }]);


Array.prototype.any = function (filter) {
    for (var i = 0; i < this.length; i++) {
        if (filter(this[i]))
            return true;
    }
    return false;
};
angular.module("adminApp.config", [])
    .value("rootPath", "")
    .factory("urlService", function (rootPath) {
        var urls = {
            NewOrders: "",
            Orders: "",
            RejectOrder: "",
            Approve: "",
            Change: ""
        };

        var res = {};
        for (var url in urls) {
            res[url] = function () {
                var tmplt = urls[url];
                for (var i = 0; i < arguments.length; i++)
                    tmplt = tmplt.replace("{" + i + "}", arguments[i].toString());
                return rootPath + "/" + tmplt;
            };
        }
        return res;
    });
var mod = angular.module("adminApp.controllers", ["adminApp.services", "utils.dialog"])

mod.controller("mainCtrl", function ($scope) {
   
    
});

mod.controller("infoCardCtrl", [function () {

}]);

mod.controller("scheduleCtrl", [function () {

}]);

var mod = angular.module("commonDirectives", ["ngRoute"]);

mod.directive("menuPills", function ($location, $route) {
    return {
        scope: true,
        link: function (scope, element, attrs) {
            scope.$on('$routeChangeSuccess', function () {
                var links = element.find('a');
                for (var i = 0; i < links.length; i++) {
                    var a = links[i];
                    var path = $location.path();
                    if (path == '/' + a.hash.substring(1)) {
                        angular.element(a).parent().addClass('active');
                    }
                    else {
                        angular.element(a).parent().removeClass('active');
                    }
                }
            });
        }
    };
})
.directive("yaMap", function () {
    return {
        scope: {
            yaMap: "="
        },
        link: function (scope, elem, attrs) {
            var map = null;
            var address = "Россия";
            function setAddress(){
                ymaps.geocode(address).then(function (res) {
                    var obj = res.geoObjects.get(0);
                    var coords = obj.geometry.getCoordinates();
                    if (!map)
                        map = new ymaps.Map(elem[0], { center: coords, zoom: 1 });
                    //map.setBounds(obj.properties.get('boundedBy'));
                });
            }
            scope.yaMap = {
                setAddress: function (addr) {
                    address = addr; //city + " ул. " + street + " " + building;
                    setAddress();
                }
            };

            ymaps.ready(function () {
                setAddress();
            });
        }
    };
});
var filters = angular.module("adminApp.filters", []);

filters.filter("datesInDay", function () {
    return function (items, propName, date) {
        var res = [];
        if (!date)
            return items;
        var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var endDate = new Date();
        endDate.setDate(startDate.getDate() + 1);
        angular.forEach(items, function (item, key) {
            if (item[propName] >= startDate && item[propName] < endDate)
                res.push(item);
        });
        return res;
    }

});

filters.filter("inSvc", function () {
    return function (items, svcs) {
        var res = [];
        var set = {};
        if (!svcs)
            return items;
        angular.forEach(svcs, function (svc, key) {
            set[svc.code.toString()] = 1;
        });
        angular.forEach(items, function (item, key) {
            if (set[item.serviceCode])
                res.push(item);
        });
        return res;
    }
});
angular.module("adminApp.services", [])
    .service("globalCurrents", function () {
        this.stationId = 0;
    });