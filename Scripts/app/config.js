angular.module("appConfig", [])
    .value("rootPath", "")
    .factory("urlService", function (rootPath) {
        var urls = {
            NewOrders: "",
            Orders: "",
            RejectOrder: "",
            Approve: "",
            Change: "",

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