(function(){
"use strict";

angular.module('vzERGApp').factory('tabconfig', ['$timeout', function ($timeout) {
var widget = [
        { 
        	title:'Main Chart',
        	options : {
            chart: {
                   type: 'discreteBarChart',
                height:350,
                width:200,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.4f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
                
            }
        },
            data : [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "A" ,
                        "value" : -29.765957771107
                    } ,
                    {
                        "label" : "B" ,
                        "value" : 0
                    } ,
                    {
                        "label" : "C" ,
                        "value" : 32.807804682612
                    } ,
                    {
                        "label" : "D" ,
                        "value" : 196.45946739256
                    } ,
                    {
                        "label" : "E" ,
                        "value" : 0.19434030906893
                    } ,
                    {
                        "label" : "F" ,
                        "value" : -98.079782601442
                    } 
                  
                ]
            }
        ],
        	size:4
        },
           { 
        	title:'Trend Chart',
        	size:2
        },
        { 
        	title:'Something Chart',
        	size:8
        },
           { 
        	title:'Some Table',
        	size:6
        },
           { 
        	title:'New Table',
        	size:4
        }
        ];
var options=[
    {'tabname':'Channel','tabcontent_id':'channel', 'href':'#channel',
    'tabcontent': widget
    ,'active':true},
    {'tabname':'Device','tabcontent_id':'device','href':'#device' ,'tabcontent':'Device content goes here','active':false},
    {'tabname':'Segment','tabcontent_id':'segment','href':'#segment' ,'tabcontent':'Segment goes here','active':false},
    {'tabname':'Price Plan','tabcontent_id':'priceplan', 'href':'#priceplan','tabcontent':'Price plan charts here','active':false},
 	{'tabname':'Ethnicity','tabcontent_id':'ethnicity','href':'#ethnicity', 'tabcontent':'Ethnicity charts goes here','active':false}
    ];

    return {
    	options:options
    };

}]);

}());
