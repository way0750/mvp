var flashy = angular.module('flashyCard', ['study', 'fileList', 'editApp', 'ngRoute']);

flashy.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/fileList',{
      templateUrl : '../fileList/fileList.html',
      controller : 'fileListCtrl'
    })
    .when('/study', {
      templateUrl : '../study/study.html',
      controller : 'studyCtrl'
    })
    .when('/edit', {
      templateUrl : '../edit/edit.html',
      controller : 'editAppCtrl'
    })
    .when('/',{
      templateUrl : '../fileList/fileList.html',
      controller: 'fileListCtrl'
    });//closes the $routeProvider
});

flashy.controller('flashyCardCtrl', function ($scope, $http, getFileList, $location, viewsFactory) {

  getFileList.getFileList().then(function(res){
    getFileList.dataObj.fileList = res.data;
  });

  $scope.gData = getFileList.dataObj;

  $scope.goEdit = function(event){
    if (event){event.preventDefault();}
    $location.path('/edit');
    $scope.$apply();
  };

  $scope.goStudy  = function(event){
    if (event){event.preventDefault();}
    if ($scope.gData.curStackIndex === null){
      $location.path('/fileList');
    } else {
      $location.path('/study');
    }
    $scope.$apply();
  };

  $scope.goList  = function(event){
    if (event){event.preventDefault();}
    $location.path('/fileList');
    $scope.$apply();
  };
  
  Mousetrap.bind('command+e', $scope.goEdit);
  Mousetrap.bind('command+s', $scope.goStudy);
  Mousetrap.bind('command+g', $scope.goList); 

});//close controller
