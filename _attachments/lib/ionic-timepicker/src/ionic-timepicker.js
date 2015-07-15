//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

angular.module('ionic-timepicker', ['ionic', 'ionic-timepicker.templates'])

// Defining `ionicTimepicker` directive
  .directive('ionicTimepicker', ['$ionicPopup', function ($ionicPopup) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        etime: '=etime',        //epoch time getting from a template
        format: '=format',      //format getting from a template
        step: '=step',          //step getting from a template
        callback: '=callback'   //callback function
      },
      link: function (scope, element, attrs) {

        element.on("click", function () {

          var obj = {epochTime: scope.etime, step: scope.step, format: scope.format};

          scope.time = {hours: 0, minutes: 0, meridian: ""};

          var objDate = obj.epochTime;       // Epoch time in milliseconds.

          scope.increaseHours = function () {
            scope.time.hours = Number(scope.time.hours);
            if (obj.format == 12) {
              if (scope.time.hours != 12) {
                scope.time.hours += 1;
              } else {
                scope.time.hours = 1;
              }
            }
            if (obj.format == 24) {
              if (scope.time.hours != 23) {
                scope.time.hours += 1;
              } else {
                scope.time.hours = 0;
              }
            }
            scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
          };

          scope.decreaseHours = function () {
            scope.time.hours = Number(scope.time.hours);
            if (obj.format == 12) {
              if (scope.time.hours > 1) {
                scope.time.hours -= 1;
              } else {
                scope.time.hours = 12;
              }
            }
            if (obj.format == 24) {
              if (scope.time.hours > 0) {
                scope.time.hours -= 1;
              } else {
                scope.time.hours = 23;
              }
            }
            scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
          };

          scope.increaseMinutes = function () {
            scope.time.minutes = Number(scope.time.minutes);

            if (scope.time.minutes != (60 - obj.step)) {
              scope.time.minutes += obj.step;
            } else {
              scope.time.minutes = 0;
            }
            scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
          };

          scope.decreaseMinutes = function () {
            scope.time.minutes = Number(scope.time.minutes);
            if (scope.time.minutes != 0) {
              scope.time.minutes -= obj.step;
            } else {
              scope.time.minutes = 60 - obj.step;
            }
            scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
          };

          if (obj.format == 12) {

            scope.time.meridian = (objDate.getHours() >= 12) ? "PM" : "AM";
            scope.time.hours = (objDate.getHours() > 12) ? ((objDate.getHours() - 12)) : (objDate.getHours());
            scope.time.minutes = (objDate.getMinutes());

            if (scope.time.hours == 0 && scope.time.meridian == "AM") {
              scope.time.hours = 12;
            }

            scope.changeMeridian = function () {
              scope.time.meridian = (scope.time.meridian === "AM") ? "PM" : "AM";
            };

            $ionicPopup.show({
              templateUrl: 'time-picker-12-hour.html',
              title: '<strong>12-Hour Format</strong>',
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: 'Close',
                  onTap: function (e) {
                    scope.callback(undefined);
                  }
                },
                {
                  text: 'Set',
                  type: 'button-positive',
                  onTap: function (e) {
                    scope.loadingContent = true;
                    console.log(scope.time);
                    var hours = parseInt(scope.time.hours);
                    var hours = hours != 12 ? hours : 0;
                    if (scope.time.meridian === "AM") {
                      scope.etime.setHours(hours);
                    } else if (scope.time.meridian === "PM") {
                      console.log(hours);
                      scope.etime.setHours(hours + 12);
                    }
                    scope.etime.setMinutes(scope.time.minutes);
                    scope.callback(scope.etime);
                  }
                }
              ]
            })

          }else if (obj.format == 24) {

            scope.time.hours = (objDate.getHours());
            scope.time.minutes = (objDate.getMinutes());

            $ionicPopup.show({
              templateUrl: 'time-picker-24-hour.html',
              title: '<strong>24-Hour Format</strong>',
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: 'Close',
                  onTap: function (e) {
                    scope.callback(undefined);
                  }
                },
                {
                  text: 'Set',
                  type: 'button-positive',
                  onTap: function (e) {

                    scope.loadingContent = true;

                    var totalSec = 0;

                    if (scope.time.hours != 24) {
                      totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
                    } else {
                      totalSec = scope.time.minutes * 60;
                    }
                    scope.etime = totalSec;
                    scope.callback(scope.etime);
                  }
                }
              ]
            })

          }

        });

      }
    };
  }]);