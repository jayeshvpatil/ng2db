(function(){
"use strict";
angular.module('vzFramework').directive('vzFramework',function(){

 return {
    transclude: true,
     scope:{
      title: '@',
      subtitle: '@',
      iconfile: '@'

     },
    controller: 'vzFrameworkController',
    templateUrl: 'app/vzdashboard/vzframework/vzframework.template.html'

  };


});







}());
