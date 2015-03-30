var mod = angular.module("commonDirectives", ["ngRoute"]);

mod.directive("menuPills", function ($location, $route) {
    return {
        scope: true,
        link: function (scope, element, attrs) {
            scope.$on('$routeChangeSuccess', function () {
                var links = element.find('a');
                for (var i = 0; i < links.length; i++) {
                    var a = links[i];
                    var path = $location.path();
                    if (path == '/' + a.hash.substring(1)) {
                        angular.element(a).parent().addClass('active');
                    }
                    else {
                        angular.element(a).parent().removeClass('active');
                    }
                }
            });
        }
    };
})
.directive("yaMap", function () {
    return {
        scope: {
            yaMap: "="
        },
        link: function (scope, elem, attrs) {
            var map = null;
            var address = "Россия";
            function setAddress(){
                ymaps.geocode(address).then(function (res) {
                    var obj = res.geoObjects.get(0);
                    var coords = obj.geometry.getCoordinates();
                    if (!map)
                        map = new ymaps.Map(elem[0], { center: coords, zoom: 1 });
                    //map.setBounds(obj.properties.get('boundedBy'));
                });
            }
            scope.yaMap = {
                setAddress: function (addr) {
                    address = addr; //city + " ул. " + street + " " + building;
                    setAddress();
                }
            };

            ymaps.ready(function () {
                setAddress();
            });
        }
    };
});