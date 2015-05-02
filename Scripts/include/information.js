function infoCardCtrl($scope, infoCardSvc){
    infoCardSvc.getAggregateInformation().then(function(data){
        $scope.card = data.card;
        $scope.serviceGroups = data.serviceGroups;
        $scope.schedule = data.schedule;
    });
}

function infoCardEditCtrl(infoCardSvc)
{
    var self = this;

    function updateCoor(coor) {
        self.item.coor = coor;
    }

    this.save = function () {
        infoCardSvc.saveCard(self.item);
    };

    this.updateLocation = function () {
        this.map.setAddress().then(updateCoor);
    };

    infoCardSvc.getCard().then(function (data) {
        self.item = data;
    });
}

function serviceListEditCtrl(stationService){
    var self = this;
    
    self.serviceGroups = [];

    this.saveServicePlaces = function () {
        stationService.saveServicePlaces(self.serviceGroups);
    };

    stationService.getAllServices().then(function (data) {
        self.serviceGroups = data;
    });
}

function servicePriceEditCtrl(stationService) {
    var self = this;

    this.servicePrices = [];

    stationService.getServicePrices().then(function (data) {
        self.servicePrices = data;
    });
}

function scheduleEditCtrl(stationService){
    self = this;

    this.schedule = {};

    this.saveSchedule = function () {
        stationService.saveSchedule(self.schedule);
    };

    stationService.loadSchedule().then(function (data) {
        self.schedule = data;
    });
}

angular.module("stationSetting.controllers", [])
    .controller("infoCardCtrl", infoCardCtrl)
    .controller("infoCardEditCtrl", infoCardEditCtrl)
    .controller("serviceListEditCtrl", serviceListEditCtrl)
    .controller("scheduleEditCtrl", scheduleEditCtrl);
function SvcGroupListFilter() {
    return function (items, svcName) {
        var res = [];
       
        var getServices = function (svcGroup) {
            if (svcName)
                return svcGroup.Services.filter(function (svc) {
                    svc.IsGroup = false;
                    return svc.Name.toUpperCase().indexOf(svcName.toUpperCase()) >= 0;
                });
            return svcGroup.Services;
        }

        angular.forEach(items, function (svcGroup, key) {
            svcGroup.IsGroup = true;
            var toAdd = [svcGroup].concat(getServices(svcGroup));
            if (toAdd.length > 1)
                res.push.apply(res, toAdd);
        });
        return res;
    }
}

function ServiceTableRow($compile) {
    var groupRow = "<td colspan='3'>{{rowData.Name}}</td>";
    var commonRow = "<td><span style='padding-left:1em;'>{{rowData.Name}}</span></td><td>{{rowData.MinPrice}}</td><td>{{rowData.MaxPrice}}</td>" +
        "<td>{{rowData.RequiredTime}}</td><td><span>Удалить</span></td>";
    return {
        restrict: 'A',
        scope:{
            rowData: "="
        },
        //replace: true,
        link: function (scope, elem, attrs) {
            var template = scope.rowData.IsGroup ? groupRow : commonRow;
            var link = $compile(template);
            elem.replaceWith(link(scope));
        }/*,
        compile: function () {
            return function postCompile(scope, element, attr) {
                var child = angular.element(element[0].firstChild);
                element.replaceWith(child);
            };
        }*/
    }
}

angular.module("stationSettings.filters", [])
    .filter("svcGroupListFilter", SvcGroupListFilter)
    .directive("serviceTableRow", ServiceTableRow);
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