var app = angular.module('GodsEye')

app.controller('AdminController', ['$scope', 'apiService', function ($scope, apiService) {
  apiService.getLocations()
    .then(function (res) {
      $scope.locations = res.data.locations
    })
    .catch(function (res) {
      console.log(res)
    })
}])
