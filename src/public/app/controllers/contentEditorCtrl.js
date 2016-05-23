angular.module('app').controller('contentEditorCtrl', function($scope, $http, $filter, $route,$routeParams, ngNotifier, ngIdentity, ngUser, $log, $q) {
$scope.identity = ngIdentity;
$scope.minColWidth = 110;
$scope.minTopicWidth = 500;
var secondUnit = 1000
    $scope.appId = 'mmwr_express';


$scope.contentdoc=null;

    $http.get('/api/content/internal/'+ $scope.appId + '/' +$routeParams.articleId).then(function(res){
        if (res.data) {
            $scope.contentdoc = res.data[0];
            $scope.contentdocBkup = JSON.parse(JSON.stringify(res.data[0]));
            $scope.contentloaded = true;

        }
    });

$scope.onTimeSet = function (newDate, oldDate) {
    console.log(newDate);
    console.log(oldDate);
}

  $scope.date = new Date().getTime(); // need both date and time
    // dummy hardcoded data pending authentication
    //$scope.identity.currentUser._id = '1';
    //$scope.identity.currentUser.displayName = 'Trung Nguyen';

  //create an object with ID and displayName for user_created.
  //$scope.contentdoc.user_created = {id:$scope.identity.currentUser._id, displayName: $scope.identity.currentUser.displayName};



    $scope.updateContent = function() {
        // update the document here
        console.log('content ', $scope.contentdoc);
        console.log('backup ', $scope.contentdocBkup);
        if ($scope.contentdoc.date_created == null) {
            $scope.contentdoc.date_created = new Date().getTime();
        }
        if ($scope.contentdoc != $scope.contentdocBkup) {  // the original data was changed.  updating
                $scope.contentdoc.date_updated = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
        if ($scope.contentdoc.issue_date.toString() === '') {
            ngNotifier.notifyError('Issue Date cannot be blank');
        }
        else if ($scope.contentdoc.issue_vol === '') {
            ngNotifier.notifyError('Issue Volumne cannot be blank');
        }
        else if ($scope.contentdoc.issue_no === ''){
            ngNotifier.notifyError('Issue No cannot be blank event if this is an early release');
        }
        $http.post('/api/content/update/mmwr_express', $scope.contentdoc).then(function(res) {
            if (res.data.success) {
                ngNotifier.notify(res.data.success);
            }
            else {
                alert('there was an error');
            }
        });

    }





























});
