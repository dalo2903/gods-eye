var app = angular.module('GodsEye')

app.controller('identifyController', ['$scope', 'apiService', function ($scope, apiService) {
  $scope.identify = function () {
    var formData = new FormData()
    formData.append('sampleFile', document.getElementById('image').files[0])
    apiService.identify(formData)
      .then(function (res) {
        console.log(res)
        $.each(res.data, function (index, ele) {
          $('#table').append('<tr><td>' + ele.name + '</td><td>' + ele.MSSV + '</td></tr>')
        })

      })
      .catch(function (res) {
        console.log(res)
      })
  }
}])
