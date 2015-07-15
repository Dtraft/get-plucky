// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('get-lucky', ['ionic', 'ngLodash', 'ionic-timepicker']);

app.run(function($ionicPlatform, $http) {
  //set basic auth
  $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('beedstionspoideaturicurn' + ':' + 'MaCfPmfyYN4iq5jpUmtCQY36');
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('eventList', {
        url: '/events',
        templateUrl: 'templates/event-list.html',
        controller: 'eventListController'
      })
      .state('eventDetail', {
        url: '/event/:eventId',
        templateUrl: 'templates/event-detail.html',
        controller: 'eventDetailController'
      });
      $urlRouterProvider.otherwise('/events');     
});
