angular.module('app').controller('createContentCtrl', function($scope, $http, $filter, $route, ngNotifier, ngIdentity, ngUser, $log, $q) {
$scope.identity = ngIdentity;
$scope.minColWidth = 110;
$scope.minTopicWidth = 500;
var secondUnit = 1000;

$scope.contentdoc = {
    "issue-date": "",
    "issue-vol": "",
    "issue-no": "",
    "title" :"",
    "already_known"    : "",
    "added_by_report" : "",
    "implication"   : "",
    "tags"          : [],
    "url" :"",
    "content-ver" : "",
    "schema-ver"  :"",
    "command" :"",
    "user_created": "",
    "date_created": "",
};

$scope.onTimeSet = function (newDate, oldDate) {
    console.log(newDate);
    console.log(oldDate);
}

  $scope.date = new Date().getTime(); // need both date and time

  //create an object with ID and displayName for user_created.
  $scope.contentdoc.user_created = {id:$scope.identity.currentUser._id, displayName: $scope.identity.currentUser.displayName};

$scope.saveContent = function()
{
  // saving the document here
    $scope.contentdoc.date_created = $scope.date;
    if ($scope.contentdoc.issue-date.trim() === '') {
        ngNotifier.notifyError('Issue Date cannot be blank');
    }
    else if ($scope.contentdoc.issue-vol === '') {
        ngNotifier.notifyError('Issue Volumne cannot be blank');
    }
    else if ($scope.contentdoc.issue-no === ''){
        ngNotifier.notifyError('Issue No cannot be blank event if this is an early release');
    }
    $http.post('/api/content', $scope.contentdoc).then(function(res) {
       if (res.data.success) {
         ngNotifier.notify("content has been created!");
       }
       else {
         alert('there was an error');
       }
     });
    
}































});
