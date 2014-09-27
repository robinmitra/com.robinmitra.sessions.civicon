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

    /**
     * Controller to create a listing of sessions
     *
     * @ngdoc controller
     * @name SessionsListingCtrl
     */
    app.controller('SessionsListingCtrl', ['$scope', '$http', '$log', 'CiviApiFactory',
        /**
         * @param $scope
         * @param $http
         * @param $log
         * @param {CiviApiFactory} CiviApi
         */
        function ($scope, $http, $log, CiviApi) {
            CiviApi.get('CiviconSession')
                .success(function (response) {
                    // Save the array of sessions retrieved on the $scope in order to make it accessible in the view
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

                CiviApi.remove('CiviconSession', data)
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
    app.controller('SessionsEditCtrl', ['$scope', '$http', '$log', '$location', '$routeParams', 'CiviApiFactory',
        /**
         * @param $scope
         * @param $http
         * @param $log
         * @param $location
         * @param $routeParams
         * @param {CiviApiFactory} CiviApi
         */
        function ($scope, $http, $log, $location, $routeParams, CiviApi) {
            // If session ID exists in the URL, try to retrieve it in order to populate the edit view
            if ($routeParams.id) {
                CiviApi.get('CiviconSession', {id: $routeParams.id})
                    .success(function (response) {
                        $scope.session = response.values[0];
                    })
                    .error(function (response) {
                        CRM.alert('No session exists with the provided ID!', '', 'error');
                        $location.path('/civicon'); // redirect to the listing
                    });
            }

            /**
             * Add a new session or update an existing one

             * @name addSession
             */
            $scope.addSession = function () {
                var data = $scope.session;

                CiviApi.create('CiviconSession', data)
                    .success(function (response) {
                        CRM.alert('Session saved', '', 'success');
                        $location.path('/civicon'); // redirect to the listing
                    });
            };
        }
    ]);

    /**
     * @ngdoc service
     * @name CiviApiFactory
     */
    app.factory('CiviApiFactory', ['$http',
        function ($http) {
            /**
             * Retrieve record(s)
             *
             * @name CiviApiFactory#get
             */
            var get = function (entity, data) {
                return post(entity, data, 'get');
            };

            /**
             * Create a record
             *
             * @name CiviApiFactory#create
             */
            var create = function (entity, data) {
                return post(entity, data, 'create');
            };

            /**
             * Remove (delete) a record
             *
             * @name CiviApiFactory#remove
             */
            var remove = function (entity, data) {
                return post(entity, data, 'delete');
            };

            /**
             * Send the POST HTTP request to the CiviCRM API
             *
             * @name CiviApiFactory#post
             * @private
             */
            var post = function (entity, data, action) {
                // If data is not provided, initialise it to an empty object
                data = data || {};

                data.entity = entity;
                data.action = action;
                data.json = 1;
                data.sequential = 1;

                var serialisedData = $.param(data);

                var headers = {'Content-type': 'application/x-www-form-urlencoded'};

                // Send an AJAX request to retrieve all sessions
                return $http.post('/civicrm/ajax/rest', serialisedData, {headers: headers});
            };

            return {
                get: get,
                create: create,
                remove: remove
            };
        }
    ]);
})(angular, CRM.$, CRM._);