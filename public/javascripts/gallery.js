var app = angular.module('GodsEye')

app.controller('galleryController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.images = []
  apiService.getImages()
    .then(function (res) {
      $scope.images = res.data.images
    })
    .catch(function (res) {
      console.log(res)
    })
}])
