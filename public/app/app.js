angular.module('tubenotes', [
  'tubenotes.search',
  'tubenotes.watch',
  'tubenotes.services',
  'ngRoute'
])

.controller('appController', function($scope) {
  $scope.currentVideo = "https://www.youtube.com/embed/4ZAEBxGipoA";
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/user/login.html',
      controller: ''
    })
    .when('/watch', {
      templateUrl: 'app/watch/watch.html',
      controller: 'WatchController'
    })
    .when('/search', {
      templateUrl: 'app/search/search.html',
      controller: 'SearchController'
    });
});