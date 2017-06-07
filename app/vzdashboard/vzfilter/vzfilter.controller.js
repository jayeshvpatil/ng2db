(function(){
"use strict";

angular.module('vzFilter').controller('vzFilterController',['$scope','Events',function($scope,Events){
    $scope.isfilteropen=true; //by default show filter
//On toggle filter change - receiving rootscope broadcast from framework
    $scope.$on(Events.SHOW_FILTER,function(event,data){
        $scope.isfilteropen=data.showfilter;
      
    });



}]);






}());
