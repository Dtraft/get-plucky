app.controller('eventDetailController', 
function($scope, $stateParams, $ionicModal, $ionicPopup, $ionicListDelegate, $user, $db, lodash){
  
  //LOAD ITEMS
  $scope.loadItems = function(){
    $db.getEvent($stateParams.eventId).then(function(data){
      //Set scope vars
      $scope.event = data.event;
      $scope.items = data.rsvps;
      //prep view
      $scope.updateScope();
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  
  $scope.updateScope = function(){
    console.log($user);
    $scope.user = {
      id: $user.id
    };
    $scope.user.item = lodash.find($scope.items, {userId: $scope.user.id} );
    $scope.event.attendees = lodash.sum($scope.items, 'attendees');
  };
  
  //LETS START IT UP
  $scope.loadItems();
  
 //USER ACTIONS
  $scope.addRsvp = function(){
    //set vars behind the scenes
    $scope.newItem.userId = $user.id;
    $scope.newItem.type =  "rsvp";
    $scope.newItem.eventId = $scope.event._id;
    
    if(!$scope.newItem._id){
      var now = new Date();
      $scope.newItem.created = now.toISOString(); 
      $scope.items.push($scope.newItem);
       $db.save($scope.newItem);
    }else{
      //editing existing item
      angular.extend($scope.originalItem, $scope.newItem);
      $db.save($scope.originalItem);
    }
    $scope.updateScope();
    $scope.closeModal();
  };
  
  $scope.closeModal = function(){
    $scope.modalScope.hide().then(function(){
      $scope.newItem = {
        type: "rsvp",
        eventId: $scope.event._id
      };
      $scope.originalItem = {};
    });
  };
  
  $scope.removeRsvp = function(item){
    var confirmPopup = $ionicPopup.confirm({
       title: 'Un-RSVP',
       template: 'Are you sure?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $db.delete(item);
         $scope.items = lodash.without($scope.items, item);
         $scope.updateScope();
         $scope.closeModal();
       }
     });
  };
  
  $scope.setUser = function(id){
    $user.set(id);
    $scope.updateScope();
    $ionicListDelegate.closeOptionButtons();
  };
  
  $scope.showHelp = function(){
    var alertPopup = $ionicPopup.prompt({
     title: 'Copy the URL below to invite your friends!',
     inputDefault: window.location
    });
  };
  
  
  //NEW ITEM
  $scope.newItem = {};
  $ionicModal.fromTemplateUrl('templates/add-item.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modalScope) {
    $scope.modalScope = modalScope;
  });
  $scope.rsvp = function(editItem) {
    console.log(editItem);
    if(editItem){
      $scope.newItem = angular.copy(editItem);
      $scope.originalItem = editItem;
      
    }
    $scope.modalScope.show();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalScope.remove();
  });
  
  
  
});

app.controller('eventListController',
function($scope, $stateParams, $ionicModal, $ionicPopup, $user, $db, $filter, lodash){
  
  //INIT
  $scope.loadItems = function(){
    $scope.items = [];
    $db.getEventsForUser().then(function(events){
      $scope.items = events;
    });
    $scope.$broadcast('scroll.refreshComplete');
  };
  
  //Now load good sir.
  $scope.loadItems();
  
 //USER ACTIONS
  $scope.saveEvent = function(){
    $scope.newItem.userId = $user.id;
    //set the date to ISO string
    console.log($scope.newItem);
    var copy = angular.copy($scope.newItem);
    copy.date = $scope.newItem.date.toISOString();
    
    if(!copy._id){
      $scope.items.push(copy);
       $db.save(copy);
    }else{
      //editing existing item
      angular.extend($scope.originalItem, copy);
      $db.save($scope.originalItem);
    }
    $scope.closeModal();
  };
  
  $scope.closeModal = function(){
    $scope.modalScope.hide().then(function(){
      $scope.newItem = {
        type: "event",
        date: now
      };
      $scope.originalItem = {};
      $scope.view = {};
    });
  };
  
  $scope.removeEvent = function(item){
    var confirmPopup = $ionicPopup.confirm({
       title: 'Remove Event',
       template: 'Are you sure?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         $db.delete(item);
         $scope.items = lodash.without($scope.items, item);
         $scope.closeModal();
       }
     });
  };
  
  //MODAL
  var now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setHours(now.getHours() + 1);
  $scope.newItem = {
    type: "event",
    date: now
  };
  //view for displaying the date in textfield
  $scope.view = {};
  //create the modal
  $ionicModal.fromTemplateUrl('templates/add-event.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modalScope) {
    $scope.modalScope = modalScope;
  });
  $scope.addEvent = function(editItem) {
    console.log(editItem);
    if(editItem){
      //set the time too!
      $scope.view.displayTime = $filter('date')(editItem.date, 'h:mm a');
      $scope.newItem = angular.copy(editItem);
      $scope.newItem.date = new Date(editItem.date);
      $scope.originalItem = editItem;
    }
    $scope.modalScope.show();
  };
  $scope.timePickerCallback = function (val) {
    //set time for display
    console.log(val);
    $scope.view.displayTime = $filter('date')(val, 'h:mm a');
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalScope.remove();
  });
});