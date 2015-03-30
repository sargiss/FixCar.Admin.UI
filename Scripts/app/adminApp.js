var adminApp = angular.module("adminApp", ["ngRoute", 'ui.bootstrap', 'multi-select',
    "adminApp.controller", "adminApp.filters", "commonDirectives"])
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
                .otherwise({
                    redirectTo: '/orders'
                });
        }]);

