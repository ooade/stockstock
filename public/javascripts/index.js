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

        $scope.invokeData = function () {
            $scope.getScopes(function (info) {
                angular.forEach(info, function (data) {
                    $scope.grabData(data.name);
                });
            });
        }

        socket.on('stock message', function (msg) {
            if (msg !== "") {
                $scope.invokeData();
            }
        });

        socket.on('delete message', function (msg) {
            $scope.invokeData();
        });

        $scope.invokeData();

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

        $scope.removeStock = function (code) {
            $http.delete('api/data/' + code)
                .success(function () {
                    angular.forEach($scope.stocks, function (x, i) {
                        if (x.code === code) {
                            $scope.stocks.splice(i, 1);
                        }
                    });
                    socket.emit('delete', "deleted data");
                });
        };

        $scope.chart = function () {
            var colors = ['#4a2b0f', '#E82C0C', '#FF0000', '#E80C7A', '#E80C7A'];
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
                    type: 'line',
                    colors: colors
                },
                colors: colors,
                series: $scope.stocks,
                title: {
                    text: ''
                },
                xAxis: { tickLength: 0, labels: { enabled: !1 } },
                yAxis: {
                    gridLineWidth: 0, labels: {}, title: { enabled: !1 }
                },
                credits: { enabled: !1 }
            });
        };
        if ($('#container').text() === '') {
            $('#container').html('<center><img src="/images/ajax-loader.gif"/><br/>Loading Chart...</center>');
        }
    }]);
