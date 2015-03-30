﻿function infoCardCtrl($scope, infoCardSvc){
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
        infoCardSvc.save(self.item);
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
        stationService.saveServicesPlaces(self.serviceGroups);
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

info = angular.module("adminApp.stationSetting", [])
    .controller("infoCardCtrl", infoCardCtrl)
    .controller("infoCardEditCtrl", infoCardEditCtrl)
    .controller("serviceEditCtrl", serviceEditCtrl)
    .controller("scheduleEditCtrl", scheduleEditCtrl);