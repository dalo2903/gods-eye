var app = angular.module('GodsEye')

app.controller('identifyController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.identify = function () {
    var formData = new FormData()
    formData.append('sampleFile', document.getElementById('image').files[0])
    apiService.identify(formData)
      .then(function (res) {
        console.log(res)
      })
      .catch(function (res) {
        console.log(res)
      })
  }
}])
