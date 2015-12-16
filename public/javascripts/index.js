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

        $scope.getScopes = function (callback) {
            $http.get('api/data')
                .success(function (data) {
                    $scope.stocks = [];
                    callback(data);
                });
        };

        socket.on('stock message', function (msg) {
            if (msg !== "") {
                $scope.getScopes(function (info) {
                    angular.forEach(info, function (data) {
                        $scope.grabData(data.name);
                    });
                });
            }
        });
        $scope.getScopes(function (info) {
            angular.forEach(info, function (data) {
                $scope.grabData(data.name);
            });
        });
        $scope.grabData = function (data) {
            $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + data + '.json?order=desc&limit=150&api_key=rA5Xa_eYpcFJk5Lv3BUx')
                .success(function (data) {
                    $scope.stockdata = {
                        'name': data.dataset.name,
                        'data': data.dataset.data,
                        'code': data.dataset.dataset_code
                    };
                    $scope.stocks.push($scope.stockdata);
                    $scope.chart();
                });
        };

        $scope.send = function () {
            $scope.stocks = [];
            $http.post('/api/data', { 'name': $scope.stock })
                .success(function (data) {
                    socket.emit('stock', $scope.stock);
                    $scope.stock = '';
                });
        };

        $scope.chart = function () {
            var colors = ['#FF530D', '#E82C0C', '#FF0000', '#E80C7A', '#E80C7A'];
            $('#container').highcharts({
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        marker: {
                            enabled: false
                        },
                        enableMouseTracking: true,
                    }
                },
                chart: {
                    type: 'line'
                },
                colors: colors,
                series: $scope.stocks,
                title: {
                    text: 'Real Time Stock Market Data'
                },
                xAxis: { tickLength: 0, labels: { enabled: !1 } },
                yAxis: {
                    gridLineWidth: 0, labels: {}, title: { enabled: !1 }
                },
                credits: { enabled: !1 }
            });
        };
    }]);
