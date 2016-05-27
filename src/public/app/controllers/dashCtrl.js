mcmsApp.controller('dashCtrl', ['$scope', '$modal','$routeParams','$http','ngIdentity','$log','$filter','$window','$route', function($scope, $modal,$routeParams,$http,ngIdentity,$log,$filter,$window,$route) {
$("body").css("background-color", "#f7f7f7;");
$scope.identity = ngIdentity
$scope.$parent.activeMenu='dashboard';
// set default sort column and direction;
$scope.sortReverse=false;
$scope.sortType = "dateCreated";
// set up pagination
$scope.totalArticles = 0;
$scope.itemsPerPage = 15;
$scope.currentPage = 1;
$scope.appName = 'mmwrp_express';
//Filtering events for analysts

  $http.get('/api/content/internal/'+ $scope.appName).then(function(res){
       if(res.data) {
           $scope.articles=res.data;
          // console.log($scope.articles);
           $scope.totalArticles = $scope.articles.length;
           $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
           $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
         //  $scope.sortArticles();
           } else {
               alert('no data received, assign new id');
           }
  });




$scope.sortArticles = function(sortType) {
  if($scope.sortReverse)
  {
    $scope.articles.sort(compareAsc);
  }
  else
  {
    $scope.articles.sort(compareDesc);
  }

}

function compareAsc(a,b) {
  if($scope.sortType=="created_by")
  {
    if ((a.created_by).toString().toLowerCase() < (b.created_by).toString().toLowerCase())
      return -1;
    if ((a.created_by).toString().toLowerCase() > (b.created_by).toString().toLowerCase())
      return 1;
    return 0;
  }
  else
  {
    if ((a[$scope.sortType]).toString().toLowerCase() < (b[$scope.sortType]).toString().toLowerCase())
      return -1;
    if ((a[$scope.sortType]).toString().toLowerCase() > (b[$scope.sortType]).toString().toLowerCase())
      return 1;
    return 0;
  }
}

function compareDesc(a,b) {
  if($scope.sortType=="created_by")
  {
      if ((a.created_by).toString().toLowerCase() < (b.created_by).toString().toLowerCase())
          return -1;
      if ((a.created_by).toString().toLowerCase() > (b.created_by).toString().toLowerCase())
          return 1;
      return 0;
  }
  else
  {
    if ((a[$scope.sortType]).toString().toLowerCase() > (b[$scope.sortType]).toString().toLowerCase())
      return -1;
    if ((a[$scope.sortType]).toString().toLowerCase() < (b[$scope.sortType]).toString().toLowerCase())
      return 1;
    return 0;
  }
}


  
//$scope.showInfo = function(instance) {
//   $scope.instance = instance;
//   var modalInstance = $modal.open({
//      scope:$scope,
//      templateUrl: '/partials/infoModal',
//      controller: infoModalInstanceCtrl,
//      windowClass: 'center-modal',
//      size: 'md',
//      resolve: {
//         instance: function () {
//           return $scope.article;
//         }
//       }
//
//    });
//};


$scope.pageCount = function () {
    return Math.ceil($scope.totalArticles / $scope.itemsPerPage);
  };

$scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

$scope.pageChanged = function(searchText) {
    $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
    $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
    //$scope.filteredInstances = $filter('searchAll')($scope.instances,searchText).slice(beginItem,endItem);
  };

$scope.deleteActive = function (activeInstance) {
  // delete the passed in draft instance
    var createdDate = $filter('date')(activeInstance.dateCreated,'MM/dd/yyyy - hh:mm:ss');
    var deleteConfirm = $window.confirm('Are you sure you want to delete active instance: ' + activeInstance.eventName +' created on ' + createdDate + '? ');

    if (deleteConfirm) {
      
       $http.post('/api/events/active/delete/'+activeInstance._id).then(function(res){
       if(res.data) {
            // delete success
            $route.reload();
         } 
         else {
             alert('delete failed');
         }
    });
         
    }
    };
}]);

