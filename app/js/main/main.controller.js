;(function(){
	'use strict';
	angular.module('app.main')
		.controller('MainCtrl', MainCtrl);
	//////////

	MainCtrl.$inject = ['$scope', 'localStorage', 'dataBase', 'list', 'dbList'];

	function MainCtrl ($scope, localStorage, dataBase, list, dbList) {

		$scope.list = list || {};
		$scope.list.title = list.title || '';
		$scope.list.items = list.items || [];
		$scope.dbList = dbList.data || [];

		function updateList() {
			dataBase.getList()
        		.then(function(res){
					$scope.dbList = res.data;
        		});
		}

		function pushToLs(value) {
			if(!value.items.length)
				value = false;

			localStorage.setWithExpiration('list', value, 9999);
		}

		/*task lists*/

		$scope.saveList = function () {
			if(!$scope.list.title || $scope.list.items.length == 0) {
				console.log('error, empty list or title');
				return;
			}

			var l = {
					title: $scope.list.title,
					items: $scope.list.items
				},
				oldList = $scope.dbList.some(function(x){
					return x.title == $scope.list.title;
				});

			pushToLs($scope.list);

			if(oldList) {

				var currentList = $scope.dbList
					.filter(function(x){

						if(x.title == $scope.list.title)
							return x;
					})[0];

				l.id = currentList._id;

				dataBase.changeList(l)
					.then(updateList());
					console.log('list updated');
				return;
			}
			

			dataBase.saveList(l)
				.then(updateList());

				console.log('list saved');
			
		}

        $scope.getList = function (list) {
        	$scope.list.items = list.items;
        	$scope.list.title = list.title;
        	console.log('list loaded');
        	pushToLs($scope.list);
        };

        $scope.removeList = function (id) {

			dataBase.removeList(id)
				.then(function(){
					dataBase.getList()
		        		.then(function(res){
							$scope.dbList = res.data;
							console.log('list removed');
		        		});
				});

	    }

	    /*tasks*/

	    $scope.addTask = function () {
	    	if(!$scope.input)
	    		return;

	        $scope.list.items.push({txt:$scope.input, done:false});
	        $scope.input = "";

	        pushToLs($scope.list);
	    };

	    $scope.removeTask = function () {

			$scope.list.items = $scope.list.items.filter(function(i){
				if(!i.done)
					return i;
			});

			pushToLs($scope.list);
	    };

	}

}());