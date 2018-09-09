var app = angular.module('GodsEye')
app.controller('PostByLocationController', ['$scope', 'apiService', function ($scope, apiService) {
  let locationId = $('#locationId').text().trim()
  apiService.getPostsByLocation(locationId)
    .then(function success (res) {
      $scope.posts = res.data.posts
    }).catch(function error (res) {
      console.log(res.data.message)
    })

  apiService.getLocation(locationId)
    .then(function (res) {
      $scope.location = res.data.location
    })
    .catch(function (res) {
      console.log(res.data.message)
    })
}])
