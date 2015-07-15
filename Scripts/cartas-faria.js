﻿(function () {

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

    var app = angular.module("CartasFaria", ["services"]);

    app.controller("MainController", function (service) {
        var $this = this;

        this.cards = [];
        this.selectedColor = '';
        this.filter = service.queryStringToJSON();
        
        this.filterCards = function (card) {

            if ($this.filter.cardID) {
                return card.id == $this.filter.cardID;
            }

            if ($this.filter.color) {
                return card.color.indexOf($this.filter.color) >= 0;
            }

            return true;
        }

        // Carrega as cartas
        service.getCards()
            .success(function (data) {
                var allCardsData = data.split('\n');
                for (var i = 1; i < allCardsData.length; i++) {
                    var cardData = allCardsData[i].split('\t');

                    if (cardData[0]) {

                        var card = {
                            id: cardData[0],
                            name: cardData[1],
                            color: cardData[2],
                            price: cardData[3],
                            qty: cardData[4]
                        };
                        
                        $this.cards.push(card);
                    }
                }
                
            });
    });

})();