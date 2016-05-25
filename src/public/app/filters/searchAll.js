/// <reference path="../../../typings/angularjs/angular.d.ts"/>
// custom search filter for active dashboard
mcmsApp.filter('searchAll', function($filter) {
  return function(articles, searchText) {
    var searchRegx = new RegExp(searchText, "i");
    if (searchText == undefined || searchText == ''){
        return articles;
    }
    var result = [];
    if (articles) {
    for(i = 0; i < articles.length; i++) {
            if ((articles[i].title==null?false:articles[i].title.toString().search(searchRegx) !== -1) ||
                (articles[i].issue_vol ==null?false:articles[i].issue_vol.toString().search(searchRegx) !== -1) ||
                (articles[i].issue_no ==null?false:articles[i].issue_no.toString().search(searchRegx) !== -1) ||
                (articles[i].created_by ==null?false:articles[i].created_by.toString().search(searchRegx) !== -1) ||
                (articles[i].tags ==null?false:articles[i].tags.toString().search(searchRegx) !== -1) ||
                $filter('date')(new Date(articles[i].issue_date),'MM/dd/yyyy').search(searchRegx) != -1)
                {
            result.push(articles[i]);
            }
        }
    }
    return result;
  }
  
  });