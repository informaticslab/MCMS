mcmsApp.controller('rootCtrl', ['$scope', '$rootScope','$modal','$routeParams','ngAuth','$location','ngIdentity','$route','$log','$http', function($scope, $rootScope, $modal, $routeParams, ngAuth, $location, ngIdentity, $route, $log, $http) {

$scope.identity = ngIdentity;
$scope.animationEnabled = true;


    $scope.createArticle = function (size) {

        var modalInstance = $modal.open({
            templateUrl: '/partials/createContentModal',
            controller: CreateArticleModalInstanceCtrl,
            size: size,
            keyboard: false,
            backdrop: 'static'

        });

    };


    var CreateArticleModalInstanceCtrl = function ($scope, $modalInstance,$location,$route,$timeout,$animate) {
        $scope.ok = function (reload) {
            $animate.enabled(true);
            $modalInstance.close();
            if (reload) {
                $timeout($route.reload,500);
            }
        };

        $scope.cancel = function () {
            $animate.enabled(true);
            $modalInstance.dismiss();
            // if (reload) {
            //   $timeout($route.reload,500);
            // }
        };
    };

//$scope.logout = function(){
//    if (!$rootScope.continueNav) {
//        var answer = confirm("You have unsaved changes, do you want to continue?")
//          if (!answer) {
//            event.preventDefault();
//          }
//          else {
//        		ngAuth.logoutUser().then(function() {
//            $rootScope.continueNav = true;
//      			$scope.email = "";
//      			$scope.password = "";
//    			//This is for PIV
//
//    //			if($location.protocol()=='https'){
//    //				$window.location = $location.absUrl().replace('https','http').replace('4400','8089');
//    //			}
//    //			else{
//    //				$location.path('/');    /
//    //			}
//            $location.path('/login')
//            $("body").css("background-color", "#2a2d33;");
//      		});
//      }
//    }
//    else {
//
//      ngAuth.logoutUser().then(function() {
//            $scope.email = "";
//            $scope.password = "";
//          //This is for PIV
//
//    //      if($location.protocol()=='https'){
//    //        $window.location = $location.absUrl().replace('https','http').replace('4400','8089');
//    //      }
//    //      else{
//    //        $location.path('/');    /
//    //      }
//            $location.path('/login')
//            $("body").css("background-color", "#2a2d33;");
//          });
//
//    }
//
//
//};

}]);







