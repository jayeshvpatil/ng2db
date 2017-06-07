'use strict';
angular.module('vzERGApp').controller('loginController',['$scope',function($scope){
  $scope.state='authorized';
  $scope.signIn=function(){
    $scope.state='authorized';
  };
}]);
