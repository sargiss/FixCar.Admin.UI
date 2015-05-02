function InfoCardService($q, $http, globalCurrents) {
    this.item = {}

    this.getAggregateInformation = function () {
        return $q.when(this.item);
    };

    this.getCard = function () {
        return $q.when(this.item);
    };

    this.saveCard = function (item) {
        this.item = item;
    };
}

function StationService($http, $q, globalCurrents, appConfig) {

    this.saveServicePlaces = function (svcGroups) {
        var param = svcGroups.map(function (group) {
            return {
                carPlaces: group.PlaceCount,
                services: group.filter(function (svc) {
                    return svc.checked;
                }).map(function (svc) {
                    return svc.Id;
                })
            };
        });
        //$http.post(appConfig.setStationPlaces(globalCurrents.stationId), param);
        //return $q.when();
    };

    this.getAllServices = function () {
        //$http.get(appConfig.getAllServices(globalCurrents.stationId));
        return $q.when([
            {
                Name: "Автомойка", Checked: false, Services: [
                    { Name: "обычная", Checked: false },
                    { Name: "nano", Checked: false}
                ]
            },
            {
                Name: "Шиномонтаж", Checked: false, Services: [
                    { Name: "всех колес", Checked: false },
                    { Name: "чернение", Checked: false }
                ]
            }
        ]);
    };

    this.getActiveServices = function () {
        return $q.when([
        { name: "aaaaggggggggggggggggggggggggggggggggggga", code: 22, selected: false },
        { name: "bbbyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyybb", code: 33, selected: false },
        { name: "ccccbbbbbbbbbbbbbbbbbbnnnnnnnnnnnnnnc", code: 55, selected: false }]);
    };

    this.getServicePrices = function () {
        return $http.get(appConfig.servicePrices(globalCurrents.stationId));
    };
}

angular.module("stationSetting.services", ["adminApp.services"])
    .service("stationService", ["$http", "$q", "globalCurrents", "urlService", StationService])
    .service("infoCardSvc", ["$q", "$http", "globalCurrents", InfoCardService]);