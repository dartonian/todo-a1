;(function () {
    'use strict';
    angular
        .module('app')
        .service('dataBase', dataBase);
    ////////

    localStorage.$inject = ['$http'];

    function dataBase($http) {

        var self = this;

        self.saveList = function (data) {
			return $http.post('api/lists',data);
        }

        self.getList = function () {
            return $http.get('api/lists');
        }

        self.changeList = function (data) {
            return $http.put('api/lists/' + data.id, data);
        }

        self.removeList = function (listId) {
            return $http.delete('api/lists/' + listId);
        }

    }
})();