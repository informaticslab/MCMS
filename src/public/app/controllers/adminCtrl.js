angular.module('app').controller('adminCtrl', function($scope, $log, ngNotifier, $http, ngUser,$route,$modal) {
	$scope.articleTypeValue = {};
	$scope.categoryValue = {};

	$scope.users = ngUser.query();

	$http.get('/api/articleTypes').then(function(res) {
		$scope.articleListDoc = res.data[0];
		if ($scope.articleListDoc == undefined) {  //default
			$scope.articleListDoc = {
				articleTypeList: [{
					'name': 'Current Types',
					articleTypes: []
				}]
			};
		}
	});
	
	$http.get('/api/categories').then(function(res) {
		$scope.categoryListDoc = res.data[0];
		//console.log($scope.categoryListDoc);
		if ($scope.categoryListDoc == undefined) { //default
			$scope.categoryListDoc = {
				categoryList:
				[{
					categories: []
				}]
			};
		}
	});

	$scope.outputRoles = [];

	$scope.removeUser =  function(user) {
		var answer = confirm('Are you sure you want to delete this user?');
	    if (answer) {
	    	$http.post('/api/users/remove', user).then(function(res) {
	    		//console.log(user);
	    		if (res.data.success) {
	    			ngNotifier.notify('You have deleted a user');
	    		} else {
	    			ngNotifier.notifyError('Error deleteing user');
	    		}
	    	});
	    	$route.reload();
	    } 
	}

	$scope.updateRole = function(user) {
		$http.put('/api/users', user).then(function(res) {
			ngNotifier.notify('User\'s role has been updated!');
		});
		//console.log(user);
	};

	$scope.savearticleTypes = function() {
		$http.post('/api/articleTypes', $scope.articleListDoc).then(function(res) {
			console.log(res.data.success);
			// if (res.data.success) {
   //              console.log(res.data);
   //            } else {
   //              alert('there was an error');
   //            }
		});
	};

	$scope.addarticle = function(articleTypeList, e) {
		//$log.debug(articleTypeList);
		var articleTypeName = $scope.articleTypeValue[articleTypeList.name];
		if (articleTypeName.length > 0) {
			articleTypeList.articleTypes.push({name:articleTypeName});
		}
		console.log(articleTypeName);
		ngNotifier.notify("article types list has been updated!");
		$scope.articleTypeValue = {};
		e.prarticleDefault();
	};

	$scope.editarticle = function(articleType) {
		$log.debug(articleType);
		articleType.editing = true;
		console.log(articleType.editing);
	};

	$scope.cancelEditingarticle = function(articleType) {
		articleType.editing = false;
	};

	$scope.savearticle = function(articleType, e) {
		// topic.save();
		articleType.editing = false;
		ngNotifier.notify("article types list has been updated!");
		e.prarticleDefault();
	};

	$scope.removearticle = function(articleTypeList, article) {
		var index = articleTypeList.articleTypes.indexOf(article);
		if (index > -1) {
			articleTypeList.articleTypes.splice(index, 1)[0];
			ngNotifier.notify("article types list has been updated!");
		}
	};

	$scope.saveCategoryList = function() {
		$http.post('/api/categories', $scope.categoryListDoc).then(function(res) {
			console.log(res.data.success);
			if (res.data.success) {
                $log.debug(res.data);
              } else {
                alert('there was an error');
              }
		});
	};



	$scope.addCategory = function(categoryList, e) {
		//$log.debug(articleTypeList);
		var categoryName = $scope.categoryValue[categoryList.name];
		if (categoryName.length > 0) {
			categoryList.categories.push({name:categoryName,
										userAssigned: "",
										statusCompleted: false,
										dateCompleted: "",
										topics:[]
			});
		}
		ngNotifier.notify("Category list has been updated!");

		$scope.categoryValue = {};
		e.preventDefault();
	};

	$scope.editCategory = function(category) {
		$log.debug(category);
		category.editing = true;
		console.log(category.editing);
	};

	$scope.cancelEditingCategory = function(category) {
		category.editing = false;
	};

	$scope.saveCategory = function(category, e) {
		// topic.save();
		category.editing = false;
		ngNotifier.notify("Category list has been updated!");
		e.preventDefault();
	};

	$scope.removeCategory = function(categoryList, category) {
		var index = categoryList.categories.indexOf(category);
		if (index > -1) {
			categoryList.categories.splice(index, 1)[0];
			ngNotifier.notify("Category list has been updated!");
		}
	};

	$scope.addUser = function() {
		var modalInstance = $modal.open({
			scope: $scope,
			templateUrl: '/partials/addUserModal',
			controller: createUserModalInstanceCtrl,
			windowClass: 'center-modal',
			size: 'md'
		});
	};

	var createUserModalInstanceCtrl = function($scope, $modalInstance) {
		$scope.ok = function() {
			$modalInstance.close();
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};
	};

});