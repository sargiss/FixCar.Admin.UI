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