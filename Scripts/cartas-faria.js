(function () {

    angular.module('services', []).
    factory('service', function ($http) {
        var service = {};

        service.getCards = function () {
            return $http.get("http://crossorigin.me/http://docs.google.com/spreadsheets/d/1T7MpDLrNndOFKDnzEZvG0tFDsphZx6BW7Qg-o4xmr_o/pub?gid=0&single=true&output=tsv");
        };

        return service;
    });

    var app = angular.module("CartasFaria", ["services"]);

    app.controller("MainController", function (service) {
        var $this = this;

        this.cards = [];
        this.selectedColor = '';


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