mcmsApp.controller('rootCtrl', ['$scope', '$rootScope','$routeParams','ngAuth','$location','ngIdentity','$route','$log','$http', function($scope, $rootScope, $routeParams, ngAuth, $location, ngIdentity, $route, $log, $http) {

$scope.identity = ngIdentity;
$scope.animationEnabled = true;

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







