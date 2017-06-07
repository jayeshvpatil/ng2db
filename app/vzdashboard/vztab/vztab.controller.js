(function(){
"use strict";

angular.module('vzTab').controller('vzTabController',['$scope','Events',function($scope,Events){

  $scope.isfilteropen=true; //by default show filter
//On toggle filter change - receiving rootscope broadcast from framework
    $scope.$on(Events.SHOW_FILTER,function(event,data){
        $scope.isfilteropen=data.showfilter;
    });

}]);





}());
