(function(){
"use strict";

angular.module('vzTab').directive('vzTab',['tabconfig','$timeout',function(tabconfig,$timeout){
return{
templateUrl:'app/vzdashboard/vztab/vztab.template.html',
controller:'vzTabController',
link:function(scope,el,attrs){
scope.tabs= tabconfig.options; 

		scope.selectedtab=function(tab){
			  for(var i in scope.tabs){
                    if(tab==scope.tabs[i])
                        {
                        scope.tabs[i].active=true;
                           console.log(scope.tabs[i].tabname+scope.tabs[i].active);
                        }else
                        {
                                 scope.tabs[i].active=false;
                                 console.log(scope.tabs[i].tabname+scope.tabs[i].active);
                        }
                }
				

		};

	
 			

 			
 	

}
};

}]);





}());
