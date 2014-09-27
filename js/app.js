(function (angular, $, _) {

    var app = angular.module('civiconApp', ['ngRoute']);

    // Base URL for resources (e.g. partials)
    var resourceUrl = CRM.resourceUrls['com.robinmitra.sessions.civicon'];

    // Set up route
    app.config(['$routeProvider', '$httpProvider',
        function ($routeProvider, $httpProvider) {
            $routeProvider.when('/civicon', {
                templateUrl: resourceUrl + '/partials/listing.html',
                controller: 'SessionsListingCtrl'
            });

            $routeProvider.when('/civicon/new', {
                templateUrl: resourceUrl + '/partials/edit.html',
                controller: 'SessionsEditCtrl'
            });

            $routeProvider.when('/civicon/:id/edit', {
                templateUrl: resourceUrl + '/partials/edit.html',
                controller: 'SessionsEditCtrl'
            });

            // This is needed (Utils/Rest.php::ajax()) for CiviCRM to treat the request as genuine
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        }
    ]);

    // Sessions Listing Controller
    app.controller('SessionsListingCtrl', ['$scope', '$http', '$log',
        function ($scope, $http, $log) {
            var data = {
                entity: 'CiviconSession',
                action: 'get',
                sequential: 1,
                json: 1
            };

            var serialisedData = $.param(data);

            var headers = {'Content-type': 'application/x-www-form-urlencoded'};

            // Send an AJAX request to retrieve all sessions
            $http.post('/civicrm/ajax/rest', serialisedData, {headers: headers})
                .success(function (response) {
                    // save the array of sessions retrieved on the $scope in order to make it accessible in the view
                    $scope.sessions = response.values;
                })
                .error(function (response) {
                    // Log the response in case of error - using the $log service is preferable to using console.log()
                    $log.debug(response);
                    CRM.alert('Oops! Something went wrong!', '', 'error');
                });

            /**
             * Delete a session
             *
             * @name deleteSession
             * @param index
             */
            $scope.deleteSession = function (index) {
                var data = $scope.sessions[index];

                data.entity = 'CiviconSession';
                data.action = 'delete';
                data.json = 1;

                var serialisedData = $.param(data);

                var headers = {'Content-type': 'application/x-www-form-urlencoded'};

                $http.post('/civicrm/ajax/rest', serialisedData, {headers: headers})
                    .success(function (response) {
                        $scope.sessions.splice(index, 1); // remove the session from the listing view
                        CRM.alert('Session deleted', '', 'success');
                    })
                    .error(function (response) {
                        CRM.alert('Failed to delete session', '', 'error');
                    });
            };
        }
    ]);

    /**
     * Sessions edit controller
     */
    app.controller('SessionsEditCtrl', ['$scope', '$http', '$log', '$location', '$routeParams',
        function ($scope, $http, $log, $location, $routeParams) {
            // If session ID exists in the URL, try to retrieve it in order to populate the edit view
            if ($routeParams.id) {
                var data = {
                    entity: 'CiviconSession',
                    action: 'get',
                    sequential: 1,
                    json: 1,
                    id: $routeParams.id
                };

                var serialisedData = $.param(data);

                var headers = {'Content-type': 'application/x-www-form-urlencoded'};

                // Send the AJAX request to retrieve the session
                $http.post('/civicrm/ajax/rest', serialisedData, {headers: headers})
                    .success(function (response) {
                        $scope.session = response.values[0];
                    })
                    .error(function (response) {
                        CRM.alert('No session exists with the provided ID!', '', 'error');
                        $location.path('/civicon'); // redirect to the listing
                    })
                ;
            }

            /**
             * Add a new session or update an existing one

             * @name addSession
             */
            $scope.addSession = function () {
                var data = $scope.session;

                data.entity = 'CiviconSession';
                data.action = 'create';
                data.json = 1;

                var serialisedData = $.param(data);

                var headers = {'Content-type': 'application/x-www-form-urlencoded'};

                // Send the AJAX request to save the session
                $http.post('/civicrm/ajax/rest', serialisedData, {headers: headers})
                    .success(function (response) {
                        CRM.alert('Session saved', '', 'success');
                        $location.path('/civicon'); // redirect to the listing
                    });
            };
        }
    ]);
})(angular, CRM.$, CRM._);