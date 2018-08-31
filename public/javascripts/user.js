var app = angular.module('GodsEye')

app.controller('UserController', ['$scope', 'apiService', function ($scope, apiService) {
  apiService.getPersons()
    .then(function (res) {
      $scope.persons = res.data.persons
    })
    .catch(function (res) {
      console.log(res)
    })

  apiService.getPostsSameUserCreated()
    .then(function (res) {
      $scope.posts = res.data.posts
    })
    .catch(function (res) {
      console.log(res)
    })
}])
