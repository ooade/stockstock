/* global angular */
/* global $ */
'use strict';

angular.module('stockApp', ['ngResource', 'ngRoute'])
	.config(function ($routeProvider, $locationProvider, $httpProvider) {
		$routeProvider
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
	})
	.controller('stockAll', ['$scope', '$window', '$http', function ($scope, $window, $http) {
		var socket = io();

		$scope.stocks = [];

		$scope.mef = "not g";
		socket.on('stock message', function (msg) {
			if (msg !== "") {
				$scope.stocks.push(msg);
				$scope.$apply();
			}
		});

		$scope.send = function () {
			$http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + $scope.stock + '.json?order=desc&limit=100&api_key=rA5Xa_eYpcFJk5Lv3BUx')
				.success(function (data) {
					socket.emit('stock', data);
				});
			$scope.stock = '';
        };
	}]);
