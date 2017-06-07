(function(){
"use strict";

    angular.module('vzFramework').controller('vzFrameworkController',['$scope','$rootScope','Events', function($scope,$rootScope,Events){

      $scope.isfilteropen=true;

        //broadcast filter click event to filter directive
        var broadcastFilterState=function(){
            $rootScope.$broadcast(Events.SHOW_FILTER,{
                showfilter: $scope.isfilteropen
            });

        };



        //toggle filter state
        $scope.toggleFilter=function(){
          
            $scope.isfilteropen=!$scope.isfilteropen;
            broadcastFilterState();
        }

    }]);






}());
