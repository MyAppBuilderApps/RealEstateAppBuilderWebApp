var control = angular.module('starter.controllers', ['ngTagsInput','checklist-model']);
localStorage.clear();
var v = 0;
var barcolor = 'bar-assertive';
var buttoncolor;
var defaultkey;
var image;
var fssi;
var floatid = '';
var shareurl = "https://itunes.apple.com";
var shareurlid;

var app = angular.module('app', ['ngTagsInput'])
.config(function(tagsInputConfigProvider) {
        tagsInputConfigProvider
        .setDefaults('tagsInput', {
                     placeholder: 'New tag',
                     addOnEnter: false
                     })
        .setDefaults('autoComplete', {
                     maxResultsToShow: 20,
                     debounceDelay: 1000
                     })
        .setActiveInterpolation('tagsInput', {
                                placeholder: true,
                                addOnEnter: true,
                                removeTagSymbol: true
                                });
        });
openFB.init('1436547346579776');

var options = {
    customSpinner : false,
    position : "middle",
    label : "Please Wait..",
bgColor: "#000",
opacity:0.5,
color: "#fff"
};

var googleapi = {
setToken: function(data) {
    localStorage.access_token = data.access_token;
    localStorage.refresh_token = data.refresh_token || localStorage.refresh_token;
    var expiresAt = new Date().getTime() + parseInt(data.expires_in, 10) * 1000 - 60000;
    localStorage.expires_at = expiresAt;
},
authorize: function(options) {
    var deferred = $.Deferred();
    var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                                                                         client_id: options.client_id,
                                                                         redirect_uri: options.redirect_uri,
                                                                         response_type: 'code',
                                                                         scope: options.scope
                                                                         });
    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=yes');
    $(authWindow).on('loadstart', function(e) {
                     
                     var url = e.originalEvent.url;
                     var code = /\?code=(.+)$/.exec(url);
                     var error = /\?error=(.+)$/.exec(url);
                     
                     if (code || error) {
                     authWindow.close();
                     }
                     
                     if (code) {
                     $.post('https://accounts.google.com/o/oauth2/token', {
                            code: code[1],
                            client_id: options.client_id,
                            client_secret: options.client_secret,
                            redirect_uri: options.redirect_uri,
                            grant_type: 'authorization_code'
                            }).done(function(data) {
                                    googleapi.setToken(data);
                                    deferred.resolve(data);
                                    }).fail(function(response) {
                                            deferred.reject(response.responseJSON);
                                            });
                     } else if (error) {
                     deferred.reject({
                                     error: error[1]
                                     });
                     }
                     });
    return deferred.promise();
},
getToken: function(options) {
    var deferred = $.Deferred();
    if (new Date().getTime() < localStorage.expires_at) {
        deferred.resolve({
                         access_token: localStorage.access_token
                         });
    } else if (localStorage.refresh_token) {
        $.post('https://accounts.google.com/o/oauth2/token', {
               refresh_token: localStorage.refresh_token,
               client_id: options.client_id,
               client_secret: options.client_secret,
               grant_type: 'refresh_token'
               }).done(function(data) {
                       googleapi.setToken(data);
                       deferred.resolve(data);
                       }).fail(function(response) {
                               deferred.reject(response.responseJSON);
                               });
    } else {
        deferred.reject();
    }
    
    return deferred.promise();
},
userInfo: function(options) {
    return $.getJSON('https://www.googleapis.com/oauth2/v1/userinfo', options);
}
};

var data;
var appkeyResult = '';
var appList = [];
var twitterKey = '';
var buttonArray = '';
var elementArray = '';
var buttonId = '';
var elementId = '';
var contentData = '';
var appKey = '';
var appTitle = '';
var appImg = '';
var appDesc = '';
var listGrid = '';
var reskey=[];
var chapterArray = [];

control.controller('editContentCtrl',function($scope,$state,$ionicLoading,$http,$ionicActionSheet,$ionicPopup){
                   $scope.key='';
                   $scope.bar_color=barcolor;
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                $http({method: "GET", url:'key.txt', cache: false, params:{}})
                .success(function(data){
                         defaultkey = data.trim();
                         appList=[];
                         $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                         .success(function(data, status){
//                                  alert(data.title);
                                  appId=defaultkey;
                                  appTit=data.title;
                                  appList.push(data);
                                  
                                  $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                  .success(function(reskey){
                                          
                                           for(var j=0;j<reskey.length;j++){
                                           if(reskey[j].key=="keys"){
                                           $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                           .success(function(data, status){
                                                    
                                                    appList.push(data);
                                                    
                                                    })
                                           .error(function(data, status) {
                                                  $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                                  $ionicLoading.hide();
                                                  });
                                           }
                                           }
                                           $ionicLoading.hide();
                                           
//                                           $state.go('listView1');
                                           
                                           $scope.listViewClickFtn(appList[0].api_key,appList[0].title,appList[0].description,appList[0].splash_image);
                                           
                                           })
                                  .error(function(data, status) {
                                         $ionicLoading.hide();
                                         $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                         
                                         }); 
                                 
                                  })
                         .error(function(data, status) {
                         $ionicLoading.hide();
                                $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                
                                });

                         
                })
                .error(function(data, status) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                   
                });
                            
                   
                   // }
                   // }
                   
                   
                   function goOnline(){
                   $state.go('login');
                   }
                   
                   function offline(){
                   alert("Please Connect Your 3G or Wifi Connection");
                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit,desc,img){
                   
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   appDesc = desc;
                   appImg = img;
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(data){
                          for (var i = 0; i < data.length; i++) {
                          if(data[i].key=="fssi"){
                          fssi = data[i].value;
                          
                          }
                          else if(data[i].key=="url"){
                          shareurl = data[i].value;
                          }
                          }
                          //                          navigator.notification.alert(fssi);
                          
                          },
                          error:function(error,status){
                          
                          
                          }
                          });
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/apps/general.json",
                                 data:{'api_key':appId},
                                 cache: false,
                                 success:function(response1){
                                 console.log('**************123456*************'+response1.bar_color);
                                 console.log(JSON.stringify(response1));
                                 
                                 barcolor = 'bar-'+response1.bar_color;
                                 buttoncolor = 'button-'+response1.bar_color;
                                 $scope.bar_color=barcolor;
                                 
                                 $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                        success:function(response){
                                        bookAppwall = response;
                                        $ionicLoading.hide();
                                        $state.go('previewChapter1');
                                        },
                                        error:function(){
                                        $ionicLoading.hide();
                                       var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error})
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error})
                                 }
                                 });
                          
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                          }
                          });
                   }
                   
                   });

/* -----------------------------------------------------Login Page---------------------------------------------*/


control.controller('loginCtrl1',function($scope,$state,$ionicLoading,$http,$ionicActionSheet,$ionicPopup){
                   $scope.bar_color=barcolor;
                   localStorage.clear();
                   $('#userId').val('sai');
                   $('#password').val('password');
                   $scope.count = function(){
                   //    alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              $state.go('listView');
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Real Estate',content:data.error});
                          
                          });
                   };
                   

                   
                   
                   
                   
                   $scope.loginFtn = function(){
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   var userId = $('#userId').val();
                   var password = $('#password').val();
                   
                   
                   $http({method: "POST", url:'http://build.myappbuilder.com/api/login.json', cache: false, params:{'login':userId,'password':password}})
                   .success(function(response){
                            
                            appkeyResult = response;
//                            appkeyResult = response;
                            localStorage.sender_id = appkeyResult.id;
                            if(appkeyResult.username){
                            localStorage.appwallLoginData = appkeyResult.username;
                            }else{
                            localStorage.appwallLoginData = appkeyResult.name;
                            }
//                            appKey = response.api_key;
                            
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps.json', cache: false, params:{'api_key':response.api_key}})
                            .success(function(data, status){
                                     var logkey;
                                    
                                     for(var j=0;j<data.length;j++){
                                     
                                     if(data[j].api_key==defaultkey){
                                     logkey=data[j].api_key;
                                     }
                                     }
                                    
                                     if(logkey==defaultkey){
                                     $scope.count();
                                     $ionicLoading.hide();
                                     }
                                     else{
                                     $ionicLoading.hide();
                                    $ionicPopup.alert({title: 'Real Estate',content:"You are not authorised for this app!"});
                                     }
                                     })
                            .error(function(data, status) {
                                   $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                   $ionicLoading.hide();
                                   });
                           
                            
                            })
                   .error(function(error, status) {
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                          });
                   
                   
                   };
                   
                   $scope.cancelFtn =function(){
                   $state.go('editContent');
                   };
                   

                   });


control.controller('menuCtrl', function($scope, $state, $ionicModal,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appcreate = {};
                   
                   
                   
                   
                   $scope.createAppFtn = function(val){
                   $state.go('addBook');
                   
                   };
                   
                   $scope.addAppFtn = function(){
                   //                   alert($scope.appcreate.appkeys);
                   
                   var data = $scope.appcreate.appkeys;
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });

                   $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':$scope.appcreate.appkeys}})
                            .success(function(data, status){
                   
                   $http({method: "POST", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey,'title':'keys','value':$scope.appcreate.appkeys}})
                   .success(function(data, status){

                    
                           
                            appList=[];
                            
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     alert(JSON.stringify(data));
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              $state.go('listView');
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            alert(JSON.stringify(data));
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   alert(JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });

                            
                            })
                    
                   .error(function(data, status) {
                          alert(JSON.stringify(data));
                          $ionicLoading.hide();
                          });
                   })
                            .error(function(data, status) {
                                   alert('Invalid Key');
                                   $ionicLoading.hide();
                                   });
                   
                   };
                   
                  
                   
                   $scope.listViewBack = function(){
                   localStorage["login"] = [];
                       $state.go('login1');
                    
                   }
                   
                   });



/* -------------------------------------------------------------------- ListView ----------------------------------------*/



var bookTitle = '';
var bookDesc = '';
var bookImg = '';
var bookAppwall = '';

control.controller('listViewCtrl', function($scope, $state, $ionicModal,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.count = function(){
                   //                          appKey = response.api_key;
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     $ionicPopup.alert({title: 'Real Estate',content:data.error})
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              $scope.appKey = appList;
                                              $state.reload();
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({title: 'Real Estate',content:data.error})
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   $ionicPopup.alert({title: 'Real Estate',content:data.error})
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Real Estate',content:data.error})
                          
                          });
                   
                   };
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.AppEditor =false;
                   for(var i =0;i<appList.length;i++){
                   if(appList[i].splash_image == null){
                   appList[i].splash_image = "img/book.png";
                   }
                   }
                   //console.log(JSON.stringify(appList))
                   
                   $scope.appKey = appList;
                   console.log(appList);
                   
                   $scope.createBook = function(){
                   listGrid = 'list';
//                   $state.go("addBook");
                   $state.go("menu");
                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit){
                   
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });

                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(data){
                          for (var i = 0; i < data.length; i++) {
                          if(data[i].key=="fssi"){
                          fssi = data[i].value;
                          
                          }
                          else if(data[i].key=="url"){
                          shareurl = data[i].value;
                          }
                          }
                          //                          navigator.notification.alert(fssi);
                          
                          },
                          error:function(error,status){
                          
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                          }
                          });

                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                 success:function(response){
                                 bookAppwall = response;
                                 $ionicLoading.hide();
                                 $ionicScrollDelegate.scrollTop();
                                 chapterArray = [];
                                 for (var i = 0; i < buttonArray.length; i++) {
                                 if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                 chapterArray.push(buttonArray[i]);
                                 //alert("Hi : "+buttonArray[i].title)
                                 }else{
                                 //alert("Hello : "+buttonArray[i].title)
                                 }
                                 
                                 }
                                 

                                 $state.go('previewChapter');
                                 },
                                 error:function(){
                                 $ionicLoading.hide();
                                 alert("Failure");
                                 }
                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                          }
                          });
                   };
                   
                   $scope.listViewBack = function(){
                   localStorage["login"] = [];
                       $state.go('login1');
                    
                   }
                   
                   
                   $scope.editApp = function(appId,title,desc,appImg){
                   
                   appKey = appId;
                   bookTitle = title;
                   bookDesc = desc;
                   bookImg = appImg;
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(data){
                          
                          for (var i = 0; i < data.length; i++) {
                          
                          if(data[i].key=="fssi"){
                          fssi = data[i].value;
                          floatid = data[i].id;
                          }
                          else if(data[i].key=="url"){
                          shareurl = data[i].value;
                          shareurlid = data[i].id;
                          }
                          }
                          
                          
                          
                          $state.go('editBook');
                          
                          },
                          error:function(error,status){
                          
                         var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                          }
                          });
                   }
                   
                   
                   $scope.EditBook = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.deleteApp = function(appId,item){
                   if(appId==defaultkey){
                   alert('You cannot delete this root App!',function(){},item,'OK');
                   }
                   else{
                   var confirmPopup = $ionicPopup.confirm({
                                                          title: item,
                                                          template: 'Are you sure you want to delete this Listing?'
                                                          });
                   confirmPopup.then(function(res) {
                                     if(res) {
//                                     alert(appId);
                                     $ionicLoading.show({
                                                        content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                        animation: 'fade-in',
                                                        showBackdrop: true,
                                                        maxWidth: 200,
                                                        showDelay: 0
                                                        });
                                     
                                     
                                     $.ajax({
                                            type: "DELETE",
                                            url: "http://build.myappbuilder.com/api/apps.json",
                                            data:{'api_key':appkeyResult.api_key,'book_api_key':appId},
                                            cache: false,
                                            success:function(response){
                                            
                                            $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                            .success(function(reskey){
                                                     $ionicLoading.hide();
                                                     for(var j=0;j<reskey.length;j++){
                                                     if(reskey[j].value==appId){
//                                                     alert(reskey[j].id);
                                                     
                                                     $http({method: "DELETE", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey,'id':reskey[j].id}})
                                                     .success(function(data){
                                                             $scope.count();
                                                              
                                                              
                                                              })
                                                     .error(function(data, status) {
                                                            $ionicLoading.hide();
                                                            $ionicPopup.alert({title: 'Real Estate',content:data.error})
                                                            
                                                            });
                                                     
                                                     }
                                                     }
                                                     
                                                     
                                                     })
                                            .error(function(data, status) {
                                                   $ionicLoading.hide();
                                                   $ionicPopup.alert({title: 'Real Estate',content:data.error})
                                                   
                                                   });
                                            
                                            
                                            },
                                            error:function(data,status){
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({title: 'Real Estate',content:data.error})
                                            }
                                            });
                                     
                                     } else {
                                     console.log('You are not sure');
                                     }
                                     });
                   }
                   };
                   
                   
                   });


control.controller('listViewCtrl1', function($scope, $state, $ionicModal,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$ionicActionSheet){
                   
                   $scope.bar_color=barcolor;

                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.AppEditor =false;
                   for(var i =0;i<appList.length;i++){
                   if(appList[i].splash_image == null){
                   appList[i].splash_image = "img/book.png";
                   }
                   }
                   //console.log(JSON.stringify(appList))
                   
                   $scope.appKey = appList;
                   console.log(appList);
                   
                   $scope.createBook = function(){
                   listGrid = 'list';
                   $state.go("addBook");
                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit,desc,img){
                   
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   appDesc = desc;
                   appImg = img;
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/apps/general.json",
                                 data:{'api_key':appId},
                                 cache: false,
                                 success:function(response1){
                                 console.log('**************123456*************'+response1.bar_color);
                                 console.log(JSON.stringify(response1));
                                 
                                 barcolor = 'bar-'+response1.bar_color;
                                 buttoncolor = 'button-'+response1.bar_color;
                                 $scope.bar_color=barcolor;
                                 
                                 $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                        success:function(response){
                                        bookAppwall = response;
                                        $ionicLoading.hide();
                                        $state.go('previewChapter1');
                                        },
                                        error:function(){
                                        $ionicLoading.hide();
                                        var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:data.error})
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:data.error})
                                 }
                                 });
                          
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:data.error});
                          }
                          });
                   }
                   
                   $scope.listViewBack = function(){
                   localStorage["login"] = [];
                       $state.go('login1');
                    
                   }
                  
                   
                   });

/*--------------------------------------------------------------Add Book -----------------------------------------*/

control.controller('addBookCtrl',function($scope, $state,$ionicPopup,$ionicLoading,$ionicScrollDelegate,$http, $ionicActionSheet){
                   image = undefined;
                   
                   $ionicScrollDelegate.scrollTop();
                   //tinymce.init({selector:'textarea'});
                   $scope.appcreate = {};
                   $scope.book = {};
                   $scope.appcreate.url = "https://itunes.apple.com";
                   $scope.appcreate.fssi = false;
                   $scope.count = function(){
                   //    alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              $state.go('listView');
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Real Estate',content:data.error});
                          
                          });
                   };
                   
                   $scope.showActionsheet = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose Bar Color',
                                          buttons: [
                                                    { text: '<p><img src="img/light.png" style="align:left;"/>&nbsp;Light&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/stable.png" style=""/>&nbsp;Stable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/positive.png" style=""/>&nbsp;Positive&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/calm.png" style=""/>&nbsp;Calm&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/balanced.png" style=""/>&nbsp;Balanced&nbsp;</p>' },
                                                    { text: '<p><img src="img/energized.png" style=""/>&nbsp;Energized</p>' },
                                                    { text: '<p><img src="img/assertive.png" style=""/>&nbsp;Assertive&nbsp;</p>' },
                                                    { text: '<p><img src="img/royal.png" style=""/>&nbsp;Royal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/dark.png" style=""/>&nbsp;Dark&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          barcolor = 'bar-light';
                                          $scope.book.bar_color = 'light';
                                          $scope.button_color='button-light';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==1){
                                          barcolor = 'bar-stable';
                                          $scope.book.bar_color = 'stable';
                                          $scope.button_color='button-stable';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==2){
                                          barcolor = 'bar-positive';
                                          $scope.book.bar_color = 'positive';
                                          $scope.button_color='button-positive';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==3){
                                          barcolor = 'bar-calm';
                                          $scope.book.bar_color = 'calm';
                                          $scope.button_color='button-calm';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==4){
                                          barcolor = 'bar-balanced';
                                          $scope.book.bar_color = 'balanced';
                                          $scope.button_color='button-balanced';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==5){
                                          barcolor = 'bar-energized';
                                          $scope.book.bar_color = 'energized';
                                          $scope.button_color='button-energized';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==6){
                                          barcolor = 'bar-assertive';
                                          $scope.book.bar_color = 'assertive';
                                          $scope.button_color='button-assertive';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==7){
                                          barcolor = 'bar-royal';
                                          $scope.book.bar_color = 'royal';
                                          $scope.button_color='button-royal';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==8){
                                          barcolor = 'bar-dark';
                                          $scope.book.bar_color = 'dark';
                                          $scope.button_color='button-dark';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else{
                                          $state.reload();
                                          }
                                          
                                          return true;
                                          },
                                          destructiveButtonClicked: function() {
                                          console.log('DESTRUCT');
                                          return true;
                                          }
                                          });
                   };
                   
                   $scope.book.bar_color="assertive";
                   $scope.bar_color='bar-'+$scope.book.bar_color;
                   $scope.colors = ['light', 'stable', 'positive', 'calm', 'balanced', 'energized', 'assertive', 'royal', 'dark'];
                   $scope.change_bar_color = function(){
                   barcolor = 'bar-'+$scope.book.bar_color;
                   $scope.bar_color=barcolor;
                   $state.reload();
                   }
                   $scope.change_button_color = function(){
                   $scope.button_color = 'button-'+$scope.book.button_color;
                   $state.reload();
                   }
                   
                   $scope.change_bar_button_color = function(){
                   if($scope.book.bar_button_color == ""){
                   $scope.bar_button_color = 'button-clear';
                   $state.reload();
                   }
                   else{
                   $scope.bar_button_color = 'button-'+$scope.book.bar_button_color;
                   $state.reload();
                   }
                   }
                   
                   $scope.addBookBack = function(){
                   $state.go('listView');
                   
                   
                   }
                   $scope.goHome = function(){
                   $state.go('listView');
                   }
                   
                   
                   function readURL(input) {
                   if (input.files && input.files[0]) {
                   var reader = new FileReader();
                   
                   reader.onload = function (e) {
                   $('.file-input-wrapper > .btn-file-input').css('background-image', 'url('+e.target.result+')');
                   }
                   
                   reader.readAsDataURL(input.files[0]);
                   }
                   }
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                         
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper > .btn-file-input').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   
                  $("#bookImage").change(function(){
                                         readURL(this);
                                         });
                   
                   $scope.createAppFtn = function(){
                   if(($scope.appcreate.gridBookTitle) && ($('#bookImage').get(0).files[0])){
                    if(($scope.appcreate.url!='') && ($scope.appcreate.url!=undefined)){
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if($scope.appcreate.gridBookDesc==undefined){
                   $scope.appcreate.gridBookDesc='';
                   }

                   fssi = $scope.appcreate.fssi;
                   shareurl = $scope.appcreate.url;
                   
                   $.ajax({
                          type: "POST",
                          url: "http://build.myappbuilder.com/api/apps.json",
                          data:{'api_key':appkeyResult.api_key,'title':$scope.appcreate.gridBookTitle,'description':$scope.appcreate.gridBookDesc},
                          success:function(response){
                          //$ionicLoading.hide();
                          appKey = response.api_key;
                          appTitle = response.title;
                          
                          var booktype = new FormData();
                          booktype.append('api_key',appKey);
                          booktype.append('title',"AppType");
                          booktype.append('value','Real Estate');
                          $http.post('http://build.myappbuilder.com/api/book_custom_fields.json', booktype, {
                                     transformRequest: angular.identity,
                                     headers: {'Content-Type': undefined}
                                     }).
                          success(function(data, status, headers, config) {
                                  
                                  }).
                          error(function(data, status, headers, config) {
                                
                                });
                                
                          var booktype3 = new FormData();
                          booktype3.append('api_key',defaultkey);
                          booktype3.append('title',"keys");
                          booktype3.append('value',appKey);
                          $http.post('http://build.myappbuilder.com/api/book_custom_fields.json', booktype3, {
                                     transformRequest: angular.identity,
                                     headers: {'Content-Type': undefined}
                                     }).
                          success(function(data, status, headers, config) {
                                  
                                  }).
                          error(function(data, status, headers, config) {
                                
                                });
                          
                          var booktype1 = new FormData();
                          booktype1.append('api_key',appKey);
                          booktype1.append('title',"fssi");
                          booktype1.append('value',fssi);
                          $http.post('http://build.myappbuilder.com/api/book_custom_fields.json', booktype1, {
                                     transformRequest: angular.identity,
                                     headers: {'Content-Type': undefined}
                                     }).
                          success(function(data, status, headers, config) {
                                  
                                  }).
                          error(function(data, status, headers, config) {
                                
                                });
                          
                          var booktype2 = new FormData();
                          booktype2.append('api_key',appKey);
                          booktype2.append('title',"url");
                          booktype2.append('value',shareurl);
                          $http.post('http://build.myappbuilder.com/api/book_custom_fields.json', booktype2, {
                                     transformRequest: angular.identity,
                                     headers: {'Content-Type': undefined}
                                     }).
                          success(function(data, status, headers, config) {
                                  
                                  }).
                          error(function(data, status, headers, config) {
                                
                                });
                          
                                     var formData = new FormData();
                                     formData.append('api_key',appKey);
                                     formData.append('title',$scope.appcreate.gridBookTitle);
                                     formData.append('description',$scope.appcreate.gridBookDesc);
                                     formData.append('splash_image', $('#bookImage').get(0).files[0]);
                                     formData.append('bar_color', $scope.book.bar_color);
                          
                                     $.ajax({
                                           type: "PUT",
                                           url: "http://build.myappbuilder.com/api/apps/settings/general.json",
                                           data: formData,
                                           cache: false,
                                           contentType: false,
                                           processData: false,
                                           success:function(response){
                                           $ionicLoading.hide();
                          
                                           $scope.checkBox ={}
                                           if(localStorage.checkedData == "checkedData"){
                          
                                             $state.go('addChapter');
                                             // cordova.exec(function(e){},function(e){alert("Successfull");},"EchoimageUploads" , "echoimageUploads",["formDataKey","formDataId","NoImage"]);
                          
                                           }else{
                                              var myPopup = $ionicPopup.alert({
                                              template: '<div class="card"><div class="item item-text-wrap">Please Add App Category and Contents.</div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.data" value=""></label>Don\'t show Again</div></div>',
                                              title: appTitle,
                                              subTitle: 'Successfully created App Title! ',
                                              scope: $scope,
                          
                                            });
                                            myPopup.then(function(res) {
                                              console.log('Tapped!', $scope.checkBox.data);
                                              if($scope.checkBox.data == true){
                                               localStorage.checkedData = "checkedData";
                                              }
                                              myPopup.close();
                                              $state.go('addChapter');
                                              // cordova.exec(function(e){},function(e){alert("Successfull");},"EchoimageUploads" , "echoimageUploads",["formDataKey","formDataId","NoImage"]);
                                            });
                                           }
                                         },error:function(error){
                                           $ionicLoading.hide();
                                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                                         }
                                     });
                          },
                          error:function(error){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          
                         var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                          }
                          });
                      }else{
                   $ionicPopup.alert({title: 'Real Estate',content:"Enter Social Share URL"});
                   
                   }
                   }else{
                   $ionicPopup.alert({title: 'Real Estate',content:"Select Real Estate Image & Enter Real Estate Title"});
                   }
                   }
                   
                   });


var appChapter = '';
function readURL1(input) {
    
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+e.target.result+')');
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}





control.controller('addChapterCtrl',function($state,$scope,$ionicPopup,$ionicNavBarDelegate,$ionicLoading,$ionicScrollDelegate,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $ionicScrollDelegate.scrollTop();
                   $scope.Title = appTitle;
                   $scope.chaptercreate ={}
                   function addChapterConfirm(){
                   $state.go('addContent');
                   
                   
                   }
                   
                   $scope.addchapterBack = function(){
                   $state.go('addBook');
                   }
                   
                   
                  $("#buttonImage").change(function(){
                                           
                                           readURL1(this);
                                           });
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   $scope.buttonSubmitFtn = function(){
                   if(($scope.chaptercreate.title) && ($("#buttonImage").get(0).files[0])){
                   
                          var formData = new FormData();
                          formData.append('api_key',appKey);
                          formData.append('title',$scope.chaptercreate.title);
                          formData.append('image', $("#buttonImage").get(0).files[0]);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                                    
                              $.ajax({
                                  type: "POST",
                                  url: "http://build.myappbuilder.com/api/buttons.json",
                                  data: formData,
                                  cache: false,
                                  contentType: false,
                                  processData: false,
                                  success:function(response){
                                      $ionicLoading.hide();
                                      buttonId = response.id;
                                      appChapter = response.title;
                                      $scope.checkBox = {};
                                      if(localStorage.checkedData == "checkedData"){
                                        addChapterConfirm();
                                      }else{
                   
                                        var myPopup = $ionicPopup.alert({
                                           template: '<div class="card"><div class="item item-text-wrap">Please Add App Contents and Images.</div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.data" value=""></label>Don\'t show Again</div></div>',
                                           title: $scope.chaptercreate.title,
                                           subTitle: 'Successfully created App Category!',
                                           scope: $scope,
                   
                                        });
                                         myPopup.then(function(res) {
                                           console.log('Tapped!', $scope.checkBox.data);
                                           if($scope.checkBox.data == true){
                                            localStorage.checkedData = "checkedData";
                                           }
                   
                                           myPopup.close();
                                           addChapterConfirm();
                                        });
                                      }
                                  },
                                  error:function(error,status){
                                      $ionicLoading.hide();
                                      //alert("Successfully")
                                      var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                                  }
                              });
                   
                   }else{
                   $ionicLoading.hide();
                   $ionicPopup.alert({title: 'Listings',content:"Enter New Listing Title "});
                   }
                   }
                   });




control.controller('addContentCtrl',function($scope,$state,$ionicPopup,$sce,$ionicLoading,$ionicScrollDelegate,$http,$ionicModal,$ionicActionSheet){
                   image = undefined;
                   $scope.bar_color=barcolor;
                   $scope.addAgent = {
                   id : []
                   };
                   $scope.addagent={};
                   $scope.count = function(val){
                   //    alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     $ionicPopup.alert({title: 'Content',content:data.error});
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              myPopup = $ionicPopup.show({
                                                                         template: '<div class="list"><div class="item item-icon-right" ng-click="editContent();">'+$scope.appChapter+'<i class="icon ion-compose"></i></div><div class="item item-icon-right" ng-click="createContent();">Create New Content<i class="icon ion-ios7-plus"></i></div><div class="item item-icon-right" ng-click="createChapter();">Create New Listing<i class="icon ion-ios7-plus"></i></div><div class="item item-icon-left" ng-click="goToHome();"><i class="icon ion-home"></i>Realtors Home</div></div>',
                                                                         title: $scope.appChapter,
                                                                         subTitle: 'Successfully added Realtors Listing Content!',
                                                                         scope: $scope,
                                                                         
                                                                         });
                                              $scope.goToHome = function(){
                                              
                                              myPopup.close();
                                              $state.go('listView');
                                              
                                              }
                                              
                                              $scope.editContent = function(){
                                              editData = 'Edit';
                                              myPopup.close();
                                              }
                                              
                                              $scope.createChapter = function(){
                                              myPopup.close();
                                              chapterEdit = '';
                                              $state.go('addButton');
                                              }
                                              
                                              $scope.createContent = function(){
                   								myPopup.close();
                                              editData = 'notEdit';
                                              $scope.contentCreate.elementTitle = '';
                                              $scope.contentCreate.elementText = '';
                                              $scope.contentCreate.elementPrice = '';
                                              $scope.contentCreate.elementAdditional_field = '';
                                              $scope.contentCreate.elementHousecondition = '';
                                              $scope.contentCreate.elementTag = '';
                                              $scope.contentCreate.elementSquarefeet = '';
                                              $scope.contentCreate.elementAddress = '';
                                              elementId ='';
                                              contentTitle = '';
                                              $scope.buttonDeleteArray = [];
                                  $scope.agentslists = [];
                                  $state.go('addContent');
                   }
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({title: 'Content',content:data.error});
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   $ionicPopup.alert({title: 'Content',content:data.error});
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Content',content:data.error});
                          
                          });
                   };
                   
                   
                   var imageField_name;
                   
                   $ionicScrollDelegate.scrollTop();
                   var chapterTitletxt = appTitle+":"+appChapter;
                   
                   $scope.appChapter = chapterTitletxt;
                   $scope.contentCreate = {};
                   $scope.contentCreate.elementText = '';
                   
                   
                   if($('#elementTitle').val()){
                   $scope.videoChecked = false;
                   }else{
                   $scope.videoChecked = true;
                   }
                   
                   $scope.change = function(){
                   //alert($scope.contentCreate.elementTitle)
                   if($scope.contentCreate.elementTitle){
                   $scope.videoChecked = false;
                   }else{
                   $scope.videoChecked = true;
                   }
                   }
                   
                   $scope.deliberatelyTrustDangerousSnippet = function(url) {
                   return $sce.trustAsHtml(url);
                   };
                   
                   $scope.buttonDeletevideo = function(btnId){
                    var confirmPopup = $ionicPopup.confirm({
                                       title: 'Real Estate',
                                       template: 'Are you sure you want to delete this image?'
                                       });
                   confirmPopup.then(function(res) {
                                     if(res) {
                                     console.log('You are sure');
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $.ajax({
                          type: "DELETE",
                          url: "http://build.myappbuilder.com/api/elements/images.json",
                          data: {"api_key":appKey,"element_id":elementId,"id":btnId},
                          cache: false,
                          success:function(response){
                          $ionicLoading.hide();
                          $scope.imagelist();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                          } else {
                   console.log('You are not sure');
                   }
                   });
                   
                   }
                   
                   $scope.tinymceOptions = {
                   
                   
                   menubar: false,
                   theme: "modern",
                   plugins: [
                             "advlist autolink lists link image charmap print preview anchor",
                             "searchreplace wordcount visualblocks visualchars code fullscreen",
                             "insertdatetime table contextmenu ",
                             "emoticons textcolor"
                             ],
                   toolbar1: "insertfile undo redo | styleselect | bold italic | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify forecolor backcolor",
                   file_browser_callback: function(field_name, url, type, win) {
                   
                   $('#imageSelect1').click();
                   
                   imageField_name = field_name;
                   //alert($('input[name="width"]').val());
                   $('#width').blur(function(){
                                    if($('#width').val() == ''){
                                    $('#width').val("150");
                                    $('#height').val('');
                                    }else if($('#width').val() <= 300){
                                    }else{
                                    
                                    $('#width').val("150");
                                    $('#height').val('');
                                    }
                                    });
                   
                   
                   },
                   
                   image_advtab: true,
                   height: "200px",
                   width: "100%",
                   resize: false
                   };
                   
                   
                   $("#imageSelect1").change(function(){
                                             
                                             $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                                             
                                             var formDataKey ;
                                             var formDataId ;
                                             formDataKey = 'd4b2e8f5473bd5023797436ce9556620';
                                             formDataId = '2188';
                                             
                                             cordova.exec(function(e){
                                                          // alert(e)
                                                          $('#'+imageField_name).val(e);
                                                          $('#width').val("150");
                                                          $ionicLoading.hide();
                                                          },function(e){alert(e);$ionicLoading.hide();},"EchoimageUploads" , "echoimageUploads",[formDataKey,formDataId,"Image"]);
                                             
                                             
                                             });
                   
                   
                   
                   
                   $ionicModal.fromTemplateUrl('new_video.html',{
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.videoModal = modal;
                                                       });
                   $ionicModal.fromTemplateUrl('addnew_agent.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.addagentModal = modal;
                                                       });
                   
                   $ionicModal.fromTemplateUrl('new_agent.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.agentModal = modal;
                                                       });
                   
                   $ionicModal.fromTemplateUrl('new_audio.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.audioModal = modal;
                                                       });
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   $scope.showActionsheet2 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess2, onFail2, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess2, onFail2, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess2(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper6 > .btn-file-input6').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail2(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   $scope.agentavatar = function(val){
                   if(val!=null){
                   return val;
                   }
                   else{
                   return 'img/avatar.png'
                   }
                   };
                   
                   $scope.fncng = function(val){
                   $scope.fname = val;
                   }
                   $scope.lncng = function(val){
                   $scope.lname = val;
                   }
                   $scope.emcng = function(val){
                   $scope.email = val;
                   }
                   $scope.phcng = function(val){
                   $scope.phone = val;
                   }
                   
                   $scope.editagent = function(val1,val2,val3,val4,val5){
                   var name = val3.split("   ");
                   $scope.addagentModal.show();
                   $('.fname').val(name[0]);
                  $('.lname').val(name[1]);
                  $('.email').val(val4);
                  $('.phone').val(val5);
                   $scope.fname = name[0];
                   $scope.lname = name[1];
                   $scope.email = val4;
                   $scope.phone = val5;
                   agentmethod="PUT";
                   agentmethod="PUT";
                   agentid = val1;
                   if(val2==null){
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url("img/avatar.png")');
                   }
                   else{
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+val2+')');
                   }
                   
                  $("#tst").change(function(){
                                          readURL5(this);
                                          });
                   
                   };
                   
                   
                   $scope.addnewagentshowFtn = function(){
                   $scope.fname = '';
                   $scope.lname = '';
                   $scope.email = '';
                   $scope.phone = '';
                   $scope.addagentModal.show();
                   agentmethod="POST";
                   
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url(img/avatar.png)');

                   $('.fname').val('');
                  $('.lname').val('');
                  $('.email').val('');
                  $('.phone').val('');

                  $("#tst").change(function(){
                                          readURL5(this);
                                          });
                   
                   };

                   function readURL5(input) {
                                    if (input.files && input.files[0]) {
                   
                                    var reader = new FileReader();
                                    
                                    reader.onload = function (e) {
                                    $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+e.target.result+')');
                   
                                    }
                                    
                                    reader.readAsDataURL(input.files[0]);
                  
                                    }
                                    }
                   
                   $scope.agentUploadFtn = function(){
                   if($scope.contentCreate.elementTitle){
                   if(contentTitle){
                    $scope.elementCreateSubmitFtn1();
                   $scope.agentModal.show();
                   }else{
                   
                   contentTitle = $scope.contentCreate.elementTitle;
                   $scope.elementCreateSubmitFtn1();
                   $scope.agentModal.show();
                   }
                   
                   }else{
                   $ionicPopup.alert({title: 'Content',content:'Please Enter Your Content Title!'});
                   }
                   
                   };
                   
                   $scope.addagentFtn = function(){
                   console.log($scope.addAgent.id.length);
                   //                   $scope.addAgent.id = '';
                   if($scope.addAgent.id.length){
                   $scope.addAgentid = '';
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   for (var i = 0; i < $scope.addAgent.id.length; i++) {
                   if(i==0){
                   $scope.addAgentid = $scope.addAgent.id[i];
                   }
                   else{
                   $scope.addAgentid = $scope.addAgentid+","+$scope.addAgent.id[i];
                   }
                   }
                   console.log($scope.addAgentid);
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                          data: {"api_key":appKey,"id":elementId,"meta_keywords":$scope.addAgentid},
                          cache: false,
                          success:function(response){
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 //                          $ionicLoading.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 
                                 console.log("1122445566sduh"+$scope.agents.length);
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                        data: {"api_key":appKey,"id":elementId},
                                        cache: false,
                                        success:function(response){
                                        agentlist=[];
                                        
                                        var res = response.meta_keywords.split(",");
                                        console.log("1122445566337*******"+res);
                                        console.log("1122445566337*******"+res.length);
                                        for (var i = 0; i < res.length; i++) {
                                        //                                 alert(JSON.stringify(agentdata.length));
                                        for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                        //                                 alert(JSON.stringify($scope.agents[j]));
                                        if(res[i]==$scope.agents[j].id){
                                        
                                        agentlist.push($scope.agents[j]);
                                        }
                                        }
                                        }
                                        $scope.agentslists=agentlist;
                                        $state.reload();
                                        $ionicLoading.hide();
                                        console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                        console.log("1122445566337#########"+agentlist);
                                        alert('Selected agent(s) has been added succesfully!',function(){$scope.agentModal.hide();},chapterTitle,'Done');
                                        },
                                        error:function(error,status){
                                        $ionicLoading.hide();
                                        var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                        }
                                        });
                                 
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   }
                   else{
                   $ionicPopup.alert({title: 'Content',content:"Please select an Agent"});
                   }
                   
                   //                   alert($scope.addAgent.id);
                   };
                   

                   
                   
                   $scope.addnewagentFtn = function(){
                   
                    // alert($scope.addagent.fname);
                   $ionicLoading.show({
                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                                      });
                if($scope.fname!==""){
                   if($scope.email!==""){

                   if(agentmethod=="POST"){
                   // console.log($('#tst').get(0).files[0]);
                   if($('#tst').get(0).files[0]){
                   var formData11 = new FormData();
                   formData11.append('api_key',appKey);
                   formData11.append('subscriber[firstname]',$scope.fname);
                   formData11.append('subscriber[lastname]',$scope.lname);
                   formData11.append('subscriber[username]',$scope.email);
                   formData11.append('subscriber[email]',$scope.email);
                   formData11.append('subscriber[phone]',$scope.phone);
                  formData11.append('subscriber[avatar]',$('#tst').get(0).files[0]);
                   
                   
                   $http.post('http://build.myappbuilder.com/api/subscribers.json',formData11,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            agentid=response.id;
                                         
                                         $.ajax({
                                                type: "GET",
                                                url: "http://build.myappbuilder.com/api/subscribers.json",
                                                data: {"api_key":appKey},
                                                cache: false,
                                                success:function(response){
                                                $ionicLoading.hide();
                                                //                          $scope.imagelist();
                                                agentdata=response;
                                                $scope.agents=response;
                                                image = undefined;
                                                $scope.addagentModal.hide();
                                                $state.reload();
                                                
                                                },
                                                error:function(error,status){
                                                $ionicLoading.hide();
                                                var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                                }
                                                });
                                         
                                         
                            
                            })
                   .error(function(error,status,headers,config){
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          });
                   


                   }
                   else{
                   var formData11 = new FormData();
                   formData11.append('api_key',appKey);
                   ormData11.append('subscriber[firstname]',$scope.fname);
                   formData11.append('subscriber[lastname]',$scope.lname);
                   formData11.append('subscriber[username]',$scope.email);
                   formData11.append('subscriber[email]',$scope.email);
                   formData11.append('subscriber[phone]',$scope.phone);
                  // formData11.append('subscriber[avatar]',$('#tst').get(0).files[0]);
                   
                   
                   $http.post('http://build.myappbuilder.com/api/subscribers.json',formData11,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            agentid=response.id;
                            console.log(agentid);
                            $.ajax({
                                   type: "GET",
                                   url: "http://build.myappbuilder.com/api/subscribers.json",
                                   data: {"api_key":appKey},
                                   cache: false,
                                   success:function(response){
                                   $ionicLoading.hide();
                                   //                          $scope.imagelist();
                                   agentdata=response;
                                   $scope.agents=response;
                                   image = undefined;
                                   $state.reload();
                                   $scope.addagentModal.hide();
                                   
                                   },
                                   error:function(error,status){
                                   $ionicLoading.hide();
                                   var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                   }
                                   });
                            
                            
                            })
                   .error(function(error,status,headers,config){
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          });
                   
                   
                   
                   }
                   }
                   else if(agentmethod=="PUT"){

                   if($('#tst').get(0).files[0]){


                    $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey,"firstname":$scope.fname,"id":agentid,"lastname":$scope.lname,"username":$scope.email,"email":$scope.email,"phone":$scope.phone,"image":$('#tst').get(0).files[0]},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 $state.reload();
                                 $scope.addagentModal.hide();
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   
                   }
                   else{
                  
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey,"firstname":$scope.fname,"id":agentid,"lastname":$scope.lname,"username":$scope.email,"email":$scope.email,"phone":$scope.phone},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 $state.reload();
                                 $scope.addagentModal.hide();
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   }
                   }}
                   else{
                   $ionicLoading.hide();
                   $ionicPopup.alert({title: 'Content',content:'Please Enter a Valid Email'});
                   }
                   }
                   
                   else{
                   $ionicLoading.hide();
                   $ionicPopup.alert({title: 'Content',content:'Please Enter a Valid Name'});
                   }
                   
                   };
                  
                   
                   
                   $scope.videoUploadFtn = function(){
                   if($scope.contentCreate.elementTitle){
                   if(contentTitle){
                    $scope.elementCreateSubmitFtn1();
                   $scope.videoModal.show();
                   }else{
                   
                   contentTitle = $scope.contentCreate.elementTitle;
                   $scope.elementCreateSubmitFtn1();
                   $scope.videoModal.show();
                   }

                    $("#images").change(function(){
                                          readURL1(this);
                                          });
                   
                   }else{
                   $ionicPopup.alert({title: 'Content',content:'Please Enter Your Content Title!'});
                   }
                   }
                   
                   
                   
                   $scope.imagelist = function(){
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          console.log("*************"+JSON.stringify(response));
                          buttonArray = response;
                          contentVideo = '';
                          buttonDeleteArray = [];
                          //                          alert(chapterTitle+','+contentTitle);
                          for (var i = 0; i < buttonArray.length; i++) {
                          for (var j = 0; j < buttonArray[i].elements.length; j++) {
                          
                          if(elementId == buttonArray[i].elements[j].id){
                          if(buttonArray[i].first_paragraph_type == "default"){
                          console.log("*************"+JSON.stringify(buttonArray[i].elements[j].images));
                          $scope.buttonDeleteArray = buttonArray[i].elements[j].images;
                          
                          
                          }
                          }
                          }
                          }
                          
                          //                              $scope.buttonDeleteArray = buttonDeleteArray;
                          $state.reload();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   };
                   
                   
                   function readURL1(input) {
                   if (input.files && input.files[0]) {
                   var reader = new FileReader();
                   
                   reader.onload = function (e) {
                   $('.file-input-wrapper6 > .btn-file-input6').css('background-image', 'url('+e.target.result+')');
                   }
                   
                   reader.readAsDataURL(input.files[0]);
                   alert(e.target.result);
                   }
                   }
             
                   $scope.create_video = function(){
                   
//                   alert("error12: "+$('input[name="video"]').get(0).files[0]);
                   if($('#images').get(0).files[0]){
                   
                   for(var i=0;i<buttonArray.length;i++){
                   
                   if(buttonArray[i].id == buttonId ){
                   
                   var formData1 = new FormData();
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   var letter = (chapterTitle).charAt(0).toUpperCase();
                   
                   formData1.append('image', $('#images').get(0).files[0]);
                   $ionicLoading.show({
                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                                      });
                   
                    $http.post('http://build.myappbuilder.com/api/elements/images.json',formData1,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            console.log(JSON.stringify(response));

                                
                                $scope.videoModal.hide();
                                $ionicLoading.hide();
                                $scope.imagelist();
                            
                            
                            })
                   .error(function(error,status,headers,config){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          });
                   
                   }
                   }
                   }else{
                   
                   
                   var alertPopup = $ionicPopup.alert({
                                                      title: 'Realtors',
                                                      template: 'Please Choose Images!'
                                                      });
                   alertPopup.then(function(res) {
                                   //console.log('Thank you for not eating my delicious ice cream cone');
                                   });
                   
                   }
                   }
                   
                   $scope.addcontentBack = function(){
                   if(editData == "Edit"){
                   editData = "";
                   $state.go('previewSubTitle');
                   }else{
                   $state.go('previewSubTitle');
                   }
                   }
                   
                   $scope.elementCreateSubmitFtn1 = function(){
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   var datatag=$scope.contentCreate.elementTag;
                   if($scope.contentCreate.elementTag=='' || $scope.contentCreate.elementTag==undefined){
                   amenities='';
                   }
                   else{
                   for(var i=0;i<datatag.length;i++){
                   //                   amenities.push(response[i].name);
                   if(i==0){
                   amenities = datatag[i].text;
                   }
                   else{
                   amenities = amenities+','+datatag[i].text;
                   }
                   }
                   }
                   var formData1 = new FormData();
                   var formData2 = new FormData();
                   var formData3 = new FormData();
                   var formData4 = new FormData();
                   var formData5 = new FormData();
                   var formData6 = new FormData();
                   var methodData ='';
                   var urlData = '';
                   var myPopup
                   console.log("**************************"+$scope.contentCreate.elementAdditional_field);
                   
                   if(editData == 'Edit'){
                   urlData ='http://build.myappbuilder.com/api/elements/update_default.json'
                   methodData = "PUT"
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   editData = "";
                   }else{
                   urlData ='http://build.myappbuilder.com/api/elements/create_default.json'
                   methodData = "POST"
                   formData1.append('api_key',appKey);
                   formData1.append('button_id',buttonId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   }
                   
                   $.ajax({
                          type: methodData,
                          url: urlData,
                          data: formData1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          console.log(JSON.stringify(response))
                          elementId = response.id;
                          
                          if(methodData == "POST"){
                          
                          formData2.append('api_key',appKey);
                          formData2.append('element_id',elementId);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('element_id',elementId);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('element_id',elementId);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('id',elementId);
                          formData5.append('tags',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('element_id',elementId);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "Edit";
                                 buttonArray = response;
                                 //                                 $state.go('previewSubTitle');
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          }
                          else{
                          
                          formData2.append('api_key',appKey);
                          formData2.append('id',Square_Feetid);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('id',Addressid);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('id',House_Conditionid);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('element_id',elementId);
                          formData5.append('value',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('id',contentPriceid);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "Edit";
                                 buttonArray = response;
                                 //                                 $state.go('previewSubTitle');
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          }
                          
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          }
                          });
                   };
                   
                   var editData = "notEdit";
                   $scope.elementCreateSubmitFtn = function(){
//                   alert($scope.contentCreate.elementText);
                   if($scope.contentCreate.elementTitle==undefined){
                   $scope.contentCreate.elementTitle = '';
                   }
                   var datatag=$scope.contentCreate.elementTag;
                   console.log($scope.contentCreate.elementTag);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait...',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                if($scope.contentCreate.elementTag=='' || $scope.contentCreate.elementTag==undefined){
                   amenities='';
                   }
                   else{
                   for(var i=0;i<datatag.length;i++){
                   //                   amenities.push(response[i].name);
                   if(i==0){
                   amenities = datatag[i].text;
                   }
                   else{
                   amenities = amenities+','+datatag[i].text;
                   }
                   }
                   }
                   console.log("**************************"+amenities);
                   var formData1 = new FormData();
                   var formData2 = new FormData();
                   var formData3 = new FormData();
                   var formData4 = new FormData();
                   var formData5 = new FormData();
                   var formData6 = new FormData();
                   var methodData ='';
                   var urlData = ''
                   var myPopup;
                   console.log(elementId);
                   console.log($scope.contentCreate.tags);
                   
                   if(editData == "Edit"){
                   urlData ='http://build.myappbuilder.com/api/elements/update_default.json'
                   methodData = "PUT"
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }else{
                   urlData ='http://build.myappbuilder.com/api/elements/create_default.json'
                   methodData = "POST"
                   formData1.append('api_key',appKey);
                   formData1.append('button_id',buttonId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }
                   console.log(Square_Feetid);
                   console.log(JSON.stringify(formData2));
                   
                   
                   
                   $.ajax({
                          type: methodData,
                          url: urlData,
                          data: formData1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          //console.log(JSON.stringify(response));
                          elementId = response.id;
                          if(methodData == "POST"){
                          
                          formData2.append('api_key',appKey);
                          formData2.append('element_id',elementId);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('element_id',elementId);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('element_id',elementId);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('id',elementId);
                          formData5.append('tags',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('element_id',elementId);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "Edit";
                                 buttonArray = response;
                                 
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          }
                          else{
                          
                          formData2.append('api_key',appKey);
                          formData2.append('id',Square_Feetid);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('id',Addressid);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('id',House_Conditionid);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('element_id',elementId);
                          formData5.append('value',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('id',contentPriceid);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          }
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "";
                                 buttonArray = response;
                                 
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 $ionicLoading.hide();
                                 appList=[];
                                 $scope.count();
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          }
                          });
                   }
                   
                   });




var chapterTitle = '';
var chapterImage = '';
var chapterEdit = '';
control.controller('previewChapterCtrl', function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicSideMenuDelegate,$ionicActionSheet){
                   
                   $scope.bar_color=barcolor;
                   $scope.showfloat = fssi;
                   $scope.float1 = shareurl;
                   $scope.toggleLeft = function() {
                   $ionicSideMenuDelegate.toggleLeft();
                   };
                   
                   
                   $ionicScrollDelegate.scrollTop();
                   var chapterArray = [];
                   for (var i = 0; i < buttonArray.length; i++) {
                   if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                   chapterArray.push(buttonArray[i]);
                   //alert("Hi : "+buttonArray[i].title)
                   }else{
                   //alert("Hello : "+buttonArray[i].title)
                   }
                   
                   }
                   
                   $scope.items = chapterArray;
                   //alert(JSON.stringify($scope.items));
                   $scope.appTitle = appTitle;
                   $scope.AppEditor = false;
                   $scope.bar_color=barcolor;
                   $scope.count = function(val){
                   //    alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if(v < val){
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':data.apps[v].api_key},
                          cache: false,
                          success:function(response1){
                          console.log(response1.length);
                          console.log(JSON.stringify(response1));
                          console.log(v);
                          for(var j=0;j<response1.length;j++){
                          
                          if(response1[j].key=="AppType" && response1[j].value=="Real Estate"){
                          
                          appList.push(data.apps[v]);
                          }
                          
                          }
                          v++;
                          $scope.count(data.apps.length);
                          console.log(JSON.stringify(appList));
                          
                          },
                          error:function(error,status){
                          
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                          }
                          });
                   }
                   else{
                   $ionicLoading.hide();
                   v = 0;
                   localStorage["login"] = JSON.stringify(appkeyResult);
                   if(listGrid == ''){
                   $state.go('listView');
                   }else if(listGrid == 'list'){
                   $state.go('listView');
                   }else{
                   $state.go('listView');
                   }
                   }
                   };
                   $scope.preChapterBack = function(){
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/users.json",
                          data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                          cache: false,
                          success:function(response){
                          data = response;
                          // console.log(JSON.stringify(response));
                          $ionicLoading.hide();
                          appList=[];
                          
                          $scope.count(response.apps.length);
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                          }
                          });
                   
                   }
                   
                   
                   
                   $scope.appwallgoFun = function(){
                   $state.go('appWall');
                   }
                   
                   
                   
                   $scope.moveItem = function(item, fromIndex, toIndex) {
                   //Move the item in the array
                   $ionicLoading.show({
                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..'
                                      });
                   $scope.items.splice(fromIndex, 1);
                   $scope.items.splice(toIndex, 0, item);
                   var ids = $scope.items.map(function(btn){return btn.id});
                   
                   $http.post('http://build.myappbuilder.com/api/buttons/reorder.json', {api_key: appKey, ids: ids})
                   .success(function(data,status,headers,config){
                            $.ajax({
                                   type: "GET",
                                   url: "http://build.myappbuilder.com/api/buttons.json",
                                   data:{'api_key':appKey},
                                   cache: false,
                                   success:function(response){
                                   $ionicLoading.hide();
                                   console.log(JSON.stringify(response))
                                   buttonArray = response;
                                   
                                   },
                                   error:function(error,status){
                                   $ionicLoading.hide();
                                   var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                                   }
                                   });
                            //        $ionicLoading.hide();
                            })
                   .error(function(error,status,headers,config){
                          
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                          })
                   //console.log(item, fromIndex, toIndex)
                   };
                   
                   $scope.newChapterGo = function(){
                   chapterEdit = '';
                   $state.go('addButton');
                   }
                   
                   $scope.switchAppEditor = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.goHome = function(){
                   $state.go('listView');
                   }
                   
                   $scope.chapterClickFtn = function(id,title){
                   
                   buttonId = id;
                   chapterTitle = title;
                   $state.go('previewSubTitle');
                   }
                   
                   
                   $scope.deleteButton = function(id){
                   
                   var confirmPopup = $ionicPopup.confirm({
                                                          title: 'Chapter Delete!',
                                                          template: 'Are you sure you want to delete this Chapter?'
                                                          });
                   
                   confirmPopup.then(function(res,event) {
                                     
                                     if(res) {
                                     
                                     $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                                     $.ajax({
                                            type: "DELETE",
                                            url: "http://build.myappbuilder.com/api/buttons.json",
                                            data: {"api_key":appKey,"id":id},
                                            cache: false,
                                            success:function(response){
                                            $.ajax({
                                                   type: "GET",
                                                   url: "http://build.myappbuilder.com/api/buttons.json",
                                                   data:{'api_key':appKey},
                                                   cache: false,
                                                   success:function(response){
                                                   buttonArray= response;
                                                   chapterArray = [];
                                                   for (var i = 0; i < buttonArray.length; i++) {
                                                   if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                                   chapterArray.push(buttonArray[i]);
                                                   //alert("Hi : "+buttonArray[i].title)
                                                   }else{
                                                   //alert("Hello : "+buttonArray[i].title)
                                                   }
                                                   
                                                   }
                                                   $scope.items = chapterArray;
                                                   $state.reload();
                                                   setTimeout(function(){$ionicLoading.hide();}, 1000);
                                                   
                                                   },
                                                   error:function(error,status){
                                                   $ionicLoading.hide();
                                                   var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                                                   }
                                                   });
                                            },
                                            error:function(error,status){
                                            $ionicLoading.hide();
                                            var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                                            }
                                            });
                                     } else {
                                     
                                     }
                                     });
                   
                   
                   }
                   
                   $scope.editButton = function(id,title,image){
                   chapterEdit = 'Edit';
                   buttonId = id;
                   chapterTitle = title;
                   chapterImage = image;
                   $state.go('addButton');
                   }
                   
                   
                   
                   
                   
                   $scope.count = function(val){
                   //    alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if(v < val){
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':data.apps[v].api_key},
                          cache: false,
                          success:function(response1){
                          console.log(response1.length);
                          console.log(JSON.stringify(response1));
                          console.log(v);
                          for(var j=0;j<response1.length;j++){
                          
                          if(response1[j].key=="AppType" && response1[j].value=="Real Estate"){
                          
                          appList.push(data.apps[v]);
                          }
                          
                          }
                          v++;
                          $scope.count(data.apps.length);
                          console.log(JSON.stringify(appList));
                          
                          },
                          error:function(error,status){
                          
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                          }
                          });
                   }
                   else{
                   $ionicLoading.hide();
                   v = 0;
                   
                   $state.reload();
                   }
                   };
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.AppEditor =false;
                   for(var i =0;i<appList.length;i++){
                   if(appList[i].splash_image == null){
                   appList[i].splash_image = "img/book.png";
                   }
                   }
                   //console.log(JSON.stringify(appList))
                   
                   $scope.appKey = appList;
                   console.log(appList);
                   
                   $scope.createBook = function(){
                   listGrid = 'list';
                   $state.go("addBook");
                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit){
                   $ionicSideMenuDelegate.toggleLeft();
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });

                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(data){
                          for (var i = 0; i < data.length; i++) {
                          if(data[i].key=="fssi"){
                          fssi = data[i].value;
                          
                          }
                          else if(data[i].key=="url"){
                          shareurl = data[i].value;
                          
                          }
                          }
                          
                          $scope.showfloat = fssi;
                          $scope.float1 = shareurl;
                          
                          },
                          error:function(error,status){
                          
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                          
                          }
                          });

                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;

                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/apps/general.json",
                                 data:{'api_key':appId},
                                 cache: false,
                                 success:function(response1){
                                 console.log('**************123456*************'+response1.bar_color);
                                 console.log(JSON.stringify(response1));
                                 
                                 barcolor = 'bar-'+response1.bar_color;
                                 $scope.bar_color=barcolor;
                                 
                                 $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                 success:function(response){
                                 bookAppwall = response;
                                 $ionicLoading.hide();
                                 $ionicScrollDelegate.scrollTop();
                                 var chapterArray = [];
                                 for (var i = 0; i < buttonArray.length; i++) {
                                 if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                 chapterArray.push(buttonArray[i]);
                                 //alert("Hi : "+buttonArray[i].title)
                                 }else{
                                 //alert("Hello : "+buttonArray[i].title)
                                 }
                                 
                                 }
                                 
                                 $scope.items = chapterArray;
                                 //alert(JSON.stringify($scope.items));
                                 $scope.appTitle = appTitle;
                                 $scope.AppEditor = false;
                                 $state.go('previewChapter');
                                 },
                                 error:function(error){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                                 }
                                 });
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                                 }
                                 });
                          
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                          }
                          });
                   }
                   
                   $scope.listViewBack = function(){
                   localStorage["login"] = [];
                       $state.go('login1');
                    
                   }
                   
                   
                   
                   $scope.editApp = function(appId,title,desc,appImg){
                   
                   appKey = appId;
                   bookTitle = title;
                   bookDesc = desc;
                   bookImg = appImg;
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(data){
                          
                          for (var i = 0; i < data.length; i++) {
                          
                          if(data[i].key=="fssi"){
                          fssi = data[i].value;
                          floatid = data[i].id;
                          }
                          else if(data[i].key=="url"){
                          shareurl = data[i].value;
                          shareurlid = data[i].id;
                          }
                          }
                          
                          
                          
                          $state.go('editBook');
                          
                          },
                          error:function(error,status){
                          
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                          
                          }
                          });
                   }
                   
                   
                   $scope.EditBook = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.deleteApp = function(appId,item){
                   var confirmPopup = $ionicPopup.confirm({
                                                          title: 'Real Estate Delete!',
                                                          template: 'Are you sure you want to delete this Real Estate?'
                                                          });
                   confirmPopup.then(function(res) {
                                     if(res) {
                                     $ionicLoading.show({
                                                        content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                        animation: 'fade-in',
                                                        showBackdrop: true,
                                                        maxWidth: 200,
                                                        showDelay: 0
                                                        });
                                     
                                     $.ajax({
                                            type: "DELETE",
                                            url: "http://build.myappbuilder.com/api/apps.json",
                                            data:{'api_key':appkeyResult.api_key,'book_api_key':appId},
                                            cache: false,
                                            success:function(response){
                                            
                                            //console.log(JSON.stringify(response));
                                            $.ajax({
                                                   type: "GET",
                                                   url: "http://build.myappbuilder.com/api/users.json",
                                                   data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                   cache: false,
                                                   success:function(response){
                                                   data = response;
                                                   // console.log(JSON.stringify(response));
                                                   $ionicLoading.hide();
                                                   appList=[];
                                                   
                                                   $scope.appKey.splice($scope.appKey.indexOf(item), 1);
                                                   $scope.count(response.apps.length);
                                                   
                                                   },
                                                   error:function(error,status){
                                                   $ionicLoading.hide();
                                                   var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                                                   }
                                                   });
                                            },
                                            error:function(error,status){
                                            $ionicLoading.hide();
                                            var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                                            }
                                            });
                                     
                                     } else {
                                     console.log('You are not sure');
                                     }
                                     });
                   }
                   
                   
                   });

control.controller('agentsCtrl', function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicSideMenuDelegate,$ionicActionSheet){
                   
                   $scope.bar_color=barcolor;
                   $ionicModal.fromTemplateUrl('agentdetail.html',{
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.agentdetailModal = modal;
                                                       });


                   
                   $scope.AgentBack = function() {
                   $state.go('previewChapter1');
                   };
                   $scope.agentavatar = function(val){
                   if(val!=null){
                   return val;
                   }
                   else{
                   return 'img/avatar.png'
                   }
                   };
                   
                   $scope.showdetails = function(val1,val2,val3,val4) {
//                   alert(val1);
                   $scope.avatar=val1;
                   $scope.name=val2;
                   $scope.email=val3;
                   $scope.phone=val4;
                   $scope.agentdetailModal.show();
                   };
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          $state.reload();
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                          }
                          });
                   });

control.controller('previewChapterCtrl1', function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicSideMenuDelegate,$ionicActionSheet){
                   
                   $scope.bar_color=barcolor;
                   $scope.button_color=buttoncolor;
                   $scope.showfloat = fssi;
                   $scope.float1 = shareurl;
                   $scope.toggleLeft = function() {
                   $ionicSideMenuDelegate.toggleLeft();
                   };
                   
                   $scope.toggleRight = function() {
                   $ionicSideMenuDelegate.toggleRight();
                   };
                   
                   
                   $scope.agentgo = function() {
                   $state.go('agents');
                   };
                   
                   
                   $ionicScrollDelegate.scrollTop();
                   var chapterArray = [];
                   for (var i = 0; i < buttonArray.length; i++) {
                   if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                   chapterArray.push(buttonArray[i]);
                   //alert("Hi : "+buttonArray[i].title)
                   }else{
                   //alert("Hello : "+buttonArray[i].title)
                   }
                   
                   }
                   
                   $scope.items = chapterArray;
                   //alert(JSON.stringify($scope.items));
                   $scope.appTitle = appTitle;
                   $scope.appImg = appImg;
                   $scope.appDesc = appDesc;
                   $scope.AppEditor = false;
                   $scope.bar_color=barcolor;

                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          $state.reload();
                          console.log("1122445566sduh"+$scope.agents.length);

                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                          }
                          });
                   
                   
                   
                   $scope.appwallgoFun = function(){
                   $state.go('appWall1');
                   }
                   
                   
                   $scope.switchAppEditor = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.goHome = function(){
                   $state.go('listView1');
                   }
                   
                   $scope.chapterClickFtn = function(id,title){
                   buttonId = id;
                   chapterTitle = title;
                   for (var i = 0; i < buttonArray.length; i++) {
                   if(buttonId == buttonArray[i].id){
                   elementArray = buttonArray[i].elements;
                   console.log(JSON.stringify(buttonArray[i].elements));
                   }
                   }
                   if(elementArray.length==1){
                   $scope.subTitClickFtn(elementArray[0].id,elementArray[0].title);
                   }
                   else{
                   $state.go('previewSubTitle1');
                   }
                   
                   }
                   
                   $scope.subTitClickFtn = function(id,title){
                   amenities=[];
                   elementId = id;
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data:{'api_key':appKey,'id':elementId},
                          cache: false,
                          success:function(response){
                          for(var i=0;i<response.length;i++){
                          amenities.push(response[i].name);
                          
                          }
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                          }
                          });
                   for (var i = 0; i < elementArray.length; i++) {
                   if(id == elementArray[i].id){
                   
                   contentText = elementArray[i].text;
                   contentTitle = elementArray[i].title;
                   //        contentPrice = elementArray[i].price;
                   imagelist = elementArray[i].images;
                   
                   
                   contentAdditional_field = elementArray[i].additional_field;
                   if(elementArray[i].custom_values[0].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[0].value;
                   House_Conditionid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[0].value;
                   Square_Feetid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Address"){
                   Address = elementArray[i].custom_values[0].value;
                   Addressid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Price"){
                   contentPrice = elementArray[i].custom_values[0].value;
                   contentPriceid = elementArray[i].custom_values[0].id;
                   }
                   
                   if(elementArray[i].custom_values[1].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[1].value;
                   House_Conditionid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[1].value;
                   Square_Feetid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Address"){
                   Address = elementArray[i].custom_values[1].value;
                   Addressid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Price"){
                   contentPrice = elementArray[i].custom_values[1].value;
                   contentPriceid = elementArray[i].custom_values[1].id;
                   }
                   
                   if(elementArray[i].custom_values[2].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[2].value;
                   House_Conditionid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[2].value;
                   Square_Feetid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Address"){
                   Address = elementArray[i].custom_values[2].value;
                   Addressid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Price"){
                   contentPrice = elementArray[i].custom_values[2].value;
                   contentPriceid = elementArray[i].custom_values[2].id;
                   }
                   
                   if(elementArray[i].custom_values[3].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[3].value;
                   House_Conditionid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[3].value;
                   Square_Feetid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Address"){
                   Address = elementArray[i].custom_values[3].value;
                   Addressid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Price"){
                   contentPrice = elementArray[i].custom_values[3].value;
                   contentPriceid = elementArray[i].custom_values[3].id;
                   }
                   
                   
                   }
                   }
                   console.log(Square_Feet);
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   for (var j = 0; j < buttonArray[i].elements.length; j++) {
                   
                   if((chapterTitle == buttonArray[i].title) && (contentTitle == buttonArray[i].elements[j].title)){
                   if(buttonArray[i].first_paragraph_type == "video"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].video.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].video.thumbnail+');background-size:100% 100%;"><div align="center"><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<video src="'+buttonArray[i].elements[0].video.url+'" controls="" style="cursor: default; "></video><br />' ;
                   }else if(buttonArray[i].first_paragraph_type == "audio"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].audio.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].audio.thumbnail+');background-size:100% 100%;"><div align="center" ><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<audio src="'+buttonArray[i].elements[0].audio.url+'" controls="" style="cursor: default; "></audio><br />' ;
                   }
                   }
                   }
                   }
                   //alert(contentVideo)
                   $state.go('previewContent1');
                   }
                   
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.AppEditor =false;
                   for(var i =0;i<appList.length;i++){
                   if(appList[i].splash_image == null){
                   appList[i].splash_image = "img/book.png";
                   }
                   }
                   //console.log(JSON.stringify(appList))
                   
                   $scope.appKey = appList;
                   console.log(appList);
                   

                   
                   $scope.listViewClickFtn = function(appId,appTit,desc,img){
                   
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   appDesc = desc;
                   appImg = img;
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });

                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(data){
                          for (var i = 0; i < data.length; i++) {
                          if(data[i].key=="fssi"){
                          fssi = data[i].value;
                          
                          }
                          else if(data[i].key=="url"){
                          shareurl = data[i].value;
                         
                          }
                          }
                          
                          $scope.showfloat = fssi;
                          $scope.float1 = shareurl;
                          
                          },
                          error:function(error,status){
                          
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                          }
                          });

                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/apps/general.json",
                                 data:{'api_key':appId},
                                 cache: false,
                                 success:function(response1){
                                 console.log('**************123456*************'+response1.bar_color);
                                 console.log(JSON.stringify(response1));
                                 
                                 barcolor = 'bar-'+response1.bar_color;
                                 buttoncolor = 'button-'+response1.bar_color;
                                 $scope.bar_color=barcolor;
                                 $scope.button_color=buttoncolor;
                                 
                                 $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                        success:function(response){
                                        bookAppwall = response;
                                        $ionicLoading.hide();
                                        $ionicScrollDelegate.scrollTop();
                                        var chapterArray = [];
                                        for (var i = 0; i < buttonArray.length; i++) {
                                        if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                        chapterArray.push(buttonArray[i]);
                                        //alert("Hi : "+buttonArray[i].title)
                                        }else{
                                        //alert("Hello : "+buttonArray[i].title)
                                        }
                                        
                                        }
                                        
                                        $scope.items = chapterArray;
                                        //alert(JSON.stringify($scope.items));
                                        $scope.appTitle = appTitle;
                                        $scope.appImg = appImg;
                                        $scope.appDesc = appDesc;
                                        $scope.AppEditor = false;
                                        $.ajax({
                                               type: "GET",
                                               url: "http://build.myappbuilder.com/api/subscribers.json",
                                               data: {"api_key":appKey},
                                               cache: false,
                                               success:function(response){
                                               //                          $ionicLoading.hide();
                                               //                          $scope.imagelist();
                                               agentdata=response;
                                               $scope.agents=response;
                                               $state.go('previewChapter1');
                                               console.log("1122445566sduh"+$scope.agents.length);
                                               
                                               
                                               },
                                               error:function(error,status){
                                               $ionicLoading.hide();
                                               var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                                               }
                                               });
                                        
                                        },
                                        error:function(error){
                                        $ionicLoading.hide();
                                        var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error})
                                 }
                                 });
                          
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                          }
                          });
                   }
                   
                   $scope.listViewBack = function(){
                   localStorage["login"] = [];
                       $state.go('login1');
                    
                   }
                   
                   
                   
                   
                   });


var contentTitle = '';
var contentText = '';
var contentImages = '';
var contentPrice = '';
var contentAdditional_field = '';
var amenities=[];
var House_Conditionid = '';
var Addressid = '';
var Square_Feetid = '';
var contentPriceid = '';
var House_Condition = '';
var Address = '';
var Square_Feet = '';
var contentVideo = "";
var imagelist=[];
control.controller('previewSubTitleCtrl',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.showfloat = fssi;
                   $scope.float1 = shareurl;
                   contentVideo = "";
                   if(bookAppwall.button_wall == '0'){
                   $scope.buttonAppWall = false;
                   }else if(bookAppwall.button_wall == '1'){
                   $scope.buttonAppWall = true;
                   }
                   
                   $ionicScrollDelegate.scrollTop();
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   if(buttonId == buttonArray[i].id){
                   elementArray = buttonArray[i].elements;
                   console.log(JSON.stringify(buttonArray[i].elements));
                   }
                   }
                   //console.log(contentVideo.length);
                   
                   
                   $scope.elementArray = elementArray;
                   $scope.appTitle = appTitle;
                   $scope.chapterTitle = chapterTitle;
                   $scope.AppEditor = false;
                   
                   $scope.switchAppEditor = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.newContentGo = function(){
                   elementId ='';
                   contentTitle = '';
                   $state.go('addElement');
                   }
                   
                   $scope.subTitileBack = function(){
                   $state.go('previewChapter');
                   }
                   
                   $scope.goHome = function(){
                   $state.go('listView');
                   }
                   
                   $scope.subTitClickFtn = function(id,title){
                   amenities=[];
                   elementId = id;
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data:{'api_key':appKey,'id':elementId},
                          cache: false,
                          success:function(response){
                          for(var i=0;i<response.length;i++){
                          amenities.push(response[i].name);
                          
                          }
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Contents',content:error.error});
                          }
                          });
                   for (var i = 0; i < elementArray.length; i++) {
                   if(id == elementArray[i].id){
                   
                   contentText = elementArray[i].text;
                   contentTitle = elementArray[i].title;
                   //        contentPrice = elementArray[i].price;
                   imagelist = elementArray[i].images;
                   
                   
                   contentAdditional_field = elementArray[i].additional_field;
                   if(elementArray[i].custom_values[0].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[0].value;
                   House_Conditionid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[0].value;
                   Square_Feetid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Address"){
                   Address = elementArray[i].custom_values[0].value;
                   Addressid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Price"){
                   contentPrice = elementArray[i].custom_values[0].value;
                   contentPriceid = elementArray[i].custom_values[0].id;
                   }
                   
                   if(elementArray[i].custom_values[1].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[1].value;
                   House_Conditionid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[1].value;
                   Square_Feetid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Address"){
                   Address = elementArray[i].custom_values[1].value;
                   Addressid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Price"){
                   contentPrice = elementArray[i].custom_values[1].value;
                   contentPriceid = elementArray[i].custom_values[1].id;
                   }
                   
                   if(elementArray[i].custom_values[2].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[2].value;
                   House_Conditionid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[2].value;
                   Square_Feetid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Address"){
                   Address = elementArray[i].custom_values[2].value;
                   Addressid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Price"){
                   contentPrice = elementArray[i].custom_values[2].value;
                   contentPriceid = elementArray[i].custom_values[2].id;
                   }
                   
                   if(elementArray[i].custom_values[3].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[3].value;
                   House_Conditionid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[3].value;
                   Square_Feetid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Address"){
                   Address = elementArray[i].custom_values[3].value;
                   Addressid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Price"){
                   contentPrice = elementArray[i].custom_values[3].value;
                   contentPriceid = elementArray[i].custom_values[3].id;
                   }
                   
                   
                   }
                   }
                   console.log(Square_Feet);
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   for (var j = 0; j < buttonArray[i].elements.length; j++) {
                   
                   if((chapterTitle == buttonArray[i].title) && (contentTitle == buttonArray[i].elements[j].title)){
                   if(buttonArray[i].first_paragraph_type == "video"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].video.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].video.thumbnail+');background-size:100% 100%;"><div align="center"><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<video src="'+buttonArray[i].elements[0].video.url+'" controls="" style="cursor: default; "></video><br />' ;
                   }else if(buttonArray[i].first_paragraph_type == "audio"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].audio.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].audio.thumbnail+');background-size:100% 100%;"><div align="center" ><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<audio src="'+buttonArray[i].elements[0].audio.url+'" controls="" style="cursor: default; "></audio><br />' ;
                   }
                   }
                   }
                   }
                   //alert(contentVideo)
                   $state.go('previewContent');
                   }
                   
                   
                   $scope.deleteContent = function(id){
                   
                   elementId = id;
                   var confirmPopup = $ionicPopup.confirm({
                                                          title: 'Real Estate Content Delete!',
                                                          template: 'Are you sure you want to delete this Real Estate Content?'
                                                          });
                   confirmPopup.then(function(res) {
                                     if(res) {
                                     $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                                     $.ajax({
                                            type: "DELETE",
                                            url: "http://build.myappbuilder.com/api/elements.json",
                                            data: {"api_key":appKey,"id":elementId},
                                            cache: false,
                                            success:function(response){
                                            $.ajax({
                                                   type: "GET",
                                                   url: "http://build.myappbuilder.com/api/buttons.json",
                                                   data:{'api_key':appKey},
                                                   cache: false,
                                                   success:function(response){
                                                   buttonArray = response;
                                                   $ionicLoading.hide();
                                                   $state.go('previewChapter');
                                                   
                                                   },
                                                   error:function(error,status){
                                                   $ionicLoading.hide();
                                                   var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Contents',content:error.error});
                                                   }
                                                   });
                                            },
                                            error:function(error,status){
                                            $ionicLoading.hide();
                                            var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Contents',content:error.error})
                                            }
                                            });
                                     } else {
                                     console.log('You are not sure');
                                     }
                                     });
                   
                   
                   }
                   
                   $scope.buttonAppwallgoFun = function(){
                   $state.go('buttonAppWall');
                   }
                   
                   
                   });

control.controller('previewSubTitleCtrl1',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.showfloat = fssi;
                   $scope.float1 = shareurl;
                   contentVideo = "";
                   if(bookAppwall.button_wall == '0'){
                   $scope.buttonAppWall = false;
                   }else if(bookAppwall.button_wall == '1'){
                   $scope.buttonAppWall = true;
                   }
                   
                   $ionicScrollDelegate.scrollTop();
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   if(buttonId == buttonArray[i].id){
                   elementArray = buttonArray[i].elements;
                   console.log(JSON.stringify(buttonArray[i].elements));
                   }
                   }
                   //console.log(contentVideo.length);
                   
                   
                   $scope.elementArray = elementArray;
                   $scope.appTitle = appTitle;
                   $scope.chapterTitle = chapterTitle;
                   $scope.AppEditor = false;
                   
                   $scope.switchAppEditor = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   
                   $scope.subTitileBack = function(){
                   $state.go('previewChapter1');
                   }
                   
                   $scope.goHome = function(){
                   $state.go('previewChapter1');
                   }
                   
                   $scope.subTitClickFtn = function(id,title){
                   amenities=[];
                   elementId = id;
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data:{'api_key':appKey,'id':elementId},
                          cache: false,
                          success:function(response){
                          for(var i=0;i<response.length;i++){
                          amenities.push(response[i].name);
                          
                          }
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Contents',content:error.error});
                          }
                          });
                   for (var i = 0; i < elementArray.length; i++) {
                   if(id == elementArray[i].id){
                   
                   contentText = elementArray[i].text;
                   contentTitle = elementArray[i].title;
                   //        contentPrice = elementArray[i].price;
                   imagelist = elementArray[i].images;
                   
                   
                   contentAdditional_field = elementArray[i].additional_field;
                   if(elementArray[i].custom_values[0].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[0].value;
                   House_Conditionid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[0].value;
                   Square_Feetid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Address"){
                   Address = elementArray[i].custom_values[0].value;
                   Addressid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Price"){
                   contentPrice = elementArray[i].custom_values[0].value;
                   contentPriceid = elementArray[i].custom_values[0].id;
                   }
                   
                   if(elementArray[i].custom_values[1].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[1].value;
                   House_Conditionid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[1].value;
                   Square_Feetid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Address"){
                   Address = elementArray[i].custom_values[1].value;
                   Addressid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Price"){
                   contentPrice = elementArray[i].custom_values[1].value;
                   contentPriceid = elementArray[i].custom_values[1].id;
                   }
                   
                   if(elementArray[i].custom_values[2].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[2].value;
                   House_Conditionid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[2].value;
                   Square_Feetid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Address"){
                   Address = elementArray[i].custom_values[2].value;
                   Addressid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Price"){
                   contentPrice = elementArray[i].custom_values[2].value;
                   contentPriceid = elementArray[i].custom_values[2].id;
                   }
                   
                   if(elementArray[i].custom_values[3].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[3].value;
                   House_Conditionid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[3].value;
                   Square_Feetid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Address"){
                   Address = elementArray[i].custom_values[3].value;
                   Addressid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Price"){
                   contentPrice = elementArray[i].custom_values[3].value;
                   contentPriceid = elementArray[i].custom_values[3].id;
                   }
                   
                   
                   }
                   }
                   
                   $state.go('previewContent1');
                   }
                   
                   
                   
                   $scope.buttonAppwallgoFun = function(){
                   $state.go('buttonAppWall1');
                   }
                   
                   });

var editData = '';
function videoPaly(videoId){
    cordova.exec(null, null, "Echo", "echo", [videoId,"YES"]);
}

control.controller('previewContentCtrl',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$sce,$http,$ionicActionSheet,$ionicPopup){
                   $scope.bar_color=barcolor;
                   $scope.showfloat = fssi;
                   $scope.float1 = shareurl;
                   console.log('953697***'+appKey);
                   console.log('953697***'+contentPrice);
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data: {"api_key":appKey,"id":elementId},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          
                          $scope.contentTags = response;
                          $state.reload();
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          alert("error123: "+error.responseText);
                          }
                          });
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          
                          console.log("1122445566sduh"+$scope.agents.length);
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                 data: {"api_key":appKey,"id":elementId},
                                 cache: false,
                                 success:function(response){
                                 agentlist=[];
                                 
                                 var res = response.meta_keywords.split(",");
                                 console.log("1122445566337*******"+res);
                                 console.log("1122445566337*******"+res.length);
                                 for (var i = 0; i < res.length; i++) {
                                 //                                 alert(JSON.stringify(agentdata.length));
                                 for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                 //                                 alert(JSON.stringify($scope.agents[j]));
                                 if(res[i]==$scope.agents[j].id){
                                 
                                 agentlist.push($scope.agents[j]);
                                 }
                                 }
                                 }
                                 $scope.agentslists=agentlist;
                                 $state.reload();
                                 console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                 console.log("1122445566337#########"+agentlist);
                                 },
                                 error:function(error,status){
                                 
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          //                          $state.reload();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   
                   
                   if(bookAppwall.element_wall == '0'){
                   $scope.elementAppWall = false;
                   }else if(bookAppwall.element_wall == '1'){
                   $scope.elementAppWall = true;
                   }
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.appTitle = appTitle;
                   $scope.contentTitle = contentTitle;
                   $scope.contentText = contentText;
                   $scope.contentPrice = contentPrice;
                   $scope.contentSquarefeet = Square_Feet;
                   $scope.contentAddress = Address;
                   $scope.contentHousecondition = House_Condition;
                   $scope.contentAdditional_field = contentAdditional_field;
                   //  $scope.contentTags = amenities;
                   $scope.contentVideo = contentVideo;
                   $scope.buttonDeleteArray = imagelist;
                   $scope.deliberatelyTrustDangerousSnippet = function() {
                   return $sce.trustAsHtml($scope.contentText);
                   };
                   
                   $scope.deliberatelyTrustDangerousSnippet1 = function() {
                   return $sce.trustAsHtml($scope.contentVideo);
                   };
                   
                   $scope.agentavatar = function(val){
                   if(val!=null){
                   return val;
                   }
                   else{
                   return 'img/avatar.png'
                   }
                   };
                   
                   $scope.goHome = function(){
                   $state.go('listView');
                   }
                   
                   $scope.preContentBack = function(){
                   $state.go('previewSubTitle');
                   }
                   
                   $scope.switchAppEditor = function(){
                   editData = 'Edit';
                   $state.go('addElement');
                   }
                   
                   $scope.addcontentBack = function(){
                   $state.go('previewSubTitle');
                   }
                   
                   
                   $scope.elementAppwallgoFun = function(){
                   $state.go('elementAppWall');
                   }
                   
                   
                   });


control.controller('previewContentCtrl1',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$sce,$http,$ionicActionSheet,$ionicPopup){
                   $scope.bar_color=barcolor;
                   $scope.showfloat = fssi;
                   $scope.float1 = shareurl;
                   console.log('953697***'+appKey);
                   console.log('953697***'+contentPrice);
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data: {"api_key":appKey,"id":elementId},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          
                          $scope.contentTags = response;
                          $state.reload();
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          alert("error123: "+error.responseText);
                          }
                          });
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          
                          console.log("1122445566sduh"+$scope.agents.length);
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                 data: {"api_key":appKey,"id":elementId},
                                 cache: false,
                                 success:function(response){
                                 agentlist=[];
                                 
                                 var res = response.meta_keywords.split(",");
                                 console.log("1122445566337*******"+res);
                                 console.log("1122445566337*******"+res.length);
                                 for (var i = 0; i < res.length; i++) {
                                 //                                 alert(JSON.stringify(agentdata.length));
                                 for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                 //                                 alert(JSON.stringify($scope.agents[j]));
                                 if(res[i]==$scope.agents[j].id){
                                 
                                 agentlist.push($scope.agents[j]);
                                 }
                                 }
                                 }
                                 $scope.agentslists=agentlist;
                                 $state.reload();
                                 console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                 console.log("1122445566337#########"+agentlist);
                                 },
                                 error:function(error,status){
                                 
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          //                          $state.reload();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   
                   
                   if(bookAppwall.element_wall == '0'){
                   $scope.elementAppWall = false;
                   }else if(bookAppwall.element_wall == '1'){
                   $scope.elementAppWall = true;
                   }
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.appTitle = appTitle;
                   $scope.contentTitle = contentTitle;
                   $scope.contentText = contentText;
                   $scope.contentPrice = contentPrice;
                   $scope.contentSquarefeet = Square_Feet;
                   $scope.contentAddress = Address;
                   $scope.contentHousecondition = House_Condition;
                   $scope.contentAdditional_field = contentAdditional_field;
                   //  $scope.contentTags = amenities;
                   $scope.contentVideo = contentVideo;
                   $scope.buttonDeleteArray = imagelist;
                   $scope.deliberatelyTrustDangerousSnippet = function() {
                   return $sce.trustAsHtml($scope.contentText);
                   };
                   
                   $scope.deliberatelyTrustDangerousSnippet1 = function() {
                   return $sce.trustAsHtml($scope.contentVideo);
                   };
                   
                   $scope.agentavatar = function(val){
                   if(val!=null){
                   return val;
                   }
                   else{
                   return 'img/avatar.png'
                   }
                   };
                   
                   $scope.goHome = function(){
                   $state.go('previewChapter1');
                   }
                   
                   $scope.preContentBack = function(){
                   if(elementArray.length==1){
                   $state.go('previewChapter1');
                   }
                   else{
                   $state.go('previewSubTitle1');
                   }
                   
                   }
                   
                   $scope.switchAppEditor = function(){
                   editData = 'Edit';
                   $state.go('addElement');
                   }
                   
                   $scope.addcontentBack = function(){
                   $state.go('previewContent1');
                   }
                   
                   
                   $scope.elementAppwallgoFun = function(){
                   $state.go('elementAppWall1');
                   }
                   
                   
                   });





/*---------------Add Button -----------*/

control.controller('addButtonCtrl',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicActionSheet){
                   image = undefined;
                   $scope.bar_color=barcolor;
                   $ionicScrollDelegate.scrollTop();
                   $scope.Title = appTitle;
                   $scope.chaptercreate ={}
                   
                   
                   $scope.chaptercreate.title = '';
                   $scope.chaptercreate.image = '';
                   $scope.appImageShow = false;
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url(img/img_add.png)');
                   
                   $scope.addchapterBack = function(){
                   $state.go('previewChapter');
                   }
                   
                   function addChapterConfirm(){
                   $state.go('addContent');
                   
                   
                   }
                   
                   $scope.addchapterBack = function(){
                   $state.go('addBook');
                   }
                   

                  $("#buttonImage").change(function(){
                                           
                                           readURL1(this);
                                           });

                  function readURL1(input) {
                   if (input.files && input.files[0]) {
                   var reader = new FileReader();
                   
                   reader.onload = function (e) {
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+e.target.result+')');
                   }
                   
                   reader.readAsDataURL(input.files[0]);
                   alert(e.target.result);
                   }
                   }
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   $scope.buttonSubmitFtn = function(){
                   if(($scope.chaptercreate.title) && ($("#buttonImage").get(0).files[0])){
                   
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                          var formData = new FormData();
                          formData.append('api_key',appKey);
                          formData.append('title',$scope.chaptercreate.title);
                          formData.append('image', $("#buttonImage").get(0).files[0]);


                   
                   
                              $.ajax({
                                  type: "POST",
                                  url: "http://build.myappbuilder.com/api/buttons.json",
                                  data: formData,
                                  cache: false,
                                  contentType: false,
                                  processData: false,
                                  success:function(response){
                                      $ionicLoading.hide();
                                      buttonId = response.id;
                                      appChapter = response.title;
                                      $scope.checkBox = {};
                                      if(localStorage.checkedData == "checkedData"){
                                        addChapterConfirm();
                                      }else{
                   
                                        var myPopup = $ionicPopup.alert({
                                           template: '<div class="card"><div class="item item-text-wrap">Please Add App Contents and Images.</div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.data" value=""></label>Don\'t show Again</div></div>',
                                           title: $scope.chaptercreate.title,
                                           subTitle: 'Successfully created App Category!',
                                           scope: $scope,
                   
                                        });
                                         myPopup.then(function(res) {
                                           console.log('Tapped!', $scope.checkBox.data);
                                           if($scope.checkBox.data == true){
                                            localStorage.checkedData = "checkedData";
                                           }
                   
                                           myPopup.close();
                                           addChapterConfirm();
                                        });
                                      }
                                  },
                                  error:function(error,status){
                                      $ionicLoading.hide();
                                      //alert("Successfully")
                                      var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                                  }
                              });
                   
                   }
                   
                   else{
                   $ionicLoading.hide();
                   $ionicPopup.alert({title: 'Real Estate',content:"Enter New Listing Title and Image"});
                   }
                   }
                   });





var agentdata=[];
var agentlist=[];

control.controller('editButtonCtrl',function($scope,$state,$ionicModal,$ionicPopup,$ionicLoading,$ionicScrollDelegate,$stateParams,$http,$ionicActionSheet){
                   image = undefined;
//                   alert("hi");
                   $scope.bar_color=barcolor;
                   $ionicScrollDelegate.scrollTop();
                   $scope.Title = appTitle;
                   $scope.chaptercreate ={}
                   buttonId = $stateParams.buttonId;
                   for(var i =0; i<buttonArray.length;i++){
                   if(buttonId == buttonArray[i].id){
                   $scope.chaptercreate.title = buttonArray[i].title;
                   $('#imageShow').attr({'src':buttonArray[i].image});
                   }
                   }
                   
                   // $scope.appImageShow = true;
                   
                   $scope.addchapterBack = function(){
                   $state.go('previewChapter');
                   }
                   

                  $("#buttonImage").change(function(){
                                           
                                           readURL1(this);
                                           });

                  function readURL1(input) {
                   if (input.files && input.files[0]) {
                   var reader = new FileReader();
                   
                   reader.onload = function (e) {
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+e.target.result+')');
                   }
                   
                   reader.readAsDataURL(input.files[0]);
                   alert(e.target.result);
                   }
                   }
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   $scope.buttonSubmitFtn = function(){
                   if(($scope.chaptercreate.title) || ($scope.chaptercreate.title!='')){
                   
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if($("#buttonImage").get(0).files[0]){
                          var formData = new FormData();
                          formData.append('api_key',appKey);
                          formData.append('id',buttonId);
                          formData.append('title',$scope.chaptercreate.title);
                          formData.append('image', $("#buttonImage").get(0).files[0]);
                        }
                    else{

                      var formData = new FormData();
                          formData.append('api_key',appKey);
                          formData.append('id',buttonId);
                          formData.append('title',$scope.chaptercreate.title);

                    }


                   
                   
                              $.ajax({
                                  type: "PUT",
                                  url: "http://build.myappbuilder.com/api/buttons.json",
                                  data: formData,
                                  cache: false,
                                  contentType: false,
                                  processData: false,
                                  success:function(response){
                                      $.ajax({
                                       type: "GET",
                                       url: "http://build.myappbuilder.com/api/buttons.json",
                                       data:{'api_key':appKey},
                                       cache: false,
                                       success:function(response){
                                       $ionicLoading.hide();
                                       chapterEdit = ''
                                       buttonArray = response;
                                       $state.go('previewChapter');
                                       
                                       },
                                       error:function(error,status){
                                       $ionicLoading.hide();
                                       alert(error.responseText)
                                       }
                                       });
                                  },
                                  error:function(error,status){
                                      $ionicLoading.hide();
                                      //alert("Successfully")
                                      var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Listings',content:error.error});
                                  }
                              });
                   
                   }else{
                   $ionicLoading.hide();
                   $ionicPopup.alert({title: 'Listings',content:"Enter New Listing Title "});
                   }
                   }
                   
                   
                   });




function alertDismissed(){
}
var buttonDeleteArray = [];
var createButtonId;
var agentmethod;
var agentid;
var avatar=[];
control.controller('addElementCtrl',function($scope,$state,$ionicModal,$ionicPopup,$ionicLoading,$ionicScrollDelegate,$sce,$http,$ionicActionSheet){
                   image = undefined;
                   if(elementId==''){
                   editData = "";
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          
                          console.log("1122445566sduh"+$scope.agents.length);
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   }
                   else{
                   editData = "Edit";
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          
                          console.log("1122445566sduh"+$scope.agents.length);
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                 data: {"api_key":appKey,"id":elementId},
                                 cache: false,
                                 success:function(response){
                                 agentlist=[];
                                 agentid=[];
                                 
                                 var res = response.meta_keywords.split(",");
                                 
                                 console.log("1122445566337*******"+res);
                                 console.log("1122445566337*******"+res.length);
                                 for (var i = 0; i < res.length; i++) {
                                 //                                 alert(JSON.stringify(agentdata.length));
                                 for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                 //                                 alert(JSON.stringify($scope.agents[j]));
                                 if(res[i]==$scope.agents[j].id){
                                 
                                 agentlist.push($scope.agents[j]);
                                 agentid.push($scope.agents[j].id);
                                 }
                                 }
                                 }
                                 $scope.addAgent.id = agentid;
                                 $scope.agentslists=agentlist;
                                 $state.reload();
                                 console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                 console.log("1122445566337#########"+agentlist);
                                 },
                                 error:function(error,status){
                                 
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          //                          $state.reload();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   }
                   
                   $scope.bar_color=barcolor;
                   $scope.addAgent = {
                   id : []
                   };
                   $scope.addagent={};
                   var imageField_name;
                   $ionicScrollDelegate.scrollTop();
                   var chapterTitletxt = appTitle+":"+chapterTitle;
                   $scope.appChapter = chapterTitletxt;
                   $scope.contentCreate = {};
                   $scope.contentCreate.elementText = '';
                   $scope.contentVideo = contentVideo;
                   //alert(chapterTitle+" : "+contentTitle)
                   buttonDeleteArray = [];
                   
                   
                   
                   $scope.buttonDeleteArray = imagelist;
                   
                   $scope.deliberatelyTrustDangerousSnippet = function(url) {
                   return $sce.trustAsHtml(url);
                   };
                   
                   $scope.buttonDeletevideo = function(btnId){
                    var confirmPopup = $ionicPopup.confirm({
                                       title: 'Real Estate',
                                       template: 'Are you sure you want to delete this image?'
                                       });
                   confirmPopup.then(function(res) {
                                     if(res) {
                                     console.log('You are sure');
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $.ajax({
                          type: "DELETE",
                          url: "http://build.myappbuilder.com/api/elements/images.json",
                          data: {"api_key":appKey,"element_id":elementId,"id":btnId},
                          cache: false,
                          success:function(response){
                          $ionicLoading.hide();
                          $scope.imagelist();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                          } else {
                   console.log('You are not sure');
                   }
                   });
                   
                   }
                   
                   $scope.tinymceOptions = {
                   
                   menubar: false,
                   theme: "modern",
                   plugins: [
                             "advlist autolink lists link image  charmap print preview anchor",
                             "searchreplace wordcount visualblocks visualchars code fullscreen",
                             "emoticons textcolor",
                             ],
                   
                   toolbar1: "insertfile undo redo | styleselect | bold italic | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify forecolor backcolor",
                   
                   file_browser_callback: function(field_name, url, type, win) {
                   
                   $('#width').attr("type","number");
                   $('#height').attr("type","number");
                   $('#imageSelect').click();
                   imageField_name = field_name;
                   //alert($('input[name="width"]').val());
                   $('#width').blur(function(){
                                    
                                    if($('#width').val() == ''){
                                    $('#width').val("150");
                                    $('#height').val('');
                                    }else if($('#width').val() <= 320){
                                    }else{
                                    
                                    $('#width').val("150");
                                    $('#height').val('');
                                    }
                                    });
                   $('#height').blur(function(){
                                     if($('#height').val() <= 320){
                                     $('#height').val('150');
                                     }
                                     });
                   },
                   image_advtab: true,
                   height: "200px",
                   width: "100%",
                   resize: true,
                   };
                   
                   
                   
                   $("#imageSelect").change(function(event){
                                            
                                            $('#imageSelect').off('click');
                                            event.preventDefault();
                                            $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                                            
                                            var formDataKey ;
                                            var formDataId ;
                                            if(elementId){
                                            formDataKey = appKey;
                                            formDataId = elementId;
                                            }else{
                                            formDataKey = 'd4b2e8f5473bd5023797436ce9556620';
                                            formDataId = '2188';
                                            }
                                            cordova.exec(function(e){
                                                         // alert(e)
                                                         $('#'+imageField_name).val(e);
                                                         $('#width').val("150");
                                                         $ionicLoading.hide();
                                                         },function(e){alert(e);$ionicLoading.hide();},"EchoimageUploads" , "echoimageUploads",[formDataKey,formDataId,"Image"]);
                                            
                                            });
                   
                   
                   
                   
                   
                   $ionicModal.fromTemplateUrl('new_video.html',{
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.videoModal = modal;
                                                       });
                   $ionicModal.fromTemplateUrl('addnew_agent.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.addagentModal = modal;
                                                       });
                   
                   $ionicModal.fromTemplateUrl('new_agent.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.agentModal = modal;
                                                       });
                   
                   $ionicModal.fromTemplateUrl('new_audio.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.audioModal = modal;
                                                       });
                   
                   //$scope.audioText.title = contentTitle;
                   
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   
                   
                   $scope.showActionsheet2 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess2, onFail2, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess2, onFail2, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess2(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper6 > .btn-file-input6').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail2(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   $scope.agentavatar = function(val){
                   if(val!=null){
                   return val;
                   }
                   else{
                   return 'img/avatar.png'
                   }
                   };
                   
                   $scope.fncng = function(val){
                   $scope.fname = val;
                   }
                   $scope.lncng = function(val){
                   $scope.lname = val;
                   }
                   $scope.emcng = function(val){
                   $scope.email = val;
                   }
                   $scope.phcng = function(val){
                   $scope.phone = val;
                   }
                   
                   $scope.editagent = function(val1,val2,val3,val4,val5){

                   var name = val3.split("   ");
                   $scope.addagentModal.show();
                   $('.fname').val(name[0]);
                  $('.lname').val(name[1]);
                  $('.email').val(val4);
                  $('.phone').val(val5);
                   $scope.fname = name[0];
                   $scope.lname = name[1];
                   $scope.email = val4;
                   $scope.phone = val5;
                   agentmethod="PUT";
                   agentid = val1;
                   if(val2==null){
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url("img/avatar.png")');
                   }
                   else{
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+val2+')');
                   }
                   
             $("#tst").change(function(){
                                          readURL5(this);
                                          });
                   
                   };
                   
                   
                   $scope.addnewagentshowFtn = function(){
                    
                   $scope.fname = '';
                   $scope.lname = '';
                   $scope.email = '';
                   $scope.phone = '';
                   $scope.addagentModal.show();
                   agentmethod="POST";
                   
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url(img/avatar.png)');
                  $('.fname').val('');
                  $('.lname').val('');
                  $('.email').val('');
                  $('.phone').val('');
                   
                  $("#tst").change(function(){
                                          readURL5(this);
                                          });

                   };
                   
                                    function readURL5(input) {
                                    if (input.files && input.files[0]) {
                   
                                    var reader = new FileReader();
                                    
                                    reader.onload = function (e) {
                                    $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+e.target.result+')');
                   
                                    }
                                    
                                    reader.readAsDataURL(input.files[0]);
                  
                                    }
                                    }
                   
                   $scope.agentUploadFtn = function(){
                   if($scope.contentCreate.elementTitle){
                   if(contentTitle){
                   $scope.agentModal.show();
                   }else{
                   
                   contentTitle = $scope.contentCreate.elementTitle;
                   $scope.elementCreateSubmitFtn1();
                   $scope.agentModal.show();
                   }
                   
                   }else{
                   $ionicPopup.alert({title: 'Content',content:'Please Enter Your Content Title!'});
                   }
                   };
                   
                   $scope.addagentFtn = function(){
//                   alert($scope.addAgent.id);
                   console.log($scope.addAgent.id.length);
                   if($scope.addAgent.id!=''){
//                   $scope.addAgent.id = '';
                   $scope.addAgentid = '';
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   for (var i = 0; i < $scope.addAgent.id.length; i++) {
                   if(i==0){
                   $scope.addAgentid = $scope.addAgent.id[i];
                   }
                   else{
                   $scope.addAgentid = $scope.addAgentid+","+$scope.addAgent.id[i];
                   }
                   }
                   console.log($scope.addAgentid);
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                          data: {"api_key":appKey,"id":elementId,"meta_keywords":$scope.addAgentid},
                          cache: false,
                          success:function(response){
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 //                          $ionicLoading.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 
                                 console.log("1122445566sduh"+$scope.agents.length);
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                        data: {"api_key":appKey,"id":elementId},
                                        cache: false,
                                        success:function(response){
                                        agentlist=[];
                                        
                                        var res = response.meta_keywords.split(",");
                                        console.log("1122445566337*******"+res);
                                        console.log("1122445566337*******"+res.length);
                                        for (var i = 0; i < res.length; i++) {
                                        //                                 alert(JSON.stringify(agentdata.length));
                                        for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                        //                                 alert(JSON.stringify($scope.agents[j]));
                                        if(res[i]==$scope.agents[j].id){
                                        
                                        agentlist.push($scope.agents[j]);
                                        }
                                        }
                                        }
                                        $scope.agentslists=agentlist;
                                        $state.reload();
                                        $ionicLoading.hide();
                                        console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                        console.log("1122445566337#########"+agentlist);
                                        alert('Selected agent(s) has been added succesfully!',function(){$scope.agentModal.hide();},chapterTitle,'Done');
                                        },
                                        error:function(error){
                                        $ionicLoading.hide();
                                        var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                        }
                                        });
                                 
                                 
                                 },
                                 error:function(error){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   }
                   else{
                    $ionicPopup.alert({title: 'Content',content:"Please select an Agent"});
                   }
                  
//                   alert($scope.addAgent.id);
                   };
                   
                   
                   
                   
                   $scope.addnewagentFtn = function(){
                   
                    // alert($scope.addagent.fname);
                   $ionicLoading.show({
                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                                      });
                if($scope.fname!==""){
                   if($scope.email!==""){

                   if(agentmethod=="POST"){
                   // console.log($('#tst').get(0).files[0]);
                   if($('#tst').get(0).files[0]){
                   var formData11 = new FormData();
                   formData11.append('api_key',appKey);
                   formData11.append('subscriber[firstname]',$scope.fname);
                   formData11.append('subscriber[lastname]',$scope.lname);
                   formData11.append('subscriber[username]',$scope.email);
                   formData11.append('subscriber[email]',$scope.email);
                   formData11.append('subscriber[phone]',$scope.phone);
                  formData11.append('subscriber[avatar]',$('#tst').get(0).files[0]);
                   
                   
                   $http.post('http://build.myappbuilder.com/api/subscribers.json',formData11,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            agentid=response.id;
                                         
                                         $.ajax({
                                                type: "GET",
                                                url: "http://build.myappbuilder.com/api/subscribers.json",
                                                data: {"api_key":appKey},
                                                cache: false,
                                                success:function(response){
                                                $ionicLoading.hide();
                                                //                          $scope.imagelist();
                                                agentdata=response;
                                                $scope.agents=response;
                                                image = undefined;
                                                $scope.addagentModal.hide();
                                                $state.reload();
                                                
                                                },
                                                error:function(error,status){
                                                $ionicLoading.hide();
                                                var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                                }
                                                });
                                         
                                         
                            
                            })
                   .error(function(error,status,headers,config){
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          });
                   


                   }
                   else{
                   var formData11 = new FormData();
                   formData11.append('api_key',appKey);
                   ormData11.append('subscriber[firstname]',$scope.fname);
                   formData11.append('subscriber[lastname]',$scope.lname);
                   formData11.append('subscriber[username]',$scope.email);
                   formData11.append('subscriber[email]',$scope.email);
                   formData11.append('subscriber[phone]',$scope.phone);
                  // formData11.append('subscriber[avatar]',$('#tst').get(0).files[0]);
                   
                   
                   $http.post('http://build.myappbuilder.com/api/subscribers.json',formData11,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            agentid=response.id;
                            console.log(agentid);
                            $.ajax({
                                   type: "GET",
                                   url: "http://build.myappbuilder.com/api/subscribers.json",
                                   data: {"api_key":appKey},
                                   cache: false,
                                   success:function(response){
                                   $ionicLoading.hide();
                                   //                          $scope.imagelist();
                                   agentdata=response;
                                   $scope.agents=response;
                                   image = undefined;
                                   $state.reload();
                                   $scope.addagentModal.hide();
                                   
                                   },
                                   error:function(error,status){
                                   $ionicLoading.hide();
                                   var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                   }
                                   });
                            
                            
                            })
                   .error(function(error,status,headers,config){
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          });
                   
                   
                   
                   }
                   }
                   else if(agentmethod=="PUT"){

                   if($('#tst').get(0).files[0]){


                    $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey,"firstname":$scope.fname,"id":agentid,"lastname":$scope.lname,"username":$scope.email,"email":$scope.email,"phone":$scope.phone,"image":$('#tst').get(0).files[0]},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 $state.reload();
                                 $scope.addagentModal.hide();
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   
                   }
                   else{
                  
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey,"firstname":$scope.fname,"id":agentid,"lastname":$scope.lname,"username":$scope.email,"email":$scope.email,"phone":$scope.phone},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 $state.reload();
                                 $scope.addagentModal.hide();
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   }
                   }}
                   else{
                   $ionicLoading.hide();
                   $ionicPopup.alert({title: 'Content',content:'Please Enter a Valid Email'});
                   }
                   }
                   
                   else{
                   $ionicLoading.hide();
                   $ionicPopup.alert({title: 'Content',content:'Please Enter a Valid Name'});
                   }
                   
                   };
                   
                   
                   $scope.videoUploadFtn = function(){
                    $("#images").val('');
                   if($scope.contentCreate.elementTitle){
                   if(contentTitle){
                   $scope.videoModal.show();
                   }else{
                   
                   contentTitle = $scope.contentCreate.elementTitle;
                   $scope.elementCreateSubmitFtn1();
                   $scope.videoModal.show();
                   }
                   $('.file-input-wrapper6 > .btn-file-input6').css('background-image', 'url(img/btn_image.png)');
                   $("#images").change(function(){
                                          readURL1(this);
                                          });
                   
                   }else{
                   $ionicPopup.alert({title: 'Content',content:'Please Enter Your Content Title!'});
                   }
                   }
                   
                   
                   
                   $scope.imagelist = function(){
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          console.log("*************"+JSON.stringify(response));
                          buttonArray = response;
                          contentVideo = '';
                          buttonDeleteArray = [];
                          for (var i = 0; i < buttonArray.length; i++) {
                          for (var j = 0; j < buttonArray[i].elements.length; j++) {
                          
                          if((chapterTitle == buttonArray[i].title) && (contentTitle == buttonArray[i].elements[j].title)){
                          if(buttonArray[i].first_paragraph_type == "default"){
                          console.log("*************"+JSON.stringify(buttonArray[i].elements[j].images));
                          $scope.buttonDeleteArray = buttonArray[i].elements[j].images;
                          
                          
                          }
                          }
                          }
                          }
                          
                          $state.reload();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                          }
                          });
                   };

                   

                   function readURL1(input) {
                   if (input.files && input.files[0]) {
                   var reader = new FileReader();
                   
                   reader.onload = function (e) {
                   $('.file-input-wrapper6 > .btn-file-input6').css('background-image', 'url('+e.target.result+')');
                   }
                   
                   reader.readAsDataURL(input.files[0]);
                   alert(e.target.result);
                   }
                   }
             
                   $scope.create_video = function(){
                   
//                   alert("error12: "+$('input[name="video"]').get(0).files[0]);
                   if($('#images').get(0).files[0]){
                   
                   for(var i=0;i<buttonArray.length;i++){
                   
                   if(buttonArray[i].id == buttonId ){
                   
                   var formData1 = new FormData();
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   var letter = (chapterTitle).charAt(0).toUpperCase();
                   
                   formData1.append('image', $('#images').get(0).files[0]);
                   $ionicLoading.show({
                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                                      });
                   
                    $http.post('http://build.myappbuilder.com/api/elements/images.json',formData1,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            console.log(JSON.stringify(response));

                                
                                $scope.videoModal.hide();
                                $ionicLoading.hide();
                                $scope.imagelist();
                            
                            
                            })
                   .error(function(error,status,headers,config){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          });
                   
                   }
                   }
                   }else{
                   
                   
                   var alertPopup = $ionicPopup.alert({
                                                      title: 'Realtors',
                                                      template: 'Please Choose Images!'
                                                      });
                   alertPopup.then(function(res) {
                                   //console.log('Thank you for not eating my delicious ice cream cone');
                                   });
                   
                   }
                   }
                   
                   $scope.addcontentBack = function(){
                   if(editData == "Edit"){
                   editData = "";
                   $state.go('previewSubTitle');
                   }else{
                   $state.go('previewSubTitle');
                   }
                   }
                   
                   if(editData == "Edit"){
                   console.log(editData);
                   $scope.contentCreate.elementTitle = contentTitle;
                   $scope.contentCreate.elementText = contentText;
                   $scope.contentCreate.elementPrice = contentPrice;
                   $scope.contentCreate.elementSquarefeet = Square_Feet;
                   $scope.contentCreate.elementAddress = Address;
                   $scope.contentCreate.elementHousecondition = House_Condition;
                   $scope.contentCreate.elementAdditional_field = contentAdditional_field;
                   $scope.contentCreate.elementSquarefeet = Square_Feet;
                   $scope.contentCreate.elementAddress = Address;
                   $scope.contentCreate.elementHousecondition = House_Condition;
                   $scope.contentCreate.elementTag = amenities;
                   $scope.buttonDeleteArray = imagelist;
                   
                   
                   }else{
                   console.log(editData);
                   $scope.contentCreate.elementTitle = '';
                   $scope.contentCreate.elementText = '';
                   $scope.contentCreate.elementPrice = '';
                   $scope.contentCreate.elementSquarefeet = '';
                   $scope.contentCreate.elementAddress = '';
                   $scope.contentCreate.elementHousecondition = '';
                   $scope.contentCreate.elementAdditional_field = '';
                   $scope.contentCreate.elementSquarefeet = '';
                   $scope.contentCreate.elementAddress = '';
                   $scope.contentCreate.elementHousecondition = '';
                   $scope.contentCreate.elementTag = '';
                   $scope.buttonDeleteArray = '';
                   }
                   
                   
                   
                   $scope.elementCreateSubmitFtn1 = function(){
                   
                   var datatag=$scope.contentCreate.elementTag;
                   console.log($scope.contentCreate.elementTag);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait...',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                if($scope.contentCreate.elementTag=='' || $scope.contentCreate.elementTag==undefined){
                   amenities='';
                   }
                   else{
                   for(var i=0;i<datatag.length;i++){
                   //                   amenities.push(response[i].name);
                   if(i==0){
                   amenities = datatag[i].text;
                   }
                   else{
                   amenities = amenities+','+datatag[i].text;
                   }
                   }
                   }
                   console.log("**************************"+amenities);
                   var formData1 = new FormData();
                   var formData2 = new FormData();
                   var formData3 = new FormData();
                   var formData4 = new FormData();
                   var formData5 = new FormData();
                   var formData6 = new FormData();
                   var methodData ='';
                   var urlData = ''
                   var myPopup;
                   console.log(elementId);
                   console.log($scope.contentCreate.tags);
                   
                   if(editData == "Edit"){
                   urlData ='http://build.myappbuilder.com/api/elements/update_default.json'
                   methodData = "PUT"
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
                   //                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }else{
                   urlData ='http://build.myappbuilder.com/api/elements/create_default.json'
                   methodData = "POST"
                   formData1.append('api_key',appKey);
                   formData1.append('button_id',buttonId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
                   //                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }
                   console.log(Square_Feetid);
                   console.log(JSON.stringify(formData2));
                   
                   
                   
                   $.ajax({
                          type: methodData,
                          url: urlData,
                          data: formData1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          //console.log(JSON.stringify(response));
                          elementId = response.id;
                          if(methodData == "POST"){
                          
                          formData2.append('api_key',appKey);
                          formData2.append('element_id',elementId);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('element_id',elementId);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('element_id',elementId);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('id',elementId);
                          formData5.append('tags',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('element_id',elementId);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/buttons.json",
                                        data:{'api_key':appKey},
                                        cache: false,
                                        success:function(response){
                                        $ionicLoading.hide();
                                        editData = "Edit";
                                        buttonArray = response;
                                        
                                        
                                        },
                                        error:function(error,status){
                                        $ionicLoading.hide();
                                        var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          
                          
                          
                          }
                          else{
                          
                          formData2.append('api_key',appKey);
                          formData2.append('id',Square_Feetid);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('id',Addressid);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('id',House_Conditionid);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('element_id',elementId);
                          formData5.append('value',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('id',contentPriceid);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          }
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "Edit";
                                 buttonArray = response;
                                 //                                 $state.go('previewSubTitle');
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                 }
                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          }
                          });
                   };
                   
                   
                   console.log(elementId);
                   $scope.elementCreateSubmitFtn = function(){
//                   alert($scope.contentCreate.elementText);
                   var datatag=$scope.contentCreate.elementTag;
                   console.log($scope.contentCreate.elementTag);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait...',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                if($scope.contentCreate.elementTag=='' || $scope.contentCreate.elementTag==undefined){
                   amenities='';
                   }
                   else{
                   for(var i=0;i<datatag.length;i++){
                   //                   amenities.push(response[i].name);
                   if(i==0){
                   amenities = datatag[i].text;
                   }
                   else{
                   amenities = amenities+','+datatag[i].text;
                   }
                   }
                   }
                   console.log("**************************"+amenities);
                   var formData1 = new FormData();
                   var formData2 = new FormData();
                   var formData3 = new FormData();
                   var formData4 = new FormData();
                   var formData5 = new FormData();
                   var formData6 = new FormData();
                   var methodData ='';
                   var urlData = ''
                   var myPopup;
                   console.log(elementId);
                   console.log($scope.contentCreate.tags);
                   
                   if(editData == "Edit"){
                   urlData ='http://build.myappbuilder.com/api/elements/update_default.json'
                   methodData = "PUT"
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }else{
                   urlData ='http://build.myappbuilder.com/api/elements/create_default.json'
                   methodData = "POST"
                   formData1.append('api_key',appKey);
                   formData1.append('button_id',buttonId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }
                   
                   
                   
                   $.ajax({
                          type: methodData,
                          url: urlData,
                          data: formData1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          //console.log(JSON.stringify(response));
                          elementId = response.id;
                          if(methodData == "POST"){
                          
                          formData2.append('api_key',appKey);
                          formData2.append('element_id',elementId);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('element_id',elementId);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('element_id',elementId);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('id',elementId);
                          formData5.append('tags',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('element_id',elementId);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/buttons.json",
                                        data:{'api_key':appKey},
                                        cache: false,
                                        success:function(response){
                                        $ionicLoading.hide();
                                        editData = "Edit";
                                        buttonArray = response;
                                        $state.go('previewSubTitle');
                                        
                                        },
                                        error:function(error,status){
                                        $ionicLoading.hide();
                                        var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          
                          
                          }
                          else{
                          
                          formData2.append('api_key',appKey);
                          formData2.append('id',Square_Feetid);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('id',Addressid);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('id',House_Conditionid);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('element_id',elementId);
                          formData5.append('value',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('id',contentPriceid);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          }
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/buttons.json",
                                        data:{'api_key':appKey},
                                        cache: false,
                                        success:function(response){
                                        $ionicLoading.hide();
                                        editData = "Edit";
                                        buttonArray = response;
                                        $state.go('previewSubTitle');
                                        
                                        },
                                        error:function(error,status){
                                        $ionicLoading.hide();
                                        var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error})
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                                 }
                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Content',content:error.error});
                          }
                          });
                   }
                   
                   });



control.controller('editBookCtrl',function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicScrollDelegate, $ionicActionSheet,$http){
                   image = undefined;
                   $ionicScrollDelegate.scrollTop();
                   $scope.appcreate = {};
                   $scope.book= {};
                   $scope.appcreate.url = shareurl;
                   
                   if(fssi=='false'){
                   
                   $scope.appcreate.fssi = false;
                   }
                   else{
                   
                   $scope.appcreate.fssi = true;
                   }
                   $scope.count = function(){
                   //    alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              $state.go('listView');
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   $ionicPopup.alert({title: 'Real Estate',content:data.error});
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          $ionicPopup.alert({title: 'Real Estate',content:data.error})
                          
                          });
                   };
                   
                   
                   $scope.showActionsheet = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose Bar Color',
                                          buttons: [
                                                    { text: '<p><img src="img/light.png" style="align:left;"/>&nbsp;Light&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/stable.png" style=""/>&nbsp;Stable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/positive.png" style=""/>&nbsp;Positive&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/calm.png" style=""/>&nbsp;Calm&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/balanced.png" style=""/>&nbsp;Balanced&nbsp;</p>' },
                                                    { text: '<p><img src="img/energized.png" style=""/>&nbsp;Energized</p>' },
                                                    { text: '<p><img src="img/assertive.png" style=""/>&nbsp;Assertive&nbsp;</p>' },
                                                    { text: '<p><img src="img/royal.png" style=""/>&nbsp;Royal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/dark.png" style=""/>&nbsp;Dark&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          barcolor = 'bar-light';
                                          $scope.book.bar_color = 'light';
                                          $scope.button_color='button-light';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==1){
                                          barcolor = 'bar-stable';
                                          $scope.book.bar_color = 'stable';
                                          $scope.button_color='button-stable';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==2){
                                          barcolor = 'bar-positive';
                                          $scope.book.bar_color = 'positive';
                                          $scope.button_color='button-positive';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==3){
                                          barcolor = 'bar-calm';
                                          $scope.book.bar_color = 'calm';
                                          $scope.button_color='button-calm';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==4){
                                          barcolor = 'bar-balanced';
                                          $scope.book.bar_color = 'balanced';
                                          $scope.button_color='button-balanced';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==5){
                                          barcolor = 'bar-energized';
                                          $scope.book.bar_color = 'energized';
                                          $scope.button_color='button-energized';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==6){
                                          barcolor = 'bar-assertive';
                                          $scope.book.bar_color = 'assertive';
                                          $scope.button_color='button-assertive';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==7){
                                          barcolor = 'bar-royal';
                                          $scope.book.bar_color = 'royal';
                                          $scope.button_color='button-royal';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==8){
                                          barcolor = 'bar-dark';
                                          $scope.book.bar_color = 'dark';
                                          $scope.button_color='button-dark';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else{
                                          $state.reload();
                                          }
                                          
                                          return true;
                                          },
                                          destructiveButtonClicked: function() {
                                          console.log('DESTRUCT');
                                          return true;
                                          }
                                          });
                   };
                   
                   
                   $scope.addBookBack = function(){
                   $state.go('listView');
                   }
                   
                   $scope.appcreate.gridBookTitle = bookTitle;
                   $scope.appcreate.gridBookDesc = bookDesc;
                   if(bookImg){
                   $('#imageShow1').attr({'src':bookImg});
                   }
                   
                   function readURL(input) {
                   if (input.files && input.files[0]) {
                   var reader = new FileReader();
                   
                   reader.onload = function (e) {
                   $('.file-input-wrapper > .btn-file-input').css('background-image', 'url('+e.target.result+')');
                   }
                   
                   reader.readAsDataURL(input.files[0]);
                   }
                   }

                  $("#bookImage").change(function(){
                                         readURL(this);
                                         });
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper > .btn-file-input').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   alert('Failed because: ' + message);
                   }
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/apps/general.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response1){
                          console.log('**************123456*************'+response1.bar_color);
                          console.log(JSON.stringify(response1));
                          
                          barcolor = 'bar-'+response1.bar_color;
                          $scope.bar_color=barcolor;
                          $scope.book.bar_color=response1.bar_color;
                          $state.reload();
                          },
                          error:function(error,status){
                          
                          alert(error.responseText)
                          }
                          });
                   
                   
                   $scope.colors = ['light', 'stable', 'positive', 'calm', 'balanced', 'energized', 'assertive', 'royal', 'dark'];
                   $scope.change_bar_color = function(){
                   barcolor = 'bar-'+$scope.book.bar_color;
                   $scope.bar_color=barcolor;
                   $state.reload();
                   }
                   $scope.change_button_color = function(){
                   $scope.button_color = 'button-'+$scope.book.button_color;
                   $state.reload();
                   }
                   
                   $scope.change_bar_button_color = function(){
                   if($scope.book.bar_button_color == ""){
                   $scope.bar_button_color = 'button-clear';
                   $state.reload();
                   }
                   else{
                   $scope.bar_button_color = 'button-'+$scope.book.bar_button_color;
                   $state.reload();
                   }
                   }
                   
                   $scope.createAppFtn = function(){
                  if(($scope.appcreate.gridBookTitle) && ($('#bookImage').get(0).files[0]) && ($scope.appcreate.url!='') && ($scope.appcreate.url!=undefined)){
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if($scope.appcreate.gridBookDesc==undefined){
                   $scope.appcreate.gridBookDesc='';
                   }

                   var booktype1 = new FormData();
                   booktype1.append("api_key",appKey);
                   booktype1.append("id",floatid);
                   booktype1.append("value",$scope.appcreate.fssi);
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:booktype1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          
                          },
                          error:function(error,status){
                          
                          }
                          });
                   
                   var booktype2 = new FormData();
                   booktype2.append("api_key",appKey);
                   booktype2.append("id",shareurlid);
                   booktype2.append("value",$scope.appcreate.url);
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:booktype2,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          
                          },
                          error:function(error,status){
                          
                          }
                          });
                   
                   var formData = new FormData();
                   formData.append('api_key',appKey);
                   formData.append('title',$scope.appcreate.gridBookTitle);
                   formData.append('description',$scope.appcreate.gridBookDesc);
                   formData.append('bar_color',$scope.book.bar_color);
                   formData.append('splash_image', $('#bookImage').get(0).files[0]);


                   $.ajax({
                                     type: "PUT",
                                     url: "http://build.myappbuilder.com/api/apps/settings/general.json",
                                data:formData,
                                     cache: false,
                                     contentType: false,
                                     processData: false,
                                     success:function(response){

                                         $.ajax({
                                                 type: "GET",
                                                 url: "http://build.myappbuilder.com/api/users.json",
                                                 data:{"api_key":appkeyResult.api_key,"id":appkeyResult.id},
                                                 cache: false,
                                                 success:function(response){
                                                 data = response;
                                                     $ionicLoading.hide();
                                                appList=[];
                  
                                                $scope.count(response.apps.length);
                   
                                                   },
                                                   error:function(error,status){
                                                     $ionicLoading.hide();
                                                     var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error})
                                                   }
                                         });
                   
                                   },error:function(error){
                                     $ionicLoading.hide();
                                     var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                                   }
                               });
                   
                    }
                   
                   else if($scope.appcreate.gridBookTitle!='' && ($scope.appcreate.url!='') && ($scope.appcreate.url!=undefined)){
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   
                   var booktype1 = new FormData();
                   booktype1.append("api_key",appKey);
                   booktype1.append("id",floatid);
                   booktype1.append("value",$scope.appcreate.fssi);
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:booktype1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          
                          },
                          error:function(error,status){
                          
                          }
                          });
                   
                   var booktype2 = new FormData();
                   booktype2.append("api_key",appKey);
                   booktype2.append("id",shareurlid);
                   booktype2.append("value",$scope.appcreate.url);
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:booktype2,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          
                          },
                          error:function(error,status){
                          
                          }
                          });

                   var formData = new FormData();
                   formData.append('api_key',appKey);
                   formData.append('title',$scope.appcreate.gridBookTitle);
                   formData.append('description',$scope.appcreate.gridBookDesc);
                   formData.append('bar_color',$scope.book.bar_color);

                   console.log(JSON.stringify(formData));

                               $.ajax({
                                     type: "PUT",
                                     url: "http://build.myappbuilder.com/api/apps/settings/general.json",
                                data:formData,
                                     cache: false,
                                     contentType: false,
                                     processData: false,
                                     success:function(response){

                                         $.ajax({
                                                 type: "GET",
                                                 url: "http://build.myappbuilder.com/api/users.json",
                                                 data:{"api_key":appkeyResult.api_key,"id":appkeyResult.id},
                                                 cache: false,
                                                 success:function(response){
                                                 data = response;
                                                     $ionicLoading.hide();
                                                appList=[];
                  
                                                $scope.count(response.apps.length);
                   
                                                   },
                                                   error:function(error,status){
                                                     $ionicLoading.hide();
                                                     var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error})
                                                   }
                                         });
                   
                                   },error:function(error){
                                     $ionicLoading.hide();
                                     var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error});
                                   }
                               });
                   
                   }
                   
                   else{
                   alert("Enter Real Estate Title & Enter Social Share URL");
                   }
                   }
                   });


var messages = "";

control.controller("appWallCtrl",function($scope,$state,$ionicLoading,$http,$ionicPopup){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   var button_wall = '';
                   var element_wall = '';
                   
                   $scope.appWallHome = function(){
                   $state.go('listView');
                   }
                   
                   $scope.appwallBack = function(){
                   $state.go('previewChapter');
                   }
                   
                   $scope.checkBox = [];
                   if((bookAppwall.button_wall == "0")&&(bookAppwall.element_wall == "0")){
                   $scope.checkBox.button = false;
                   $scope.checkBox.element = false;
                   }else if(bookAppwall.button_wall == "0"){
                   $scope.checkBox.button = false;
                   $scope.checkBox.element = true;
                   }else if(bookAppwall.element_wall == "0"){
                   $scope.checkBox.button = true;
                   $scope.checkBox.element = false;
                   }else{
                   $scope.checkBox.button = true;
                   $scope.checkBox.element = true;
                   }
                   
                   $scope.appwallSettings = function(){
                   var myPopup = $ionicPopup.show({
                                                  template: '<div class="card"><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.button" value=""></label>Each Chapter Can Have a Unique Wall </div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.element" value=""></label>Each Content Can Have a Unique Wall  </div></div><div style="width:100%;"><div style="width:50%;float:left;"><div style="width:50%;" class="button button-clear" ng-click="popupClose();"><img src="img/btn_cancel.png" style="width:100%;height:auto;"/></div></div><div style="width:50%;float:left;" ><div style="width:50%;float:right;" class="button button-clear " ng-click="popoupSave();"><img src="img/save.png" style="width:100%;height:auto;"/></div></div></div>',
                                                  title: 'AppWall Setting',
                                                  subTitle: $scope.appTitle,
                                                  scope: $scope,
                                                  
                                                  });
                   
                   $scope.popupClose=function() {
                   console.log('Tapped!', $scope.checkBox.element+" : "+$scope.checkBox.button);
                   myPopup.close();
                   }
                   
                   $scope.popoupSave = function(){
                   if(($scope.checkBox.button != false) && ($scope.checkBox.element != false)){
                   button_wall = "1";
                   element_wall = "1";
                   }else if($scope.checkBox.button != false){
                   button_wall = "1";
                   element_wall = "0";
                   }else if($scope.checkBox.element != false){
                   button_wall = "0";
                   element_wall = "1";
                   }else{
                   button_wall = "0";
                   element_wall = "0";
                   }
                   
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   $http.post('http://build.myappbuilder.com/api/app_wall_settings.json',{api_key: appKey,button_wall:button_wall,element_wall:element_wall})
                   .success(function(data,status,headers,config){
                            $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json',type:"GET",data:{'api_key':appKey},
                                   success:function(response){
                                   console.log(JSON.stringify(response));
                                   bookAppwall = response;
                                   $ionicLoading.hide();
                                   myPopup.close();
                                   },
                                   error:function(){
                                   $ionicLoading.hide();
                                   myPopup.close();
                                   }
                                   });
                            
                            })
                   .error(function(data,status,headers,config){
                          $ionicLoading.hide();
                          console.log(JSON.stringify(data));
                          myPopup.close();
                          })
                   
                   
                   }
                   
                   
                   }
                   
                   
                   $scope.messages = "";
                   $scope.messages.data="";
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          $ionicLoading.hide();
                          messages = response;
                          appWallPostFun();
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error})
                          }
                          });
                   
                   
                   
                   });

control.controller("appWallCtrl1",function($scope,$state,$ionicLoading,$http,$ionicPopup,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   var button_wall = '';
                   var element_wall = '';
                   
                   $scope.appWallHome = function(){
                   $state.go('listView1');
                   }
                   
                   $scope.appwallBack = function(){
                   $state.go('previewChapter1');
                   }
                   
                   $scope.checkBox = [];
                   if((bookAppwall.button_wall == "0")&&(bookAppwall.element_wall == "0")){
                   $scope.checkBox.button = false;
                   $scope.checkBox.element = false;
                   }else if(bookAppwall.button_wall == "0"){
                   $scope.checkBox.button = false;
                   $scope.checkBox.element = true;
                   }else if(bookAppwall.element_wall == "0"){
                   $scope.checkBox.button = true;
                   $scope.checkBox.element = false;
                   }else{
                   $scope.checkBox.button = true;
                   $scope.checkBox.element = true;
                   }
                   
                   $scope.appwallSettings = function(){
                   var myPopup = $ionicPopup.show({
                                                  template: '<div class="card"><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.button" value=""></label>Each Chapter Can Have a Unique Wall </div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.element" value=""></label>Each Content Can Have a Unique Wall  </div></div><div style="width:100%;"><div style="width:50%;float:left;"><div style="width:50%;" class="button button-clear" ng-click="popupClose();"><img src="img/btn_cancel.png" style="width:100%;height:auto;"/></div></div><div style="width:50%;float:left;" ><div style="width:50%;float:right;" class="button button-clear " ng-click="popoupSave();"><img src="img/save.png" style="width:100%;height:auto;"/></div></div></div>',
                                                  title: 'AppWall Setting',
                                                  subTitle: $scope.appTitle,
                                                  scope: $scope,
                                                  
                                                  });
                   
                   $scope.popupClose=function() {
                   console.log('Tapped!', $scope.checkBox.element+" : "+$scope.checkBox.button);
                   myPopup.close();
                   }
                   
                   $scope.popoupSave = function(){
                   if(($scope.checkBox.button != false) && ($scope.checkBox.element != false)){
                   button_wall = "1";
                   element_wall = "1";
                   }else if($scope.checkBox.button != false){
                   button_wall = "1";
                   element_wall = "0";
                   }else if($scope.checkBox.element != false){
                   button_wall = "0";
                   element_wall = "1";
                   }else{
                   button_wall = "0";
                   element_wall = "0";
                   }
                   
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   $http.post('http://build.myappbuilder.com/api/app_wall_settings.json',{api_key: appKey,button_wall:button_wall,element_wall:element_wall})
                   .success(function(data,status,headers,config){
                            $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json',type:"GET",data:{'api_key':appKey},
                                   success:function(response){
                                   console.log(JSON.stringify(response));
                                   bookAppwall = response;
                                   $ionicLoading.hide();
                                   myPopup.close();
                                   },
                                   error:function(){
                                   $ionicLoading.hide();
                                   myPopup.close();
                                   }
                                   });
                            
                            })
                   .error(function(data,status,headers,config){
                          $ionicLoading.hide();
                          console.log(JSON.stringify(data));
                          myPopup.close();
                          })
                   
                   
                   }
                   
                   
                   }
                   
                   
                   $scope.messages = "";
                   $scope.messages.data="";
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          $ionicLoading.hide();
                          messages = response;
                          appWallPostFun();
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error})
                          }
                          });
                   
                   
                   
                   });



function appWallPostFun(){
    
    var bodyMgs = '';
    var mgs_id = [];
    var body = [];
    var created_at = [];
    var parent_id = [];
    var element_name = [];
    var button_name = [];
    var sender_name = [];
    var sender_id = [];
    var sender_avatar_url = [];
    var replyappend = '';
    var z = 0;
    var p = 0;
    //alert("msgLen:"+messages.length);
    if(messages.length > 0){
        $.each( messages, function( key, value ) {
               $.each( value, function( k, v ) {
                      if(k == "id"){
                      mgs_id.push(v);
                      }else if(k == "created_at"){
                      created_at.push(v);
                      }else if(k == "parent_id"){
                      parent_id.push(v);
                      }else if(k == "body"){
                      body.push(v);
                      }else if(k == "element_name"){
                      element_name.push(v);
                      }else if(k == "button_name"){
                      button_name.push(v);
                      }else if(k == "sender_name"){
                      sender_name.push(v);
                      }else if(k == "sender_id"){
                      sender_id.push(v);
                      }else if(k == 'sender_avatar_url'){
                      if(v == null){
                      v = 'img/face.png';
                      }
                      sender_avatar_url.push(v);
                      }
                      });
               });
    }else{
        bodyMgs = '<a><p align="justify" class="divback2"><font color="black" size="2">No Result Found</font></p></a>';
    }
    
    for(var i=0;i<body.length;i++){
        
        if(parent_id[i] == null){
            p=0;
            for(var j=0;j<body.length;j++){
                p = p+1;
                if(mgs_id[i] == parent_id[j]){
                    z= -1;
                    var k = parseInt(p)+z;
                    if(localStorage.sender_id == sender_id[k]){
                        if(element_name[k] != null && button_name[k] != null){
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }else if(button_name[k] != null){
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }else{
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }
                    }else{
                        if(element_name[k] != null && button_name[k] != null){
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }else if(button_name[k] != null){
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }else{
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }
                    }
                }else{
                    
                }
                
            }
            
            if(localStorage.sender_id == sender_id[i]){
                if(element_name[i] != null && button_name[i] != null){
                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                    
                }
                
                else if(button_name[i] != null){
                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                    
                }else{
                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                    
                }
            }

            
            else{
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><hr><div><p align="justify">'+body[i]+'</p><hr></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                
            }
            
            replyappend ='';
            
        }else{
        }
    }
    
    $('#appwallListview').append(bodyMgs).trigger('create');
    
    if($('.replyHide').is(':visible')){
        $('.replyHide').toggle();
    }else{
        
    }
    
    $(".replyMgs").click(function(){
                         replyMgsNo1 = (this.id).split('-');
                         replyMgsNo = mgs_id[replyMgsNo1[1]];
                         var replyHide = "replyHide"+replyMgsNo1[1];
                         $('#'+replyHide).toggle();
                         });
    
    $(".deleteMgs").click(function(){
                          // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                          var deleteMgsNo = (this.id).split('-');
                          //alert(appKey);
                          //alert(mgs_id[deleteMgsNo[1]]);
                          if(localStorage.appwallLoginData){
                          $.ajax({url:'http://build.myappbuilder.com/api/messages.json?api_key='+appKey+'&message_id='+mgs_id[deleteMgsNo[1]], 
                                 type:"DELETE",
                                 success:function(response){
                                 
                                 
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/messages.json",
                                        data:{'api_key':appKey},
                                        cache: false,
                                        success:function(response){
                                        // $ionicLoading.hide();
                                        messages = response;
                                        $('#appwallListview').empty();
                                        appWallPostFun();
                                        },
                                        error:function(error,status){
                                        // $ionicLoading.hide();
                                        
                                        var error = JSON.parse(error.responseText);
                                        if(error.error == "Unauthorized"){
                                        alert("Please Login")
                                        }else {
                                        alert("Login Error!");
                                        }
                                        }
                                        });
                                 },
                                 error:function(msg){ 
                                  // $ionicLoading.hide(); 
                                  alert(JSON.stringify(msg));}
                                 });
                          }else{
                          // login();
                          }
                          });
    
    
    
}

function replymessageFun(){
    if(localStorage.appwallLoginData){
        var replyarray = "replymessage"+replyMgsNo1[1];
        var replymessage = $('#'+replyarray).val();
        if(replymessage == ''){
            alert("Please Enter Your Reply...");
        }else{
            // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{'message[body]':replymessage,'message[parent_id]':replyMgsNo,'message[sender_id]':localStorage.sender_id,'api_key':appKey},
                   success:function(response){
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          // $ionicLoading.hide();
                          $('#'+replyarray).val('');
                          messages = response;
                          $('#appwallListview').empty();
                          appWallPostFun();
                          },
                          error:function(error,status){
                          // $ionicLoading.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ 
                    // $ionicLoading.hide(); 
                    alert("Failure");}
                   });
        }
    }else{
        // login();
    }
    
}



function postmessageFun(){
    if(localStorage.appwallLoginData){
        
        var postmessage = $('#postmessage').val();
        if(postmessage == ''){
            alert("Please Enter Your Comments...");
        }else{
            // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{'message[body]':postmessage,'message[sender_id]':localStorage.sender_id,'api_key':appKey},
                   success:function(response){
                   
                   $('#appwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          $('#postmessage').val('');
                          // $ionicLoading.hide();
                          messages = response;
                          appWallPostFun();
                          },
                          error:function(error,status){
                          // $ionicLoading.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ 
                    // $ionicLoading.hide(); 
                    alert("Failure");}
                   });
        }
    }else{
        //login();
    }
    
}


function relative_time(date_str) {
    if (!date_str) {return;}
    date_str = $.trim(date_str);
    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
    var parsed_date = new Date(date_str);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
    delta=(delta<2)?2:delta;
    var r = '';
    if (delta < 60) {
        r = delta + ' secs ago';
    } else if(delta < 120) {
        r = 'a min ago';
    } else if(delta < (45*60)) {
        r = (parseInt(delta / 60, 10)).toString() + ' mins ago';
    } else if(delta < (2*60*60)) {
        r = 'an hr ago';
    } else if(delta < (24*60*60)) {
        r = '' + (parseInt(delta / 3600, 10)).toString() + ' hrs ago';
    } else if(delta < (48*60*60)) {
        r = 'a day ago';
    } else {
        r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
    }
    return '' + r;
}



control.controller("buttonAppWallCtrl",function($scope,$state,$ionicLoading,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   
                   $scope.appwallBack = function(){
                   $state.go('previewSubTitle');
                   }
                   
                   messages = '';
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'button_id':buttonId},
                          cache: false,
                          success:function(response){
                          $ionicLoading.hide();
                          messages = response;
                          ButtonAppWallPostFun();
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   
                   
                   
                   });

control.controller("buttonAppWallCtrl1",function($scope,$state,$ionicLoading,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   
                   $scope.appwallBack = function(){
                   $state.go('previewSubTitle1');
                   }
                   
                   messages = '';
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'button_id':buttonId},
                          cache: false,
                          success:function(response){
                          $ionicLoading.hide();
                          messages = response;
                          ButtonAppWallPostFun();
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   
                   
                   
                   });


function ButtonAppWallPostFun(){
    
    var bodyMgs = '';
    var mgs_id = []; 
    var body = [];
    var created_at = [];
    var parent_id = []; 
    var element_name = [];
    var button_name =[];
    var sender_name = [];
    var sender_id = [];
    var sender_avatar_url = [];
    var replyappend ='';
    var z = 0;
    var p = 0;
    //alert("msgLen:"+messages.length);
    if(messages.length > 0){
        $.each( messages, function( key, value ) {
               $.each( value, function( k, v ) {
                      if(k == "id"){
                      mgs_id.push(v);
                      }else if(k == "created_at"){
                      created_at.push(v);
                      }else if(k == "parent_id"){
                      parent_id.push(v);
                      }else if(k == "body"){
                      body.push(v);
                      }else if(k == "element_name"){
                      element_name.push(v);
                      }else if(k == "button_name"){
                      button_name.push(v);
                      }else if(k == "sender_name"){
                      sender_name.push(v);
                      }else if(k == "sender_id"){
                      sender_id.push(v);
                      }else if(k == 'sender_avatar_url'){
                      if(v == null){
                      v = 'img/face.png';
                      }
                      sender_avatar_url.push(v);
                      }
                      });
               });
    }else{
        bodyMgs = '<a><p align="justify" class="divback2" ><font color="black" size="2">No Result Found</font></p></a>';
    }
    
    for(var i=0;i<body.length;i++){
        
        if(parent_id[i] == null){
            p=0;
            for(var j=0;j<body.length;j++){
                p = p+1;
                if(mgs_id[i] == parent_id[j]){
                    z = -1;
                    var k = parseInt(p)+z;
                    if(localStorage.sender_id == sender_id[k]){
                        replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="ButtondeleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                    }else{
                        replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                    }
                }else{
                    
                }
            }
            
            if(localStorage.sender_id == sender_id[i]){
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="ButtonreplyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="ButtondeleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="ButtonreplyHide bar bar-header item-input-inset" id="ButtonreplyHide'+i+'" ><label class="item-input-wrapper"><input id="Buttonreplymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:ButtonreplymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
            }

            else{
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
            }
            replyappend ='';
            
        }else{
            
        }
    }
    
    $('#ButtonappwallListview').append(bodyMgs).trigger("create");
    
    if($('.ButtonreplyHide').is(':visible')){
        $('.ButtonreplyHide').toggle();
    }else{
        
    }
    
    $(".ButtonreplyMgs").click(function(){
                               replyMgsNo1 = (this.id).split('-');
                               replyMgsNo = mgs_id[replyMgsNo1[1]];
                               var replyHide = "ButtonreplyHide"+replyMgsNo1[1];
                               $('#'+replyHide).toggle();
                               });
    
    $(".ButtondeleteMgs").click(function(){
                                var deleteMgsNo = (this.id).split('-');
                                // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                                if(localStorage.appwallLoginData){
                                $.ajax({url:'http://build.myappbuilder.com/api/messages.json?api_key='+appKey+'&message_id='+mgs_id[deleteMgsNo[1]], type:"DELETE",data:{},
                                       success:function(response){
                                       $('#ButtonappwallListview').empty();
                                       $.ajax({
                                              type: "GET",
                                              url: "http://build.myappbuilder.com/api/messages.json",
                                              data:{'api_key':appKey,'button_id':buttonId},
                                              cache: false,
                                              success:function(response){
                                              // $ionicLoading.hide();
                                              messages = response;
                                              ButtonAppWallPostFun();
                                              },
                                              error:function(error,status){
                                              // $ionicLoading.hide();
                                              
                                              var error = JSON.parse(error.responseText);
                                              if(error.error == "Unauthorized"){
                                              alert("Please Login")
                                              }else {
                                              alert("Login Error!");
                                              }
                                              }
                                              });
                                       },
                                       error:function(){ 
                                        // $ionicLoading.hide(); 
                                        alert("Failure");}
                                       });
                                }else{
                                
                                }
                                });
    
}

function ButtonreplymessageFun(){
    if(localStorage.appwallLoginData){
        var replyarray = "Buttonreplymessage"+replyMgsNo1[1];
        var replymessage = $('#'+replyarray).val();
        if(replymessage == ''){
            alert("Please Enter Your Reply...");
        }else{
            // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{"message[body]":replymessage,"message[parent_id]":replyMgsNo,"message[sender_id]":localStorage.sender_id,"api_key":appKey,"button_id":buttonId},
                   success:function(response){
                   $('#ButtonappwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'button_id':buttonId},
                          cache: false,
                          success:function(response){
                          // $ionicLoading.hide();
                          $('#'+replyarray).val('');
                          messages = response;
                          ButtonAppWallPostFun();
                          },
                          error:function(error,status){
                          // $ionicLoading.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ 
                    // $ionicLoading.hide(); 
                    alert("Failure");}
                   });
        }
    }else{
        
    }
    
}



function ButtonpostmessageFun(){
    if(localStorage.appwallLoginData){
        var postmessage = $('#Buttonpostmessage').val();
        if(postmessage == ''){
            alert("Please Enter Your Comments...");
        }else{
            // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{"message[body]":postmessage,"message[sender_id]":localStorage.sender_id,"api_key":appKey,"button_id":buttonId},
                   success:function(response){
                   $('#ButtonappwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'button_id':buttonId},
                          cache: false,
                          success:function(response){
                          // $ionicLoading.hide();
                          $('#Buttonpostmessage').val('');
                          messages = response;
                          ButtonAppWallPostFun();
                          },
                          error:function(error,status){
                          // $ionicLoading.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ 
                    // $ionicLoading.hide(); 
                    alert(" Network Failure ");}
                   });
        }
    }else{
        
    }
}



/* ----------------------------------------------------------- Element AppWall ----------------------------------------------------------------------- */


control.controller('elementAppWallCtrl',function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicScrollDelegate,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   $scope.appwallBack = function(){
                   $state.go('previewContent');
                   }
                   
                   messages = '';
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   $.ajax({url:'http://build.myappbuilder.com/api/messages.json',type:"GET",data:{"api_key":appKey,"element_id":elementId},
                          success:function(response){
                          $ionicLoading.hide();
                          messages = response;
                          ElementAppWallPostFun();
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   
                   });

control.controller('elementAppWallCtrl1',function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicScrollDelegate,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   $scope.appwallBack = function(){
                   $state.go('previewContent1');
                   }
                   
                   messages = '';
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   $.ajax({url:'http://build.myappbuilder.com/api/messages.json',type:"GET",data:{"api_key":appKey,"element_id":elementId},
                          success:function(response){
                          $ionicLoading.hide();
                          messages = response;
                          ElementAppWallPostFun();
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   
                   });


function ElementAppWallPostFun(){
    
    var bodyMgs = '';
    var mgs_id = []; 
    var body = [];
    var created_at = [];
    var parent_id = []; 
    var element_name = [];
    var button_name =[];
    var sender_name = [];
    var sender_id = [];
    var sender_avatar_url = [];
    var replyappend ='';
    var z = 0;
    var p = 0;
    //alert("msgLen:"+messages.length);
    if(messages.length > 0){
        $.each( messages, function( key, value ) {
               $.each( value, function( k, v ) {
                      if(k == "id"){
                      mgs_id.push(v);
                      }else if(k == "created_at"){
                      created_at.push(v);
                      }else if(k == "parent_id"){
                      parent_id.push(v);
                      }else if(k == "body"){
                      body.push(v);
                      }else if(k == "element_name"){
                      element_name.push(v);
                      }else if(k == "button_name"){
                      button_name.push(v);
                      }else if(k == "sender_name"){
                      sender_name.push(v);
                      }else if(k == "sender_id"){
                      sender_id.push(v);
                      }else if(k == 'sender_avatar_url'){
                      if(v == null){
                      v = 'img/face.png';
                      }
                      sender_avatar_url.push(v);
                      }
                      });
               });
    }else{
        bodyMgs = '<a><p align="justify" class="divback2" ><font color="black" size="2">No Result Found</font></p></a>';
    }
    
    for(var i=0;i<body.length;i++){
        
        if(parent_id[i] == null){
            p=0;
            for(var j=0;j<body.length;j++){
                p = p+1;
                if(mgs_id[i] == parent_id[j]){
                    z = -1;
                    var k = parseInt(p)+z;
                    if(localStorage.sender_id == sender_id[k]){
                        replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="ElementdeleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                    }else{
                        replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                    }
                }else{
                    
                }
                
            }
            if(localStorage.sender_id == sender_id[i]){
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="ElementreplyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="ElementdeleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="ElementreplyHide bar bar-header item-input-inset" id="ElementreplyHide'+i+'" ><label class="item-input-wrapper"><input id="Elementreplymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:ElementreplymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
            }

            else{
                
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%"><div style="width:50%;float:left;"></div></div></div></div><div style="width:100%;"></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                
            }
            replyappend ='';
            
        }else{
            
        }
    }
    
    $('#ElementappwallListview').append(bodyMgs).trigger("create");
    
    if($('.ElementreplyHide').is(':visible')){
        $('.ElementreplyHide').toggle();
    }else{
        
    }
    
    $(".ElementreplyMgs").click(function(){
                                replyMgsNo1 = (this.id).split('-');
                                replyMgsNo = mgs_id[replyMgsNo1[1]];
                                var replyHide = "ElementreplyHide"+replyMgsNo1[1];
                                $('#'+replyHide).toggle();
                                });
    
    $(".ElementdeleteMgs").click(function(){
                                 var deleteMgsNo = (this.id).split('-');
                                 //alert(mgs_id[deleteMgsNo[1]])
                                 // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                                 if(localStorage.appwallLoginData){
                                 $.ajax({url:'http://build.myappbuilder.com/api/messages.json?api_key='+appKey+'&message_id='+mgs_id[deleteMgsNo[1]], type:"DELETE",data:{},
                                        success:function(response){
                                        $('#ElementappwallListview').empty();
                                        $.ajax({
                                               type: "GET",
                                               url: "http://build.myappbuilder.com/api/messages.json",
                                               data:{'api_key':appKey,'element_id':elementId},
                                               cache: false,
                                               success:function(response){
                                               // $ionicLoading.hide();
                                               messages = response;
                                               ElementAppWallPostFun();
                                               },
                                               error:function(error,status){
                                               // $ionicLoading.hide();
                                               
                                               var error = JSON.parse(error.responseText);
                                               if(error.error == "Unauthorized"){
                                               alert("Please Login")
                                               }else {
                                               alert("Login Error!");
                                               }
                                               }
                                               });
                                        },
                                        error:function(){ 
                                          // $ionicLoading.hide(); 
                                          alert("Failure");}
                                        });
                                 }else{
                                 
                                 }
                                 });
    
}

function ElementreplymessageFun(){
    if(localStorage.appwallLoginData){
        var replyarray = "Elementreplymessage"+replyMgsNo1[1];
        var replymessage = $('#'+replyarray).val();
        if(replymessage == ''){
            alert("Please Enter Your Reply...");
        }else{
            // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{"message[body]":replymessage,"message[parent_id]":replyMgsNo,"message[sender_id]":localStorage.sender_id,"api_key":appKey,"element_id":elementId},
                   success:function(response){
                   $('#ElementappwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'element_id':elementId},
                          cache: false,
                          success:function(response){
                          // $ionicLoading.hide();
                          $('#'+replyarray).val('');
                          messages = response;
                          ElementAppWallPostFun();
                          },
                          error:function(error,status){
                          // $ionicLoading.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          alert("Please Login")
                          }else {
                          alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ 
                    // $ionicLoading.hide(); 
                    alert("Failure");}
                   });
        }
    }else{
        
    }
    
}



function ElementpostmessageFun(){
    if(localStorage.appwallLoginData){
        var postmessage = $('#Elementpostmessage').val();
        if(postmessage == ''){
            alert("Please Enter Your Comments...");
        }else{
            // $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{"message[body]":postmessage,"message[sender_id]":localStorage.sender_id,"api_key":appKey,"element_id":elementId},
                   success:function(response){
                   $('#ElementappwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'element_id':elementId},
                          cache: false,
                          success:function(response){
                          // $ionicLoading.hide();
                          $('#Elementpostmessage').val('');
                          messages = response;
                          ElementAppWallPostFun();
                          },
                          error:function(error,status){
                          // $ionicLoading.hide();
                          
                          var error = JSON.parse(error.responseText);
                          $ionicPopup.alert({title: 'Real Estate',content:error.error})
                          }
                          });
                   },
                   error:function(){ 
                    // $ionicLoading.hide(); 
                    alert(" Network Failure ");}
                   });
        }
    }else{
        
    }
}





