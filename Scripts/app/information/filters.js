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