app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

app.factory('$user', function($localstorage){
  var user = $localstorage.get('user');
  if(!user){
    user = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
    $localstorage.set('user', user);
  } 
  return {
    id: user,
    set: function(id){
      this.id = id;
      $localstorage.set('user', id);
    }
  };
});

app.factory('$db', ['$http', '$q', '$user', 'lodash', function ($http, $q, $user, lodash){
  var url = 'https://getlucky.cloudant.com/plucky/';
  return {
    getEventsForUser: function(){
      var deferred = $q.defer();
      var now = new Date();
      var now = now.toISOString();
      var config = {
        params: {
          startkey: '[\"' + $user.id + '\",\"' + now + '\"]',
          endkey: '[\"' + $user.id + '\", {}]',
          include_docs: true 
        }
      };
      $http.get(url + '_design/event/_view/byUserId', config)
      .success(function(response){
        console.log(response);
        var docs = lodash.pluck(response.rows,'doc');
        deferred.resolve(docs);
      });
      console.log(deferred);
      return deferred.promise;
    },
    getEvent: function(eventId){
      var deferred = $q.defer();
      
      var config = {
        params: {
          startkey: '[\"' + eventId + '\",0]',
          endkey: '[\"' + eventId + '\", {}]',
          include_docs: true 
        }
      };
      $http.get(url + '_design/event/_view/byId', config)
     .success(function(response){
       console.log(response);
       
       deferred.resolve({
         event: lodash(response.rows).findWhere({value: 0}).doc,
         rsvps: lodash(response.rows).where({value: 1}).pluck('doc').value()
       });
     });
     return deferred.promise;
    },
    save: function (doc){
      delete doc.$$hashKey;
      console.log(doc);
      if(doc._id){
       $http.put(url + doc._id, doc)
        .success(function(response){
          doc._rev = response.rev;
          console.log(doc);
       }).error(function(error){
         console.log(error);
       });
      }else{
       $http.post(url, doc)
        .success(function(response){
          doc._id = response.id;
          doc._rev = response.rev;
          console.log(doc);
       }).error(function(error){
         console.log(error);
       });
      }
    },
    delete: function(doc){
      $http.delete(url + doc._id + '?rev=' + doc._rev)
      .success(function(response){
        console.log(response);
      }).error(function(error){
        console.log(error);
      });
    }
    
  };
}]);