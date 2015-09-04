
var app = angular.module('iBook',['ionic', 'starter.controllers','ui.tinymce','checklist-model']);

app.config(function($stateProvider,$urlRouterProvider){
           
//    $stateProvider.state('app', {
//            url: "/app",
//            abstract: true,
//            templateUrl: "templates/menu.html",
//            controller: ''
//    })

	  $stateProvider.state('editContent',{
      url: '/editContent',
      templateUrl: 'editContent.html',
      controller: 'editContentCtrl'
  	});

	  $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
  	});
           
    $stateProvider.state('login1', {
      url: '/login1',
      templateUrl: 'templates/login1.html',
      controller: 'loginCtrl1'
    });
           
    $stateProvider.state('menu', {
      url: '/menu',
      templateUrl: 'templates/menu.html',
      controller: 'menuCtrl'
    });

  	$stateProvider.state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerCtrl'
  	});
           
    $stateProvider.state('agents', {
      url: '/agents',
      templateUrl: 'templates/agents.html',
      controller: 'agentsCtrl'
    });
  	
  	/*$stateProvider.state('bookShelf', {
      url: '/bookShelf',
      templateUrl: 'templates/bookShelf.html',
      controller: 'bookShelfCtrl'
  	});*/

  	$stateProvider.state('listView',{
      url: '/listView',
      templateUrl: 'templates/listView.html',
      controller: 'listViewCtrl'
  	});
           
    $stateProvider.state('listView1',{
       url: '/listView1',
       templateUrl: 'templates/listView1.html',
       controller: 'listViewCtrl1'
    });
    
    $stateProvider.state('addBook',{
      url: '/addBook',
      templateUrl: 'templates/addBook.html',
      controller: 'addBookCtrl'
    });

    $stateProvider.state('editBook',{
      url: '/editBook',
      templateUrl: 'editBook.html',
      controller: 'editBookCtrl'
    });

    $stateProvider.state('addChapter',{
        url: '/addChapter',
        templateUrl: 'templates/addChapter.html',
        controller: 'addChapterCtrl'
    });

    $stateProvider.state('addContent',{
        url: '/addContent',
        templateUrl: 'templates/addContent.html',
        controller: 'addContentCtrl'
    });
    
  	$stateProvider.state('previewChapter',{
      url: '/previewChapter',
      templateUrl: 'templates/previewChapter.html',
      controller: 'previewChapterCtrl'
  	});
           
    $stateProvider.state('previewChapter1',{
       url: '/previewChapter1',
       templateUrl: 'templates/previewChapter1.html',
       controller: 'previewChapterCtrl1'
    });

    $stateProvider.state('chapterEdit',{
      url: '/chapterEdit',
      templateUrl: 'chapterEdit.html',
      controller: 'previewChapterCtrl'
    });

    $stateProvider.state('previewSubTitle',{
      url: '/previewSubTitle',
      templateUrl: 'templates/previewSubTitle.html',
      controller: 'previewSubTitleCtrl'
    });
           
    $stateProvider.state('previewSubTitle1',{
      url: '/previewSubTitle1',
      templateUrl: 'templates/previewSubTitle1.html',
      controller: 'previewSubTitleCtrl1'
    });

    $stateProvider.state('previewContent',{
      url: '/previewContent',
      templateUrl: 'templates/previewContent.html',
      controller: 'previewContentCtrl'
    });
           
    $stateProvider.state('previewContent1',{
      url: '/previewContent1',
      templateUrl: 'templates/previewContent1.html',
      controller: 'previewContentCtrl1'
    });

    $stateProvider.state('addElement',{
      url: '/addElement',
      templateUrl: 'addElement.html',
      controller: 'addElementCtrl'
    });

    $stateProvider.state('addButton',{
      url: '/addButton',
      templateUrl: 'addButton.html',
      controller: 'addButtonCtrl'
    });

    $stateProvider.state('editButton',{
      url: '/:buttonId/editButton',
      templateUrl: 'editButton.html',
      controller: 'editButtonCtrl'
    }); 

    $stateProvider.state('appWall',{
      url: '/appWall',
      templateUrl: 'appWall.html',
      controller: 'appWallCtrl'
    });
           
    $stateProvider.state('appWall1',{
       url: '/appWall1',
       templateUrl: 'appWall1.html',
       controller: 'appWallCtrl1'
    });
    
    $stateProvider.state('buttonAppWall',{
      url: '/buttonAppWall',
      templateUrl: 'buttonAppWall.html',
      controller: 'buttonAppWallCtrl'
    });
           
    $stateProvider.state('buttonAppWall1',{
      url: '/buttonAppWall1',
      templateUrl: 'buttonAppWall1.html',
      controller: 'buttonAppWallCtrl1'
    });

    $stateProvider.state('elementAppWall',{
      url: '/elementAppWall',
      templateUrl: 'elementAppWall.html',
      controller: 'elementAppWallCtrl'
    });
           
    $stateProvider.state('elementAppWall1',{
      url: '/elementAppWall1',
      templateUrl: 'elementAppWall1.html',
      controller: 'elementAppWallCtrl1'
    });

  	$urlRouterProvider.otherwise('/editContent');
});


app.filter('inSlicesOf', 
    ['$rootScope',  
    function($rootScope) {
      makeSlices = function(items, count){ 
        if (!count)            
          count = 3;
        
        if (!angular.isArray(items) && !angular.isString(items)) return items;
        
        var array = [];
        for (var i = 0; i < items.length; i++) {
          var chunkIndex = parseInt(i / count, 10);
          var isFirst = (i % count === 0);
          if (isFirst)
            array[chunkIndex] = [];
          array[chunkIndex].push(items[i]);
        }

        if (angular.equals($rootScope.arrayinSliceOf, array))
          return $rootScope.arrayinSliceOf;
        else
          $rootScope.arrayinSliceOf = array;
          
        return array;
      };
      
      return makeSlices; 
    }]
);

window.addEventListener('native.keyboardshow', keyboardShowHandler);

function keyboardShowHandler(e){
     cordova.plugins.Keyboard.disableScroll(false);
     //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
     console.log('Keyboard height is: ' + e.keyboardHeight);
}


