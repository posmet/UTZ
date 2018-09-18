'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1').
  factory('exchange', function(){
      var ph_name = 'Тестовая аптека';
      var ph_id = 1;
      var user_name = '';
      var user_id=0;
      return ({
              getusername: function(){
                    return user_name;
              },
              getuserid: function(){
                    return user_id;
              },
              getphid:function(){
                    return ph_id;
              },
              getphname:function(){
                    return ph_name;
              },
              setusername: function(name){
                    user_name = name;
                    return 0;
              }, 
              setuserid: function(id){
                  user_id = id;
                  return 0;
              }, 
              setphid: function(id){
                  ph_id = id;
                  return 0;
              }, 
              setphname: function(name){
                  ph_name = name;
                  return 0;
              }
            });
  })
