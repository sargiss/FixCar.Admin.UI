function StationService($http, appConfig) {
    this.saveStationPlaces = function (svcGroups) {
        var param = svcGroups.map(function (group) {
            return {
                carPlaces: group.PlceCount,
                services: group.filter(function (svc) {
                    return svc.checked;
                }).map(function (svc) {
                    return svc.Id;
                })
            };
        });
        $http.post(appConfig.stationPlaces, param);
    };

    this.getAllServices = function () {
        $http.get("");
    };

    this.getServicePrices = function () {
        $http.get("");
    };
}