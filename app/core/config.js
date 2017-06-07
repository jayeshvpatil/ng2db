(function(){
"use strict";

angular.module('vzERGApp').config(function($provide){
    $provide.decorator('$exceptionHandler',
        ['$delegate',
            function($delegate){
                return function(exception, cause){
                    $delegate(exception, cause);
                    alert(exception.message);
                };
            }
        ]
    );
});





}());
