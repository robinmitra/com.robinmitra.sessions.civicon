(function (angular, $, _) {

    var app = angular.module('civiconApp', ['ngRoute']);

    // Base URL for resources (e.g. partials)
    var resourceUrl = CRM.resourceUrls['com.robinmitra.sessions.civicon'];

    // Set up route
    app.config(['$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider) {
            $routeProvider.when('/civicon', {
                templateUrl: resourceUrl + '/partials/sessions.html',
                controller: 'SessionsCtrl'
            });

            // This is needed (Utils/Rest.php::ajax()) for CiviCRM to treat the request as genuine
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        }
    ]);

    // Controller
    app.controller('SessionsCtrl', ['$scope', '$http', '$log',
        function ($scope, $http, $log) {
            $scope.name = 'world';

            var data = {
                entity: 'CiviconSession',
                action: 'get',
                sequential: 1,
                json: 1
            };

            var serialisedData = $.param(data);

            var headers = {'Content-type': 'application/x-www-form-urlencoded'};

            $http.post('/civicrm/ajax/rest', serialisedData, {headers: headers})
                .success(function (response) {
                    $log.debug(response);
                    $scope.sessions = response.values;
                })
                .error(function (response) {
                    $log.debug(response);
                });
        }
    ]);
})(angular, CRM.$, CRM._);