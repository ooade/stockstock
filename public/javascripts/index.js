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

        socket.on('stock message', function (msg) {
            if (msg !== "") {
                $scope.stocks.push(msg);
                console.log(msg);
                $scope.$apply();
                $scope.chart();
            }
        });

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

        $scope.send = function () {
            $http.get('https://www.quandl.com/api/v3/datasets/WIKI/' + $scope.stock + '.json?order=desc&limit=150&api_key=rA5Xa_eYpcFJk5Lv3BUx')
                .success(function (data) {
                    var stock = {
                        name: data.dataset.name,
                        data: data.dataset.data,
                        code: data.dataset.dataset_code
                    };
                    socket.emit('stock', stock);
                });
            $scope.stock = '';
        };
    }]);
