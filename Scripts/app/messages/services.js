var mod = angular.module("messages.services", ["adminApp.config"]);

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