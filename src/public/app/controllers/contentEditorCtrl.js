angular.module('app').controller('contentEditorCtrl', function($scope, $http, $filter, $route, ngNotifier, ngIdentity, ngUser, $log, $q) {
$scope.identity = ngIdentity;
$scope.minColWidth = 110;
$scope.minTopicWidth = 500;
var secondUnit = 1000;

$scope.contentdoc = {
    "issue_date": "2016-05-11",
    "issue_vol": '65',
    "issue_no": '18',
    "title" :"this is a test",
    "already_known"    : "aa",
    "added_by_report" : "bb",
    "implications"   : "cc",
    "tags"          : ["key1", "key2", "key3"],
    "article_url" :"",
    "content-ver" : "",
    "schema-ver"  :"",
    "command" :"",
    "user_created": "trung",
    "date_created": "",
    "content_body": "this is a test"
};

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

$scope.saveContent = function()
{
  // saving the document here
    $scope.contentdoc.date_created = $scope.date;
    if ($scope.contentdoc.issue_date.toString() === '') {
        ngNotifier.notifyError('Issue Date cannot be blank');
    }
    else if ($scope.contentdoc.issue_vol === '') {
        ngNotifier.notifyError('Issue Volumne cannot be blank');
    }
    else if ($scope.contentdoc.issue_no === ''){
        ngNotifier.notifyError('Issue No cannot be blank event if this is an early release');
    }
    $http.post('/api/content/save/mmwr_express', $scope.contentdoc).then(function(res) {
       if (res.data.success) {
         ngNotifier.notify("content has been created!");
       }
       else {
         alert('there was an error');
       }
     });
    
}































});
