angular.module('app').controller('createContentCtrl', function($scope, $http, $filter, $route, ngNotifier, $location, $interval, $animate, ngIdentity, ngUser, $log, $q) {
$scope.identity = ngIdentity;
$scope.minColWidth = 110;
$scope.minTopicWidth = 500;
$animate.enabled(false);
  var secondUnit = 1000;
  var autoSave;
  var oKtoSave = false;
  $scope.date = new Date().getTime(); // need both date and time
  autoSave = $interval(function() {
  // repeat check if contentdoc has been changed for every 150 seconds.
    $scope.checkDirty();
  }, 150 * secondUnit);  // change time delay here

  var changeWatcher = function() {   //function to watch for changes on contentdoc
    var unregister = $scope.$watch('contentdoc', function(newVal, oldVal) {
      $log.debug("watching");
      if (newVal != oldVal) {
        $log.debug('changed');
        $scope.allowSaveDrafts = true;
        unregister();
      }

    }, true);
  };


  $scope.contentdoc = {
  };




$scope.onTimeSet = function (newDate, oldDate) {
    console.log(newDate);
    console.log(oldDate);
}


  var previousData = angular.toJson($scope.contentdoc);

   $scope.checkDirty = function() {
     // this function compare previously saved copy of contentdoc against the current contentdoc
     // if they are not the same then save the current contentdoc
     $log.debug('check dirty fired');
     if (previousData !== angular.toJson($scope.contentdoc)) {
      //$scope.saveDraftEvent('Yes');
     // re-initialize and wait for the next check
      previousData = angular.toJson($scope.contentdoc);
   }


  };


    $scope.saveContent = function() {
        // saving the document here
        var reload = true;
        $scope.contentdoc.date_created = new Date().toISOString().slice(0, 19).replace('T', ' ');
        $scope.contentdoc.date_updated = $scope.contentdoc.date_created;
        if ($scope.contentdoc.issue_date.toString() === '') {
            ngNotifier.notifyError('Issue Date cannot be blank');
        }
        else if ($scope.contentdoc.issue_vol === '') {
            ngNotifier.notifyError('Issue Volumne cannot be blank');
        }
        else if ($scope.contentdoc.issue_no === ''){
            ngNotifier.notifyError('Issue No cannot be blank event if this is an early release');
        }
        else {
            $http.post('/api/content/save/mmwr_express', $scope.contentdoc).then(function (res) {
                if (res.data.success) {
                    ngNotifier.notify(res.data.success);
                    var currentPath = $location.path(); // get the current path to decide if we need to go back to dashboard or stay at the active in progress event
                    $location.path('/');
                    $scope.ok(reload);
                }
                else {
                    alert('there was an error');
                }
            });
            $animate.enabled(true);
        }
    }

});
