var app = angular.module('GodsEye')

app.controller('listController', ['$scope', 'apiService', function ($scope, apiService) {
  apiService.getPersons()
    .then(function (res) {
      $scope.persons = res.data.persons
    })
    .catch(function (res) {
      console.log(res)
    })
}])
