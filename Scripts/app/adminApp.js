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

