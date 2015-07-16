(function () {

    angular.module('services', []).
    factory('service', function ($http) {
        var service = {};

        service.getCards = function () {
            return $http.get("//crossorigin.me/https://docs.google.com/spreadsheets/d/1T7MpDLrNndOFKDnzEZvG0tFDsphZx6BW7Qg-o4xmr_o/pub?gid=0&single=true&output=tsv");
        };

        service.queryStringToJSON = function () {
            var pairs = location.search.slice(1).split('&');

            var result = {};
            pairs.forEach(function (pair) {
                pair = pair.split('=');
                result[pair[0]] = decodeURIComponent(pair[1] || '');
            });

            return JSON.parse(JSON.stringify(result));
        };

        return service;
    });

    var app = angular.module("CartasFaria", ["ngRoute", "services"]);

    app.config(['$routeProvider',
        function ($routeProvider) {
        $routeProvider.
        when('/cards', {
            templateUrl: 'partials/cards.html',
            controller: 'CardsController'
        }).
        when('/cards/color/:color', {
            templateUrl: 'partials/cards.html',
            controller: 'CardsController'
        }).
        otherwise({
            redirectTo: '/cards'
        });
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        // enable http caching
        $httpProvider.defaults.cache = true;
    }]);


    app.controller("CardsController", function ($scope, $routeParams, service) {

        $scope.cards = [];
        $scope.selectedColor = '';
                
        $scope.filterCards = function (card) {

            if ($routeParams.cardID) {
                return card.id == $routeParams.cardID;
            }

            if ($routeParams.color) {
                return card.color.indexOf($routeParams.color) >= 0;
            }

            return true;
        }

        // Carrega as cartas
        service.getCards()
            .success(function (data) {

                var allCardsData = data.split('\n');
                var columns = allCardsData[0].split('\t');

                for (var i = 1; i < allCardsData.length; i++) {
                    var cardData = allCardsData[i].split('\t');

                    var card = {};

                    if (cardData[0]) {
                        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                            card[columns[columnIndex]] = cardData[columnIndex];
                        }

                        card.price = parseFloat(card.price);

                        $scope.cards.push(card);
                    }
                }
                
            });
    });

})();