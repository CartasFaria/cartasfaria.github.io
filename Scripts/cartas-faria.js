(function () {

    angular.module('services', []).
    factory('service', function ($http) {
        var service = {};

        service.getCards = function () {
            return $http.get("//crossorigin.me/https://docs.google.com/spreadsheets/d/1T7MpDLrNndOFKDnzEZvG0tFDsphZx6BW7Qg-o4xmr_o/pub?gid=0&single=true&output=tsv");
        };

        service.getCategories = function () {
            return $http.get("//crossorigin.me/https://docs.google.com/spreadsheets/d/1T7MpDLrNndOFKDnzEZvG0tFDsphZx6BW7Qg-o4xmr_o/pub?gid=766174211&single=true&output=tsv");
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
        when('/cards/category/:category', {
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

    app.controller("MenuController", function ($scope, service) {
        $scope.categories = [];

        service.getCategories()
            .success(function (data) {
                var allCategoriesData = data.split('\n');
                var columns = allCategoriesData[0].split('\t');

                for (var i = 1; i < allCategoriesData.length; i++) {
                    var categoryData = allCategoriesData[i].split('\t');

                    var category = {};

                    if (categoryData[0]) {
                        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                            category[columns[columnIndex]] = categoryData[columnIndex];
                        }

                        $scope.categories.push(category);
                    }
                }
            });
    });

    app.controller("CardsController", function ($scope, $routeParams, service) {

        $scope.currentCategory = $routeParams.category;
        $scope.cards = [];
        $scope.categories = {};
        $scope.selectedColor = '';

        $scope.filterCards = function (card) {

            if ($routeParams.cardID) {
                return card.id == $routeParams.cardID;
            }

            if ($routeParams.category) {
                return card.category == $routeParams.category;
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

        $scope.categories = [];

        service.getCategories()
            .success(function (data) {
                var allCategoriesData = data.split('\n');
                var columns = allCategoriesData[0].split('\t');

                for (var i = 1; i < allCategoriesData.length; i++) {
                    var categoryData = allCategoriesData[i].split('\t');

                    var category = {};

                    if (categoryData[0]) {
                        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                            category[columns[columnIndex]] = categoryData[columnIndex];
                        }

                        $scope.categories[category.id] = category;
                    }
                }
            });
    });

})();